import bcrypt from "bcryptjs";
import { db } from "../_helpers/db"; 
import { User } from "../users/user.model";

export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<User[]> {
    return await db.User!.findAll(); 
}

async function getById(id: number): Promise<User> {
    return await getUser(id);
}

async function create(params: Partial<User>): Promise<void> {
    const existingUser = await db.User!.findOne({ where: { email: params.email } });
    if (existingUser) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    if (!params.password) {
        throw new Error("Password is required");
    }
    const passwordHash = await bcrypt.hash(params.password, 10);

    await db.User!.create({
        email: params.email!,
        title: params.title!,
        firstName: params.firstName!,
        lastName: params.lastName!,
        role: params.role!,
        passwordHash,
    });
}

async function update(id: number, params: Partial<User>): Promise<void> {
    const user = await getUser(id);

    if (params.username && params.username !== user.getDataValue("username")) {
        const usernameExists = await db.User!.findOne({ where: { username: params.username } });
        if (usernameExists) {
            throw new Error(`Username "${params.username}" is already taken`);
        }
    }

    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    Object.assign(user, { ...params });
    await user.save();
}

async function _delete(id: number): Promise<void> {
    const user = await getUser(id);
    await user.destroy();
}


async function getUser(id: number): Promise<User> {
    const user = await db.User!.findByPk(id);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}
