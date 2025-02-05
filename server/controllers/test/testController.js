import { validationResult } from "express-validator"
import HttpError from "../../middlewares/httpError.js"
import Job from "../../models/job.js"
import User from "../../models/user.js"

export const requirments = async(req, res, next) => {
    
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return next(new HttpError("Something went wrong...", 422))

        } else {

           
            const addRequirments= await Job.updateMany({},{requirments:"ReactJs"}) 

            res.status(200).json({
                status : true,
                message : 'Successfully authorized',
                data : addRequirments,
                access_token : null
            })
        }
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}


export const description = async(req, res, next) => {
    
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return next(new HttpError("Something went wrong...", 422))

        } else {

           
            const addRequirments= await Job.updateMany({},{description:"Actively engage with staff and student groups proactively and understand their concerns to sort it out on a daily basis"}) 

            res.status(200).json({
                status : true,
                message : 'Successfully authorized',
                data : addRequirments,
                access_token : null
            })
        }
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

export const skills = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new HttpError("Something went wrong...", 422));
        }

        // Find client users and update their skills
        // const addSkills = await User.updateMany({ role: 'client' }, { $addToSet: { skills: "HTML" } });
        const addSkills = await User.updateMany({},{skills:"ReactJs,HTML"}) 


        res.status(200).json({
            status: true,
            message: 'Successfully added skills to client users',
            data: addSkills,
            access_token: null
        });
    } catch (err) {
        console.error(err);
        return next(new HttpError("Oops! Process failed, please do contact admin", 500));
    }
};
