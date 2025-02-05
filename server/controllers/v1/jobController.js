import { validationResult } from "express-validator"
import HttpError from "../../middlewares/httpError.js"
import Job from "../../models/job.js"
import Company from "../../models/company.js"
import { checkAndNotifyUsers, sendJobNotificationEmails } from "../../services/notificationService.js";
import { subscribedUsersMail } from "../../services/mailServices.js";
import User from "../../models/user.js";

export const addJobs = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError("Invalid inputs are passed", 422));
        }

        const { role } = req.userDetails;
        const { company, job_title, job_type, salary, category, requirements, description, status, interviewScheduledAt } = req.body;

        if (role !== 'admin') {

            return next(new HttpError("Oops process failed", 400));
        }

        // Ensure requirements are an array
        const jobRequirements = Array.isArray(requirements) ? requirements : JSON.parse(requirements);

        const newJob = new Job({
            job_title,
            job_type,
            company: {
                _id: company._id,
                company_name: company.company_name,
                location: company.location
            },
            salary,
            category,
            requirements: jobRequirements,
            description,
            status,
            interviewScheduledAt
        });

        const saveJob = await newJob.save();

        if (!saveJob) {

            return next(new HttpError("Oops! Process failed, please do contact admin", 400));
        }

        // Retrieve subscribed users of the company
        const subscribedCompany = await Company.findById(company._id).select('subscribers');
        if (subscribedCompany && Array.isArray(subscribedCompany.subscribers)) {
            const subscribedUsers = subscribedCompany.subscribers;

            // Send email notifications to subscribed users
            for (const userId of subscribedUsers) {
                const user = await User.findById(userId);
                if (user) {
                    const to = user.email;
                    const subject = `New Job Posted: ${job_title}`;
                    const context = {
                        user_name: user.first_name,
                        job_title,
                        company_name: company.company_name,
                        location: company.location.city || 'Unknown Location',
                        description,
                    };

                    await subscribedUsersMail(to, subject, context);
                    console.log(`Notification sent to subscribed user ${user.email} successfully.`);
                }
            }
        } else {
            console.log('No subscribed users found for the company.');
        }

        // Notify users whose skills match the job requirements
        await checkAndNotifyUsers(newJob);

        res.status(200).json({
            status: true,
            message: "Job successfully added",
            data: saveJob
        });

    } catch (err) {
        console.log(err);
        return next(new HttpError("Oops process failed, please do contact admin", 500));
    }
};

// export const listJobs = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return next(new HttpError("Something went wrong..", 422));
//         }

//         let query = { isdeleted: false };

//         const { q, job_type, category, company_name, location } = req.body;

//         console.log(req.body, "req body")
        
//         if (q) {

//             const searchValue = q.toLowerCase();   

//             query.$or = [
//                 { job_title: { $regex: searchValue, $options: 'i' } },
//                 { job_type: { $regex: searchValue, $options: 'i' } },
//                 { category: { $regex: searchValue, $options: 'i' } },
//                 { 'company.company_name': { $regex: searchValue, $options: 'i' } },
//                 { 'company.location.city': { $regex: searchValue, $options: 'i' } },
//             ];

//         }

//         if (job_type) {
//             query.job_type = job_type;
//         }

//         if (category) {
//             query.category = category;
//         }

//         const jobList = await Job.find(query)
//             .populate({
//                 path: 'company',
//                 select: 'company_name location'
//             });

//         const regexSearchValue = new RegExp(q.toLowerCase(), 'i');
//         const jobAggregate = await Job.aggregate([
//             {
//               $lookup: {
//                 from: 'companies', // The name of the Company collection
//                 localField: 'company', // The field in the Job collection that references the Company collection
//                 foreignField: '_id', // The field in the Company collection to match against
//                 as: 'companyDetails' // The alias for the joined Company documents
//               }
//             },
//             {
//               $addFields: {
//                 company: { $arrayElemAt: ['$companyDetails', 0] } // Replace the company field with the populated company details
//               }
//             },
//             {
//               $match: {
//                 $or: [
//                   { 'company.company_name': regexSearchValue },
//                   { 'company.location.city': regexSearchValue },
//                   { job_title: regexSearchValue },
//                   { job_type: regexSearchValue },
//                   { category: regexSearchValue },
//                 ]
//               }
//             },
            
//           ]);

//         res.status(200).json({
//             status: true,
//             message: 'Successfully fetched jobs',
//             data: jobAggregate
//         });
//     } catch (err) {
//         console.error(err);
//         return next(new HttpError("Oops! Process failed, please contact admin", 500));
//     }
// };

export const listJobs = async (req, res, next) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new HttpError("Something went wrong..", 422));
        }
        const { q, job_type, category } = req.body;

        const regexSearchValue = q ? new RegExp(q.toLowerCase(), 'i') : null;

        const pipeline = [
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            {
                $addFields: {
                    company: { $arrayElemAt: ['$companyDetails', 0] }
                }
            },
            {
                $match: {
                    isdeleted: false,
                    ...(
                        regexSearchValue
                            ? {
                                $or: [
                                    { 'company.company_name': regexSearchValue },
                                    { 'company.location.city': regexSearchValue },
                                    { job_title: regexSearchValue },
                                    { job_type: regexSearchValue },
                                    { category: regexSearchValue }
                                ]
                            }
                            : {}
                    ),
                    ...(job_type ? { job_type } : {}),
                    ...(category ? { category } : {})
                }
            }
            
        ];
        const jobAggregate = await Job.aggregate(pipeline);
        res.status(200).json({
            status: true,
            message: 'Successfully fetched jobs',
            data: jobAggregate
        });

    } catch (err) {

        console.error(err);
        return next(new HttpError("Oops! Process failed, please contact admin", 500));
    }
    
};

export const listLatestJobs = async (req, res, next) => {
    try {
      const latestJobs = await Job.find({ isdeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'company',
          select: 'company_name location'
        });
        
  
      res.status(200).json({
        status: true,
        message: 'Successfully fetched latest jobs',
        data: latestJobs
      });
    } catch (err) {
      console.error(err);
      return next(new HttpError("Oops! Process failed, please contact admin", 500));
    }
  };
  

export const viewJob = async(req, res, next) => {

    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return next(new HttpError("Something went wrong...", 422))

        } else {

            const { _id } = req.body

            const jobView = await Job.findOne({ _id })
            .populate({ path: 'company',
            select: "company_name location "})

            res.status(200).json({
                status : true,
                message : 'Successfully authorized',
                data : jobView,
                access_token : null
            })
        }
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}


export const deleteJobs = async(req, res, next) => {

    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return next(new HttpError("Something went wrong.."), 422)

        } else {

            const { role } = req.userDetails

            if ( role !== 'admin' ) {

                return next(new HttpError("Oops! Process failed, admin can only delete book", 400))

            } else {

                const { _id } = req.body      

                const deleteJob = await Job.findByIdAndUpdate(_id, { isdeleted:true })

                res.status(200).json({
                    status : true,
                    message : "",
                    data : deleteJob
                })
            }
        }

    } catch(err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}


//edit jobs
export const editJob = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (! errors.isEmpty()) { 

            return next(new HttpError("Invalid inputs passed, please check ...", 422))

        } else {

            const { _id, job_title, job_type, salary, category, requirements, description, status, interviewScheduledAt } = req.body
          
            const { role } = req.userDetails

            if (role !== 'admin') {
  
                return next(new HttpError("Oops! Process failed, admin can only edit book", 400))

            } else {
                           
            const jobData= await Job.findOne({_id})

            if (! jobData) {

                return next(new HttpError("Invalid credentials", 404))

            } else {

            const updateQuery = { job_title, job_type,  salary, category, requirements, description, status, interviewScheduledAt }
            
            const updatedJobData = await Job.findOneAndUpdate({ _id }, updateQuery, { new: true })

            res.status(200).json({
                status : true,
                message : "Successfuly updated",
                // data: null
                data: updatedJobData
            })
            }

            }

        }
        
    } catch(err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}