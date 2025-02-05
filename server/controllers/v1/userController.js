import { validationResult } from "express-validator";
import HttpError from "../../middlewares/httpError.js";
import bcrypt from 'bcrypt'
import User from "../../models/user.js";
import jwt from 'jsonwebtoken'
import fs from 'fs'

export const register = async (req, res, next) => {

  try {

    const errors = validationResult(req);
    const { first_name, last_name, gender, date_of_birth, email, password, role,  company, skills} = req.body;

    if (!errors.isEmpty()) {

      return next(new HttpError("Invalid data inputs passed, please check your data before retry!", 422));

    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new HttpError("User with this email already exists.", 409));

    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ first_name, last_name, gender, date_of_birth, email, role, password: hash, company, skills });
    console.log(newUser);
    if (req.file && req.file.filename) {

      newUser.image = process.env.BASE_URL + "/admin/" + req.file.filename;
      
    }

    const savedUser = await newUser.save();
    console.log(savedUser,"saved");
    res.status(200).json({
      status: true,
      message: "User registered successfully",
      data: savedUser,
    });
  } catch (err) {
    return next(new HttpError("Oops! Process failed, please contact admin.", 500));
  }
};

  //login
  export const login = async (req, res, next) => {

    try{
      const errors = validationResult(req);
  
      const { email , password } = req.body
  
      if (!errors.isEmpty()) {
  
        return next(new HttpError("Invalid data inputs passed, Please check your data before retry!",422));
  
      } else {
        const user = await User.findOne({ email: email });
    
      if (!user) {
  
        return next(new HttpError("Invalid credentials", 400))
      } else {
  
        const isPassword = await bcrypt.compare( req.body.password, user.password );
      if (isPassword) {
          const token = jwt.sign({ userId: user._id, userEmail: user. email, role: user.role },
                        process.env.JWT_SECRET,
                        { expiresIn: process. env. JWT_TOKEN_EXPIRY });
  
          res.status(200).json({
            status : true,
            message : '',
            data : null,
            result : user,
            access_token : token        
          })
      }
      else {
  
        return next(new HttpError("Oops! invalid credential!", 404)); 
      }
       }
      }
    } catch(err) {
      console.error(err)
      return next(new HttpError("Oops! Process failed", 500));
    }
  }
  


  
  export const subscribe = async (req, res, next) => {
    try {
        const { userId } = req.userDetails;
        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError("User not found", 404));
        }
        user.isSubscribed = true;
        const updatedUser = await user.save();
        console.log(updatedUser);
        res.status(200).json({
            status: true,
            message: "Subscription successful",
            data: updatedUser
        });
    } catch (err) {

        return next(new HttpError("Oops! Process failed", 500));
    }
};


export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.userDetails; 
    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json({
      status: true,
      message: "User details retrieved successfully",
      data: user
    });
  } catch (err) {
    return next(new HttpError("Oops! Process failed, please contact admin", 500));
  }
};

//get all client user 
 
  export const getClientUsers = async (req, res, next) => {

    try {

      const clients = await User.find({ role: 'client'}).select('-password')
      console.log(clients,"dataa");
      if (!clients || clients.length === 0) {

        return next(new HttpError("No client users found", 404));
      }

      res.status(200).json({
        status: true,
        message: "Client users retrieved successfully",
        data: clients
      });


    } catch (err) {

      return next(new HttpError("Oops! Process failed, please contact admin", 500));
    }
  };

export const deleteUser = async(req, res, next) => {

  try {

      const errors = validationResult(req)

      if (!errors.isEmpty()) {

          return next(new HttpError("Something went wrong.."), 422)

      } else {

          const { role } = req.userDetails

          if ( role !== 'admin' ) {

              return next(new HttpError("Oops! Process failed, admin can only delete book", 400))

          } else {

              const { userId } = req.body      

              const deleteUser = await User.findByIdAndUpdate(userId, { isdeleted:true })

              res.status(200).json({
                  status : true,
                  message : "",
                  data : deleteUser
              })
          }
      }

  } catch(err) {
      console.error(err)
      return next(new HttpError("Oops! Process failed, please do contact admin", 500))
  }
}



export const editUser = async (req, res, next) => {
  try {
      const errors = validationResult(req)
      if (! errors.isEmpty()) { 

          return next(new HttpError("Invalid inputs passed, please check ...", 422))

      } else {

          const { first_name, last_name, gender, date_of_birth, email, password, role, _id } = req.body

          const userData = await User.findOne({ _id: _id })

          if (! userData) {

              return next(new HttpError("Invalid credentials", 404))

          } else {

              const image = req.file ? `${process.env.BASE_URL}/admin/cover_images/${req.file.filename}` : null

          if (userData.image) {
           
              const prevImgPath = userData.image.split('/').pop()

              fs.unlink(`./upload/${ prevImgPath }`, (err) => {
                  if (err) {
                      console.error(err)
                      return
                  } 
              })
          }


          const updateUser = { first_name, last_name, gender, date_of_birth, email, password, role  }

          if (image) {

              updateUser.image = image
          }
          
          const updatedUserData = await User.findOneAndUpdate({ _id : _id }, updateUser, { new: true })

          res.status(200).json({
              status : true,
              message : "Successfuly updated",
              // data: null
              data: updatedUserData
          })
                     
          }

      }

  } catch(err) {
      console.error(err)
      return next(new HttpError("Oops! Process failed, please do contact admin", 500))
  }
}

  export const authConfirmTest = async (req, res, next) => {

    try {

      const errors = validationResult(req);
      
      if (! errors.isEmpty()) {

        return next(new HttpError("Invalid data inputs passed, Please check your data before retry!", 422));

      } else {

        const { userId } = req.userData 
        
         res.status(200).json({
                status : true,
                message : '',
                data : userId,
                access_token : null
              })
          }
    } catch (err) {
        console.error(err)
      return next(new HttpError("Oops! Process failed, please do contact admin", 500));
    }
};
