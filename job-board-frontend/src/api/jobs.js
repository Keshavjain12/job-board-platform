import client from './client.js'

export const getJobs = (params) => client.get('/jobs/', { params })
export const getJob = (id) => client.get(`/jobs/${id}/`)
export const createJob = (data) => client.post('/jobs/', data)
export const updateJob = (id, data) => client.patch(`/jobs/${id}/`, data)
export const deleteJob = (id) => client.delete(`/jobs/${id}/`)

export const applyToJob = (jobId, data) =>
  client.post('/applications/', { ...data, job: jobId })

export const getMyApplications = () => client.get('/applications/')
export const getJobApplications = (jobId) =>
  client.get('/applications/', { params: { job: jobId } })

export const updateApplicationStatus = (appId, status) =>
  client.patch(`/applications/${appId}/`, { status })

export const getMyProfile = () => client.get('/profiles/')
export const createProfile = (data) => client.post('/profiles/', data)
export const updateProfile = (id, data) => client.patch(`/profiles/${id}/`, data)
