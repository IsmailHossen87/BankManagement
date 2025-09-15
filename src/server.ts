/* eslint-disable no-console */
import mongoose from "mongoose"
import { envVar } from "./app/config/env"
import app from "./app"
import { Server } from "http"
import { connectRedis } from "./app/config/redis.config"



let server: Server

const startServer = async () => {
    try {
        await mongoose.connect(envVar.DB_URL)
        console.log("MONGODB CONNECTED")
        server = app.listen(envVar.PORT, () => {
            console.log(`Server is connected${envVar.PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await connectRedis()
    await startServer()
}
)()



process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})