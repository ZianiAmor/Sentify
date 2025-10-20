import axios from 'axios';

// 1. Set the base URL for all API requests
const API_BASE_URL = 'http://localhost:5000/api';

// 2. Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,        // All requests will start with this URL
  withCredentials: true,        // ✅ CRITICAL: This allows cookies to be sent with requests
  timeout: 10000,               // Request will fail if it takes longer than 10 seconds
});

// 3. REQUEST INTERCEPTOR (runs before each request is sent)
apiClient.interceptors.request.use(
  (config) => {
    // This function can modify the request config before it's sent
    // Since you're using cookies, you don't need to manually add tokens to headers
    // But you could add logging or other modifications here
    console.log('Sending request:', config.method, config.url);
    return config;
  },
  (error) => {
    // Handle request creation errors
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
  
    console.log('Received response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    
    if (error.response?.status === 401) {
      
      console.log('Authentication failed, redirecting to login');
      window.location.href = '/login';  
    }
    return Promise.reject(error);
  }
);

// 5. Create service methods for different API endpoints
export const entriesService = {
  getAll: () => apiClient.get('/entries'),
  getById: (id) => apiClient.get(`/entries/${id}`),
  create: (entryData) => apiClient.post('/entries', entryData),
  update: (id, entryData) => apiClient.put(`/entries/${id}`, entryData),
  delete: (id) => apiClient.delete(`/entries/${id}`),
  analyze: (text) => apiClient.post('/entries/analyze', { text }),
  entity: (text) => apiClient.post('/entries/entity', { text }),
  extractTriggers: (text) => apiClient.post('/entries/triggers', { text }, { timeout: 30000 })

};

export default apiClient;