import axios, {AxiosInstance} from 'axios';

let sessionToken: string | null = null;

export const gitlabClient: AxiosInstance = axios.create({
    baseURL: 'https://gitlab.com/epimac-asso/projects/chrysalide/ChrysalideApp/-/raw/main/services/auriga/payloads',
    timeout: 15000,
    headers: {},
});

gitlabClient.interceptors.request.use(
    (config) => {
        if (sessionToken) {
            config.headers.Authorization = `Bearer ${sessionToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });
