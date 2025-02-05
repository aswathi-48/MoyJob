import Job from "../../models/job.js";
import { sendMail } from "../../services/mailServices.js";

export const mailSend = async(req,res) => {
    const { to, subject, text } = req.body;

    try {

        const emailResponse = await sendMail(to, subject, text)
        res.status(200).json({message: 'Email send successfully', info: emailResponse})

    } catch (error) {
        res.status(500).json({message: "failed to send mail", error})
    }
}


