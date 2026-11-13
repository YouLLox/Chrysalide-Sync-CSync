import axios, { AxiosInstance } from 'axios';

let sessionToken: string | null = null;

export const aurigaClient: AxiosInstance = axios.create({
    baseURL: 'https://auriga.epita.fr/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ChrysalideMobile/2.0',
    },
});

aurigaClient.interceptors.request.use(
    (config) => {
        if (sessionToken) {
            config.headers.Authorization = `Bearer ${sessionToken}`;
        }
        return config;
        },
    (error) => {
        return Promise.reject(error);
    });

export function setAurigaSession(token: string): void {
    sessionToken = token;
}

export function clearAurigaSession(): void {
    sessionToken = null;
}
