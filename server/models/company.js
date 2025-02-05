import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({

    company_name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    location: {
        city:{ type:String },
        cordinates: {
            lat: {type:Number},
            lng: {type:Number}
        }
    },
    user: {
        ref : "users",
        type: mongoose.Schema.Types.ObjectId,
        require:true,
    },
    isdeleted: {
        type:Boolean,
        default:false
    },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]



}, { timestamps: true })

const Company = mongoose.model("companies", CompanySchema)

export default Company