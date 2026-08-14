import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://kawsarrahim1512_db_user:12129588@cluster0.t5poluu.mongodb.net/medicare";
        await mongoose.connect(mongoURI);
        console.log("DB CONNECTED");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
}
