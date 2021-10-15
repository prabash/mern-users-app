import axios from 'axios';

const inactive_time_mins = 60;

export const login = async (data) =>  axios.post('login', data);
export const getUser = async (id) => axios.get(`user/${id}`, { headers: { "x-access-token" : localStorage.getItem("access-token") }});
export const getAllUsers = async () => axios.get(`users`, { headers: { "x-access-token" : localStorage.getItem("access-token") }});
export const getInactiveUsers = async() => axios.get(`/get_inactive_users/${inactive_time_mins}`, { headers: { "x-access-token" : localStorage.getItem("access-token") }});
export const updateUserStatus = async(data) => axios.post(`update_user_status`, data, { headers: { "x-access-token" : localStorage.getItem("access-token") }});

const apis = {
    login,
    getUser,
    getAllUsers,
    getInactiveUsers,
    updateUserStatus,
}

export default apis;

