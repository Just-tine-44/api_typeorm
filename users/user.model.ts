import { Table, Column, Model, DataType, DefaultScope, Scopes } from "sequelize-typescript";

@DefaultScope(() => ({
    attributes: { exclude: ["passwordHash"] }, 
}))
@Scopes({
    withHash: { attributes: { include: ["passwordHash"] } }, 
})
@Table({ tableName: "users" })
export class User extends Model {
    @Column({ type: DataType.STRING, allowNull: false })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    passwordHash!: string;

   
    
    username?: string;

    
    password?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    firstName!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    lastName!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    role!: string;
}
