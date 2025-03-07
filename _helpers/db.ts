import config from "../config.json";
import { Sequelize } from "sequelize-typescript";
import { createConnection } from "mysql2/promise";
import { User } from "../users/user.model";


export const db: { sequelize?: Sequelize; User?: typeof User } = {};

export async function initialize(): Promise<void> {
    const { host, port, user, password, database } = config.database;


    const connection = await createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

   
    const sequelize = new Sequelize({
        database,
        username: user,
        password,
        host,
        dialect: "mysql",
        models: [User], 
        logging: console.log, 
    });

    
    db.sequelize = sequelize;
    db.User = sequelize.models.User as typeof User; 

    try {
        
        await sequelize.sync({ alter: true });
        console.log(" Database & tables synced successfully!");
    } catch (error) {
        console.error(" Sequelize sync error:", error);
    }
}


initialize();
