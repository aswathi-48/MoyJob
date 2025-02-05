

import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import jobSlice from "./job/jobSlice";
import companySlice from "./company/companySlice";
import userSlice from "./user/userSlice";
import skillSlice from "./skill/skillSlice";
import applicationSlice from "./application/applicationSlice";


export const store = configureStore({
    reducer: {
        job: jobSlice,
        company: companySlice,
        user: userSlice,
        skill: skillSlice,
        application: applicationSlice

    }
})

export const useAppDispatch:() =>typeof store.dispatch = useDispatch;

export const useAppSelector:TypedUseSelectorHook<
ReturnType<typeof store.getState>
> = useSelector;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

