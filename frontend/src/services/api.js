import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL:BASE_URL
})

export const getAllJobs = () => api.get('api/jobs/')

export const getJob = (id) => api.get(`api/jobs/${id}`)

export const createJob = (data) => api.post('api/jobs',data)

export const updateJob = (id,data) => api.put(`api/jobs/${id}`,data)

export const deleteJob = (id) => api.delete(`api/jobs/${id}`)


export const getNotes = (jobId) => api.get(`api/notes/${jobId}`)

export const createNote = (data) => api.post('api/notes/',data)

export const updateNote = (id,data) => api.put(`/api/notes/${id}`, data)

export const deleteNote = (id) => api.delete(`/api/notes/${id}`)

export const getAnalytics = () => api.get('/api/analytics/')


export const getTimeline = (jobId) => api.get(`/api/timeline/${jobId}`)
export const createTimelineEntry = (data) => api.post('/api/timeline/', data)
export const deleteTimelineEntry = (id) => api.delete(`/api/timeline/${id}`)