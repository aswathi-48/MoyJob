import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({

    company: {
        ref : "companies",
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    job_title: {
        type: String,
        require: true,
    },

    job_type:  {
        type: String,
        require: true
    },
    salary:  {
        type: Number,
        require: true
    },
    category:  {
        type: String,
    
    },
    requirements: {
        type: [String],
        require: true
    },
    description: {
        type: String,
        require: true
    },
    isdeleted: {
        type:Boolean,
        default:false
    },
    status: {
        type: String,
        require: true,
        default: "Active"
    },
    interviewScheduledAt: {
        type: Date,
        // min: Date.now(),
    },
    user: {
        ref : "users",
        type: mongoose.Schema.Types.ObjectId,
    }

}, {timestamps: true})

const Job = mongoose.model('jobs',JobSchema) 

export default Job