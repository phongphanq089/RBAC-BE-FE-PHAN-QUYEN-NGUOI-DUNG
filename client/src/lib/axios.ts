import axios from 'axios'
import { useAuthStore } from '~/store/auth'

const API_BASE_URL = 'http://127.0.0.1:3000/api'
export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
