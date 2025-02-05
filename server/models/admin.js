import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({

    user: {
        ref : "users",
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    first_name: {
        type: String,
        require: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    gender: {
        type: String,
        require: true,
    },
    date_of_birth: {
        type: Date,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: 'admin',
    },


}, { timestamps: true})

const Admin = mongoose.model("admin",AdminSchema)

export default Admin