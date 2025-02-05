import mongoose from "mongoose";


const connection = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("database are connected");
    })
}

export default connection  