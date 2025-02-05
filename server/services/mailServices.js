import transporte from "../config/emaliConfig.js"
import bcrypt from 'bcrypt'

export const sendAppliedMail = async (to, subject, context) => {
    
    try {

        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            template: 'successfull_application_mail',
            context
        }
        
        let info = await transporte.sendMail(mailOptions)
        console.log("email send: " + info.response);
        return info
    } catch(error) {
         
        console.log("Error sending mail",error)
    }
}


export const sendMail = async (to, subject, context) => {
    
    try {

        const mailOptions = {
            from: process.env.EMAIL,
            template: 'reminder_mail',
            to,
            subject,
            context
        }
        
        let info = await transporte.sendMail(mailOptions)
        console.log("email send: " + info.response);
        return info
    } catch(error) {
         
        console.log("Error sending mail",error)
    }
}


export const interviewScheduledMail = async (to, subject, context) => {
    
    try {

        const mailOptions = {
            from: process.env.EMAIL,
            template: 'interview_schedule_mail',
            to,
            subject,
            context
        }
        
        let info = await transporte.sendMail(mailOptions)
        console.log("email send: " + info.response);
        return info
    } catch(error) {
         
        console.log("Error sending mail",error)
    }
}


export const userSkillBasedMail = async (to, subject, context) => {
    
    try {

        const mailOptions = {
            from: process.env.EMAIL,
            template: 'skill_based_mail',
            to,
            subject,
            context
        }
        
        let info = await transporte.sendMail(mailOptions)
        console.log("email send: " + info.response);
        return info
    } catch(error) {
         
        console.log("Error sending mail",error)
    }
}




export const subscribedUsersMail = async (to, subject, context) => {
    
    try {

        const mailOptions = {
            from: process.env.EMAIL,
            template: 'subscribe_user_send_mail',
            to,
            subject,
            context
        }
        
        let info = await transporte.sendMail(mailOptions)
        console.log("email send: " + info.response);
        return info
    } catch(error) {
         
        console.log("Error sending mail",error)
    }
}





export const sendOTPEmail = async (to, otp) => {
    try {
        // Hash the OTP (optional)
        const otpHash = await bcrypt.hash(otp.toString(), 10);

        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject: 'OTP for Password Reset',
            template: 'otp_template', // Define your OTP email template here
            context: { otp } // Pass the OTP to the email template
        };

        let info = await transporte.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return otpHash; // Return hashed OTP (optional)
    } catch (error) {
        console.log("Error sending OTP email", error);
        throw error; // Throw error to handle in calling function
    }
};


export const sendPasswordResetEmail = async (to, resetToken) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject: 'Password Reset',
            template: 'password_reset_template', // Define your password reset email template here
            context: { resetToken } // Pass the reset token to the email template
        };

        let info = await transporte.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return info;
    } catch (error) {
        console.log("Error sending password reset email", error);
        throw error; // Throw error to handle in calling function
    }
};