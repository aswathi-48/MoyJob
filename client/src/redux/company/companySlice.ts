import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import axios from "axios";


export interface Company {
  _id : string;
    email: string,
    company_name: string,
    description: string,
    location: {
        city: string,
        cordinates: {
          lat: number
          lng: number
        }
    },
    user: {
      _id: string
      first_name: string,
      role: string
    },
    isSubscribed?: boolean;

}

export interface Subscriber {
  user: {
    _id: string;
    first_name: string;
    email: string;
    gender: string;
    date_of_birth: string;
    image?: string;
  };
  company: {
    _id: string;
    company_name: string;
    email: string;
    description: string;
  };
}
export interface CompanyState {
    companies: Company[]
    isSubscribed: boolean; 
    subscribers: Subscriber[];
}
const initialState: CompanyState = {
    companies: [],
    isSubscribed: false,
    subscribers: []
}
interface SubscribePayload {
  companyId: string;
}

interface Delete {
  _id: string
 }

export const companyslice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        fetchData: (state, action: PayloadAction<Company[]>) => {
            state.companies = action.payload;
          },
          deleteData: (state, action: PayloadAction<Company>) => {

          },
          addData: (state, action: PayloadAction<Company>) => {
            state.companies.push(action.payload);
          },
          editData: (state, action: PayloadAction<Company>) => {
 
          },
          subscribeCompany: (state, action: PayloadAction<string>) => {
            const index = state.companies.findIndex(company => company._id === action.payload);
            if (index !== -1) {
              state.companies[index].isSubscribed = true;
            }
          },
          setSubscriptionStatus(state, action) {
            state.isSubscribed = action.payload;
          },
          fetchSubscribers(state, action: PayloadAction<any[]>) {
            state.subscribers = action.payload;
          },
    }
})

interface Params {
    q: string
  }

export const fetchCompany = ( params: Params): AppThunk<Promise<void>> => async (dispatch) => {
    const storedToken = localStorage.getItem("access_token")
    
    
    const response = await axios.post('http://localhost:5100/company/list',
    params,
    {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
    dispatch(fetchData(response.data.data))

  }

  export const addNewCompany = ( formData: FormData ): AppThunk =>  async dispatch => {
    const storedToken = localStorage.getItem("access_token")!
  
    const response = await axios.post('http://localhost:5100/company/add', formData, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })

    dispatch(addData(response.data.data))
    console.log(response.data.data, "res ADD");
  
  }
  
  export const editCompany = ( CompanyData: FormData ): AppThunk => async (dispatch) => {
    const storedToken = localStorage.getItem("access_token")
  
  
        const response = await axios.patch("http://localhost:5100/company/edit", CompanyData, {        
            headers: {
                Authorization: `Bearer ${storedToken}`,
            }
        });
        dispatch(editData(response.data));
        console.log(response.data.data);
        
  
        
  };
  
  export const deleteCompany = (_id: Delete): AppThunk => async (dispatch) => {

    const storedToken = localStorage.getItem("access_token")
    const response = await axios.patch("http://localhost:5100/company/delete",_id,
    {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
    dispatch(deleteData(response.data))
    console.log(response.data.data,"delete data response");
    
  }

  export const subscribeToCompany = (payload: { userId: string, companyId: string }): AppThunk => async (dispatch) => {
    const storedToken = localStorage.getItem("access_token");
    try {
      await axios.post('http://localhost:5100/subscribe/subscribe', payload, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      dispatch(companyslice.actions.subscribeCompany(payload.companyId));
    } catch (error) {
      console.error("Subscription failed", error);
    }
  };
  
  export const fetchSubscribedUser = (): AppThunk => async (dispatch) => {
    const storedToken = localStorage.getItem("access_token");
    
    try {
      const response = await axios.post('http://localhost:5100/subscribe/subscribedUsers', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      dispatch(fetchSubscribers(response.data));
      console.log(response.data.data,"dataaaa");
      
    } catch (error) {
      console.error("Fetching subscribers failed", error);
    }
  };
  
export const { fetchData, deleteData, editData, addData, subscribeCompany, setSubscriptionStatus, fetchSubscribers } = companyslice.actions
export default companyslice.reducer