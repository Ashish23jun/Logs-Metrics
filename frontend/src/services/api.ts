import axios, { AxiosError, type AxiosInstance } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Event {
  serialno: number;
  version: number;
  account_id: string;
  instance_id: string;
  srcaddr: string;
  dstaddr: string;
  srcport: number;
  dstport: number;
  protocol: number;
  packets: number;
  bytes: number;
  starttime: number;
  endtime: number;
  action: string;
  log_status: string;
  source_file: string;
}

export interface SearchRequest {
  search_string?: string;
  earliest_time?: number | null;
  latest_time?: number | null;
  max_results?: number;
}

export interface SearchResponse {
  success: boolean;
  search_time_seconds: number;
  total_results: number;
  results_returned: number;
  files_searched: number;
  results: Event[];
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  files_uploaded: string[];
  total_files: number;
  message: string;
  error?: string;
}

export interface HealthResponse {
  status: string;
  total_event_files: number;
  events_dir: string;
  uploads_dir: string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ error?: string }>) => {
    if (error.response) {
      const message = error.response.data?.error || error.response.statusText || 'Request failed';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export async function searchEvents(params: SearchRequest): Promise<SearchResponse> {
  const response = await apiClient.post<SearchResponse>('/events/search/', params);
  return response.data;
}

export async function uploadFiles(files: FileList): Promise<UploadResponse> {
  const formData = new FormData();
  
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  
  const response = await apiClient.post<UploadResponse>('/events/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    },
  });
  
  return response.data;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>('/health/');
  return response.data;
}
