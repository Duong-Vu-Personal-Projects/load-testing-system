import createInstanceAxios from "./axios.customize";


const axios = createInstanceAxios(import.meta.env.VITE_BACKEND_URL);

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
}

export const registerAPI = (fullName: string, email: string, password: string, username: string) => {
    const urlBackend = "/api/v1/auth/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, username });
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
}

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(urlBackend);
}
export const createTestAPI = (requestPayload) => {
    const urlBackend = "/api/v1/load-test/run";
    return axios.post(urlBackend, requestPayload);
}
export const getTestResultByIdAPI = (id: string) => {
    const urlBackend = `/api/v1/load-test/${id}`;
    return axios.get(urlBackend);
}
export const getAllTestPlanWithPagination = (page: number = 1, size: number = 5) => {
    const urlBackend = `/api/v1/load-test?page=${page}&size=${size}`;
    return axios.get(urlBackend);
}