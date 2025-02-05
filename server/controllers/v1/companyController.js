import { validationResult } from "express-validator"
import HttpError from "../../middlewares/httpError.js"
import Company from "../../models/company.js"
import Subscription from "../../models/subscribe.js"

//add company

export const addCompany = async ( req, res, next ) => {
    
    try {
        const errors = validationResult(req)

        if(! errors.isEmpty()) {

             return next(new HttpError("Invalid inputs are passed", 422))
             
        } else {    


            const { role } = req.userDetails

            const { userId, email, company_name, description, location } = req.body;

            const { city, coordinates } = location;

            if(role !== 'admin') {

                return next(new HttpError("Oops process failed", 400))

            } else {

                const newCompany = new Company({
                    email,
                    company_name,
                    description,
                    location: {
                        city,
                        coordinates // Ensure that coordinates is correctly provided in the payload
                    },
                    user: userId
                });
                const saveCompany = await newCompany.save()

                if(! newCompany) {

                    return next(new HttpError("Oops! Process failed, please do contact admin", 400))
             
                } else {

                    console.log(newCompany,"res cmbny")

                    res.status(200).json({
                        status: true,
                        message: "",
                        data: saveCompany
                     })
                }
            }
        }   

    } catch(err) {
        console.log(err)
        return next(new HttpError("Oops process failed, please do contact admin", 500));
    }
} 

//list company 

export const listCompany = async(req, res, next) => {
    
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return next(new HttpError("Something went wrong...", 422))

        } else {
            
            // searchQuery

            const { q } = req.body

            let query={ isdeleted: false }
            
            if(q) {

                const searchValue = q.toLowerCase()
                query.$or = [
                    { comapny_name: { $regex: searchValue, $options: 'i' } },
                    { email: { $regex: searchValue, $options: 'i' } }
                ]; 
                       }
       
            const companyList = await Company.find( query ) 
            .populate({
                path: 'user',
                select: 'first_name role'
            })

            res.status(200).json({
                status : true,
                message : '',
                data : companyList,
            })
        }
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

//company single view 


export const viewCompany = async(req, res, next) => {
    
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return next(new HttpError("Something went wrong...", 422))

        } else {

            const { comapny_id } = req.body
            const companyDetailsView = await Company.findOne({ _id: comapny_id }) 

            res.status(200).json({
                status : true,
                message : 'Successfully authorized',
                data : companyDetailsView,
                access_token : null
            })
        }
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}


// Delete company

export const deleteCompany = async(req, res, next) => {

    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            return next(new HttpError("Something went wrong.."), 422)

        } else {

                const { _id } = req.body      
                    console.log(req.body);
                const deleteCompanyDetails = await Company.findByIdAndUpdate(_id, { isdeleted:true })
                console.log(deleteCompanyDetails);
                res.status(200).json({
                    status : true,
                    message : "",
                    data : deleteCompanyDetails
                })
   
        } 

    } catch(err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

//edit company
export const editCompany = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (! errors.isEmpty()) { 

            return next(new HttpError("Invalid inputs passed, please check ...", 422))

        } else {

            const { _id, email, company_name, description,
                   city,
                    lat,
                    lng
                
            } = req.body
            const { role } = req.userDetails

            if (role !== 'admin') {
                return next(new HttpError("Oops! Process failed, admin can only edit book", 400))
                
            } else {
                           
            const companyData = await Company.findOne({ _id: _id })
                console.log(companyData, "aa");
            if (! companyData) {

                return next(new HttpError("Invalid credentials", 404))

            } else {

            const updateQuery = {  email, company_name, description,
                    city,
                        lat,
                        lng

            }
            const updatedcompanyData = await Company.findOneAndUpdate({ _id: _id }, updateQuery, { new: true })

            res.status(200).json({
                status : true,
                message : "Successfuly updated",
                // data: null
                data: updatedcompanyData
            })
            }
            
            }
        }

    } catch(err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}


    // export const subscribeToCompany = async (req, res) => {
    //     try {
    //     const { userId, companyId } = req.body;
        
    //     const existingSubscription = await Subscription.findOne({ user: userId, company: companyId });
    //     if (existingSubscription) {
    //         return res.status(400).json({ message: "You are already subscribed to this company" });
    //     }
    
    //     // Create a new subscription
    //     const newSubscription = new Subscription({
    //         user: userId,
    //         company: companyId,
    //     });
    //     console.log(newSubscription);
    //     await newSubscription.save();
    
    //     res.status(200).json({ message: "Successfully subscribed to the company" });
    //     } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: "Internal Server Error" });
    //     }
    // };

    export const subscribeToCompany = async (req, res) => {
        try {
            const { userId, companyId } = req.body;
    
            // Check if user is already subscribed
            const existingSubscription = await Company.findOne({ _id: companyId, subscribers: userId });
            if (existingSubscription) {
                return res.status(400).json({ message: "You are already subscribed to this company" });
            }
    
            // Add user to company's subscribers
            const company = await Company.findByIdAndUpdate(
                companyId,
                { $addToSet: { subscribers: userId } },
                { new: true }
            );
    
            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }
    
            res.status(200).json({ message: "Successfully subscribed to the company" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
    


export const fetchSubscribedUsers = async (req, res) => {
    try {
      const subscriptions = await Subscription.find()
        .populate('user', 'first_name email image gender date_of_birth ')
        .populate('company', 'company_name email description location');
  
      const formattedData = subscriptions.map(subscription => ({
        user: subscription.user,
        company: subscription.company,
      }));
  
      res.status(200).json(formattedData);

    } catch (err) {

      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });

    }
  }



