import User from '../models/user.js';
import Company from '../models/company.js'; 
import { interviewScheduledMail, sendMail, userSkillBasedMail } from './mailServices.js';
import cron from 'node-cron'
import Application from '../models/application.js';

export const sendJobNotificationEmails = async (job) => {

    try {

        const company = await Company.findById(job.company);

        if (!company) {

            console.error('Company not found:', job.company);
            return;
        }

        const location = company.location || {};
        const subscribedUsers = await User.find({ isSubscribed: true });

        subscribedUsers.forEach(async (user) => {

            const emailContent = {
                to: user.email,
                subject: `New Job Posted: ${job.job_title}`,
                text: `Hi ${user.first_name},\n\nA new job has been posted: ${job.job_title}\n\nCompany: ${company.company_name}\nLocation: ${location.city || 'N/A'}\n\nDescription: ${job.description}\n\nBest regards,\nYour Job Portal`,
                html: `<html><p>Hi ${user.first_name},</p><p>A new job has been posted: <strong>${job.job_title}</strong></p><p><strong>Company:</strong> ${company.company_name}</p><p><strong>Location:</strong> ${location.city || 'N/A'}</p><p><strong>Description:</strong> ${job.description}</p><p>Best regards,<br>Your Job Portal</p></html>`,
            };

            await sendMail(emailContent.to, emailContent.subject, emailContent.text, emailContent.html);
        });

        console.log('Job notifications sent successfully.');

    } catch (error) {

        console.error('Error sending job notifications:', error);
    }
};

export const checkAndNotifyUsers = async (job) => {
    try {
        if (!Array.isArray(job.requirements)) {
            console.error('Job requirements are not an array:', job.requirements);
            throw new Error("Job requirements must be an array.");
        }

        if (job.requirements.length === 0) {
            console.warn('Job requirements array is empty.');
            return;
        }

        const company = await Company.findById(job.company);
        if (!company) {
            console.error('Company not found:', job.company);
            return;
        }
        const allUsers = await User.find();

        for (const user of allUsers) {
            if (!Array.isArray(user.skills)) {
                console.warn('User skills are not an array:', user.skills);
                continue;
            }

            if (user.skills.length === 0) {
                console.warn(`User ${user.email} has an empty skills array.`);
                continue;
            }

            const userSkills = user.skills
            .flatMap(skill => skill.split(',').map(skill => skill.trim().toLowerCase())); 
            const jobRequirements = job.requirements.flatMap(req => req.split(',').map(req => req.trim().toLowerCase())); 
        

            console.log(`User ${user.email} skills:`, userSkills);
            console.log('Job requirements:', jobRequirements);

            // Check if any user skill matches any job requirement
            const matchingSkills = userSkills.filter(skill => jobRequirements.includes(skill));
            console.log(matchingSkills,"match");
            if (matchingSkills.length > 0) {

                const to = user.email;
                const subject = `New Job Alert: ${job.job_title}`
                const context = {
                    username: user.first_name,
                    job_title: job.job_title,
                    company_name: company.company_name,
                    location: company.location.city ,
                    description: job.description,
                    skills: user.skills.join(', '),
                    matching: matchingSkills.join(', ')
                };
                await userSkillBasedMail(to, subject, context);
                console.log(`Skill Based Notification sent to ${user.email} successfully.`);
            }
        }
    } catch (error) {
        console.error('Error sending job notifications:', error);
    }
};



export const sendMatchingSkillsEmail = async (jobDetails, applicantSkills, applicantEmail) => {

    try {
        const { job_title, description, requirements, interviewScheduledAt, company_name } = jobDetails;
        const company = await Company.findById(jobDetails.company);

        if (!company) {

            console.error('Company not found:', job.company);
            return;
        }     
        const matchedSkills = requirements.filter(skill => applicantSkills.includes(skill));

        if (matchedSkills.length > 0) {
            const to = applicantEmail;
            const subject = "Job Opportunity Matching Your Skills";
            const context = {
                job_title,
                description,
                interviewScheduledAt,
               company_name: company.company_name
            };

            await interviewScheduledMail(to, subject, context);
            console.log(`Interview Scheduled Notification sent successfully.`);

            // Call scheduleReminder function to schedule the reminder email
            scheduleReminder(applicantEmail, jobDetails);
        }
    } catch (error) {
        console.error('Error sending job notifications:', error);
    }
};



// Schedule the reminder email to be sent two days before the interview at 10:00 AM

const scheduleReminder = (applicantEmail, jobDetails) => {
    const { interviewScheduledAt, job_title, company_name } = jobDetails;
    const interviewDate = new Date(interviewScheduledAt);
    
    // Calculate the reminder date (2 days before the interview at 10:15 PM)
    const reminderDate = new Date(interviewDate);
    reminderDate.setDate(interviewDate.getDate() - 2);
    reminderDate.setHours(10, 0, 0, 0);// Set time to 10: 00 AM

    const now = new Date();
    const delay = reminderDate.getTime() - now.getTime();

    if (delay > 0) {
        // Schedule the email to be sent at the calculated time
        setTimeout(async () => {
            const subject = `Reminder: Upcoming Interview for ${job_title}`;
            const context = {
                company_name,
                interviewScheduledAt
            };
            await sendMail(applicantEmail, subject, context);
            console.log(`Reminder email sent to ${applicantEmail} successfully.`);
        }, delay);
    } else {
        console.log("The calculated reminder time is in the past. No reminder email will be sent.");
    }
};
