import { baseURl } from '@/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

class HttpService {
    private axiosInstance = axios.create({
        baseURL: baseURl, // Replace with your API base URL
        headers: {
            'Content-Type': 'application/json',
            'plken': process.env.NEXT_PUBLIC_API_KEY || '',
        },
    });

    constructor() {
        // Add a request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Get the API key from the environment variable
                const apiKey = process.env.NEXT_PUBLIC_API_KEY;
                if (apiKey) {
                    // Add the plken header to the request
                    config.headers['plken'] = apiKey;
                }
                return config;
            },
            (error) => {
                // Handle the error
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.patch<T>(url, data, config);
    }

    async fetch<T>(url: string, options?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
                'plken': process.env.NEXT_PUBLIC_API_KEY || '',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<T>;
    }
}

const httpService = new HttpService();
export default httpService;