import createInstanceAxios from "./axios.customize";
import type {
    IRequestRunTestPlan,
    ITestPlan
} from "../components/client/load-testing/create-test-plan/type.test.plan.tsx";
import type {IBackendRes} from "../types/global";
import type {
    IRequestCreateSchedule,
    IResponseSchedule
} from "../components/client/load-testing/schedule/type.schedule.tsx";


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
export const createTestPlanAPI = (requestPayload: IRequestTestPlan) => {
    const urlBackend = "/api/v1/plan";
    return axios.post(urlBackend, requestPayload);
}
export const getTestResultByIdAPI = (id: string) => {
    const urlBackend = `/api/v1/test-run/${id}`;
    return axios.get(urlBackend);
}
export const getAllTestPlanWithPagination = (page: number = 1, size: number = 5) => {
    const urlBackend = `/api/v1/plan?page=${page}&size=${size}`;
    return axios.get(urlBackend);
}
export const getTestPlanDetailAPI = (id: string) => {
    const urlBackend = `/api/v1/plan/${id}`;
    return axios.get(urlBackend);
}
export const runTestPlanAPI = (id: string) => {
    const urlBackend = `/api/v1/test-run/run`;
    const data : IRequestRunTestPlan = {
        id
    }
    return axios.post(urlBackend, data);
}
export const getTestRunOfTestPlanAPI = (id: string, page: number = 1, size: number  = 5) => {
    const urlBackend = `/api/v1/test-run/plan/${id}?page=${page}&size=${size}`;
    return axios.get(urlBackend);
}
export const deleteTestPlanAPI = (id: string) => {
    const urlBackend = `/api/v1/plan/${id}`;
    return axios.delete(urlBackend);
}
export const editTestPlanAPI = (testPlan: ITestPlan) => {
    const urlBackend = '/api/v1/plan';
    return axios.put(urlBackend, testPlan);
}
export const compareTestRunsAPI = (runId1: string, runId2: string) => {
    const urlBackend = `/api/v1/test-run/compare/${runId1}/${runId2}`;
    return axios.get(urlBackend);
}
export const deleteTestRunAPI = (id: string) => {
    const urlBackend = `/api/v1/test-run/${id}`;
    return axios.delete(urlBackend);
}
export const createScheduleAPI = (data: IRequestCreateSchedule) => {
    return axios.post<IResponseSchedule>("/api/v1/schedule", data);
};


export const getSchedulesByTestPlanAPI = (testPlanId: string, page: number = 1, pageSize: number = 10) => {
    const urlBackend = `/api/v1/schedule/plan/${testPlanId}?page=${page}&size=${pageSize}`;
    return axios.get(urlBackend);

};

export const toggleScheduleStatusAPI = (scheduleId: string) => {
    return axios.put(`/api/v1/schedule/${scheduleId}/toggle`);
};

export const deleteScheduleAPI = (scheduleId: string) => {
    return axios.delete(`/api/v1/schedule/${scheduleId}`);
};
export const searchTestPlansAPI = (query: string, page: number = 1, pageSize: number = 10) => {
    return axios.get(`/api/v1/search/test-plans?q=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`);
};

// export const advancedSearchTestPlans = (query: string, page: number = 1, pageSize: number = 10) => {
//     return axios.get(`/api/v1/search/test-plans/advanced?q=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`);
// };

// Test Run search methods
export const searchTestRunsAPI = (query: string, page: number = 1, pageSize: number = 10) => {
    return axios.get(`/api/v1/search/test-runs?q=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`);
};

export const searchTestRunsByDateRangeAPI = (start: string, end: string, page: number = 1, pageSize: number = 10) => {
    return axios.get(`/api/v1/search/test-runs/by-date?start=${start}&end=${end}&page=${page}&size=${pageSize}`);
};

export const searchTestRunsByErrorRateAPI = (minErrorRate: number, page: number = 1, pageSize: number = 10) => {
    return axios.get(`/api/v1/search/test-runs/by-error-rate?minErrorRate=${minErrorRate}&page=${page}&size=${pageSize}`);
};

// Schedule search methods
export const searchSchedulesAPI = (query: string, page: number = 1, pageSize: number = 10) => {
    return axios.get(`/api/v1/search/schedules?q=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`);
};

export const searchSchedulesByStatusAPI = (enabled: boolean, page: number = 1, pageSize: number = 10) => {
    return axios.get(`/api/v1/search/schedules/by-status?enabled=${enabled}&page=${page}&size=${pageSize}`);
};

export const searchSchedulesByExecutionTimeAPI = (start: string, end: string, page: number = 1, pageSize: number = 10) => {
    return axios.get(`/api/v1/search/schedules/by-execution-time?start=${start}&end=${end}&page=${page}&size=${pageSize}`);
};