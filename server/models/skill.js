import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema({

    skills: {
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
    isdeleted: {
        type: Boolean,
        default: false,

    }
    
}, { timestamps: true})

const Skill = mongoose.model(" skills", SkillSchema)

export default Skill