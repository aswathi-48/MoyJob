import mongoose from 'mongoose'


const applicationShema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    skills: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    cv: {
        type: String,
        require: true
    },
    user: {
        ref : "users",
        type: mongoose.Schema.Types.ObjectId,
        require:true,
    },
    job: {
        ref : "jobs",
        type: mongoose.Schema.Types.ObjectId,
        require:true,
    },
},{ timestamps: true })

const Application = mongoose.model("applications",applicationShema)

export default Application