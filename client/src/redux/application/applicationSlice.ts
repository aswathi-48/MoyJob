import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export interface Application {
     _id: String,
     skills: String,
     name: string
     message: String,
     cv: string,
     job: {
      job_title: string
     }
}


export interface ApplicationState {
    applications: Application[]
}

const initialState: ApplicationState = {
    applications: []
}

export const ApplicationSlice = createSlice({ 
    name: 'application',
    initialState,
    reducers: {
        addApplication: (state, action: PayloadAction<Application>) => {
            state.applications.push(action.payload)
        },
        fetchApplication: (state, action: PayloadAction<Application[]>) => {
          state.applications = action.payload;
        },
    }
})

export const addNewApplication = ( formData: any): AppThunk =>  async dispatch => {
    const storedToken = localStorage.getItem("access_token")

    const response = await axios.post('http://localhost:5100/application/add', formData, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
 
    dispatch(addApplication(response.data.data))
    toast.success("Application successfully completed!");
  }

  export const fetchAllApplications = (): AppThunk<Promise<void>> => async (dispatch) => {
    const storedToken = localStorage.getItem("access_token")
  
    const response = await axios.post('http://localhost:5100/application/list',
 
      {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
    dispatch(fetchApplication(response.data.data))
      
  }

export const { addApplication, fetchApplication } = ApplicationSlice.actions;
export default ApplicationSlice.reducer