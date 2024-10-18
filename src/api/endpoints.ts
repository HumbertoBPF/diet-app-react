import axiosInstance from './http';

export const signup = (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}) => axiosInstance().post('/signup', payload);

export const signin = (payload: { email: string; password: string }) =>
    axiosInstance().post('/login', payload);

export const getUser = () => axiosInstance().get('/user');

export const getFoods = (searchParams: URLSearchParams) =>
    axiosInstance().get(`/food?${searchParams}`);

export const getFoodItems = (searchParams: URLSearchParams) =>
    axiosInstance().get(`/user/food?${searchParams}`);
export const createFoodItem = (payload: {
    food_id: number;
    quantity: number;
    timestamp: string;
}) => axiosInstance().post('/user/food', payload);
export const updateFoodItem = (
    id: number,
    payload: {
        food_id: number;
        quantity: number;
        timestamp: string;
    }
) => axiosInstance().put(`/user/food/${id}`, payload);
export const deleteFoodItem = (id?: number) =>
    axiosInstance().delete(`/user/food/${id}`);
