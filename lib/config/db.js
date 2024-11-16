import mongoose from "mongoose";

const ConnectDB = async()=> {
    await mongoose.connect('mongodb+srv://admin:123@cluster0.ono6m.mongodb.net/blog-app')
    console.log("DB Connected")
}
export default ConnectDB;