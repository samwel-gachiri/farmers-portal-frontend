import axios from 'axios'
import store from '@/store'

// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = store.getters['auth/token']
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response

            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    store.dispatch('auth/logout')
                    window.location.href = '/signin'
                    break
                case 403:
                    // Forbidden
                    console.error('Access forbidden:', data.message)
                    break
                case 404:
                    // Not found
                    console.error('Resource not found:', error.config.url)
                    break
                case 500:
                    // Server error
                    console.error('Server error:', data.message)
                    break
                default:
                    console.error('API Error:', data.message || error.message)
            }
        } else if (error.request) {
            // Network error
            console.error('Network error:', error.message)
        } else {
            // Other error
            console.error('Error:', error.message)
        }

        return Promise.reject(error)
    }
)

export default apiClient"