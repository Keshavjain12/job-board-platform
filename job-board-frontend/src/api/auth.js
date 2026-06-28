import client from './client.js'
import axios from 'axios'

export const login = (username, password) =>
  axios.post('/api/auth/login/', { username, password })

export const register = (data) =>
  axios.post('/api/auth/register/', data)

export const refreshToken = (refresh) =>
  axios.post('/api/auth/refresh/', { refresh })

export const getMe = () => client.get('/auth/me/')
