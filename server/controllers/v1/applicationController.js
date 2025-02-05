import { validationResult } from "express-validator";
import Application from "../../models/application.js";
import HttpError from "../../middlewares/httpError.js";
import { sendAppliedMail, sendMail } from "../../services/mailServices.js";
import { sendMatchingSkillsEmail } from "../../services/notificationService.js";
import Job from "../../models/job.js";

export const addApplication = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError("Invalid data inputs passed, please check your data before retrying!", 422));
        }

        const { name, email, skills, message, userId, job_id } = req.body;

        // Retrieve job details based on job_id
        const jobDetails = await Job.findById(job_id);

        if (!jobDetails) {
            return next(new HttpError("Job details not found", 404));
        }

        const newApplication = new Application({ name,skills, email, message, user: userId, job: job_id });

        if (req.file && req.file.filename) {
            newApplication.cv = req.file.filename;
        }

        const saveApplication = await newApplication.save();

        if (!saveApplication) {
            return next(new HttpError("Oops! Process failed, please contact admin", 400));
        }

        const to = saveApplication.email
        const subject = "Application Successful"
        const context =  {
            username: saveApplication.name,
            job_title: jobDetails.job_title
        }

        
        await sendAppliedMail( to, subject, context );
        console.log("application mail successfull");
        
        await sendMatchingSkillsEmail(jobDetails, skills, email); 


        res.status(200).json({
            status: true,
            message: "Application added successfully",
            data: saveApplication
        });
    } catch (err) {
        console.error(err);
        return next(new HttpError("Oops! Process failed, please contact admin", 500));
    }
};


// export const addApplication = async (req, res, next) => {
//     try {
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return next(new HttpError("Invalid data inputs passed, please check your data before retrying!", 422));
//         }

//         const { name, email, skills, message, userId, job_id } = req.body;

//         // Check if any required field is empty
//         if (!name || !email || !skills || !message || !userId || !job_id) {
//             return next(new HttpError("All fields are required!", 422));
//         }

//         // Retrieve job details based on job_id
//         const jobDetails = await Job.findById(job_id);

//         if (!jobDetails) {
//             return next(new HttpError("Job details not found", 404));
//         }

//         const newApplication = new Application({ name,skills, email, message, user: userId, job: job_id });

//         if (req.file && req.file.filename) {
//             newApplication.cv = req.file.filename;
//         }

//         const saveApplication = await newApplication.save();

//         if (!saveApplication) {
//             return next(new HttpError("Oops! Process failed, please contact admin", 400));
//         }

//         const to = saveApplication.email
//         const subject = "Application Successful"
//         const context =  {
//             username: saveApplication.name,
//             job_title: jobDetails.job_title
//         }

        
//         await sendAppliedMail( to, subject, context );
//         console.log("application mail successfull");
        
//         await sendMatchingSkillsEmail(jobDetails, skills, email); 


//         res.status(200).json({
//             status: true,
//             message: "Application added successfully",
//             data: saveApplication
//         });
//     } catch (err) {
//         console.error(err);
//         return next(new HttpError("Oops! Process failed, please contact admin", 500));
//     }
// };


export const listApplications = async (req, res, next) => {
    try {
        // Retrieve all applications
        const applications = await Application.find({})
        .populate({
            path: 'job',
            select: 'job_title '
        })

        res.status(200).json({
            status: true,
            message: "Applications retrieved successfully",
            data: applications
        });
    } catch (err) {
        console.error(err);
        return next(new HttpError("Oops! Process failed, please contact admin", 500));
    }
};

export const listScheduledInterviews = async (req, res, next) => {
    try {
        // Retrieve applications with interview schedules
        const scheduledInterviews = await Application.find({ interviewScheduled: { $exists: true, $ne: null } });

        res.status(200).json({
            status: true,
            message: "Scheduled interviews retrieved successfully",
            data: scheduledInterviews
        });
    } catch (err) {
        console.error(err);
        return next(new HttpError("Oops! Process failed, please contact admin", 500));
    }
};
