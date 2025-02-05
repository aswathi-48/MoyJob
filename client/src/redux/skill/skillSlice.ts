import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import jobSlice from "../job/jobSlice";
import { AppThunk } from "../store";
import axios from "axios";

export interface Skill {
    _id: string,
    skills: string,
    cv: string,
    user: {
        userId: string
        first_name: string,
        email: string
    }
}

export interface SkillState {
    skills: Skill[]
}
const initialState: SkillState = {
    skills: []
}

export const skillSlice = createSlice({
    name:"skill",
    initialState,
    reducers: {
        addSkill: (state, action: PayloadAction<Skill>) => {
            state.skills.push(action.payload);
          },
          fetchData: (state, action: PayloadAction<Skill[]>) => {
            state.skills = action.payload;
          },
    }

})

export const addNewSkill = ( formData: any): AppThunk =>  async dispatch => {
    const storedToken = localStorage.getItem("access_token")

    // formData.skills = formData.skills.join(", ");  // extra step 

    const response = await axios.post('http://localhost:5100/skill/add', formData, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
 
    dispatch(addSkill(response.data.data))
  
  }

  interface Params {
    q: string,
  }
  
  export const fetchSkills = (params: Params): AppThunk<Promise<void>> => async (dispatch) => {
    const storedToken = localStorage.getItem("access_token")
  
    const response = await axios.post('http://localhost:5100/skill/list',
    params,
      {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
    dispatch(fetchData(response.data.data))
  
  }


  export const { addSkill, fetchData } = skillSlice.actions;
  export default skillSlice.reducer


