import "reflect-metadata";
import express from "express";
import cors from "cors";
import { errorHandler } from "./_middleware/error-handler";
import usersController from "./users/users.controller"; 
import { initialize, db } from "./_helpers/db"; 

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


async function startServer() {
    try {
        await initialize();
        if (!db.sequelize) {
            throw new Error("Sequelize initialization failed");
        }

        await db.sequelize.authenticate();


        await db.sequelize.sync({ alter: true });


        app.use("/users", usersController);
        app.use(errorHandler);

        const port = process.env.PORT || 4000;
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

startServer();
