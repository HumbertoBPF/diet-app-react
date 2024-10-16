import { createSlice } from '@reduxjs/toolkit';
import IUser from 'interfaces/IUser';

const initialState: IUser = {
    email: '',
    firstName: '',
    lastName: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        clearUser: () => {
            return { ...initialState };
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
