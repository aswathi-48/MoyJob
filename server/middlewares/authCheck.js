import jwt from "jsonwebtoken";
import HttpError from "./httpError.js";
import User from '../models/user.js'
import Admin from "../models/admin.js";

//authorization
 const authCheck = async (req, res, next) => {
    if ( req.method === "OPTIONS" ) {
        return next()
    } else {
        try {
            const token = req.headers.authorization.split(' ') [1]

            if (! token) {
                return next(new HttpError('Authentication failed!', 403))
            } else {    
         
                const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
                const validUser = await User.findOne({ _id : decodedToken.userId,  role : decodedToken.role })
                if (! validUser) {

                    return next(new HttpError("Invalid credentials!", 400))

                } else {
          
                    req.userDetails = { userId : decodedToken. userId, role : decodedToken.role }

                    next()
                }
            }
        } catch (error) {
            return next(new HttpError('Authentication failed!', 403))
        }
    }
}
export default authCheck;


// export const authCheckforadmin = async (req, res, next) => {
//     if ( req.method === "OPTIONS" ) {
//         return next()
//     } else {
//         try {
//             const token = req.headers.authorization.split(' ') [1]

//             if (! token) {
//                 return next(new HttpError('Authentication failed!', 403))
//             } else {    
         
//                 const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
//                 const validUser = await Admin.findOne({ _id : decodedToken.adminId,  role : decodedToken.role })
//                 if (! validUser) {

//                     return next(new HttpError("Invalid credentials!", 400))

//                 } else {
          
//                     req.adminDetails = { adminId : decodedToken. adminId, role : decodedToken.role }

//                     next()
//                 }
//             }
//         } catch (error) {
//             return next(new HttpError('Authentication failed!', 403))
//         }
//     }
// }