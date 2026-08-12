import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://kawsarrahim1512_db_user:ECBXYdrsTPpuv0Mc@cluster0.t5poluu.mongodb.net/medicare")
    .then(()=> {
    console.log("DB CONNECTED");
        
    })

}