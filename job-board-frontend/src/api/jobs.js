import client from './client.js'

export const getJobs = (params) => client.get('/jobs/', { params })
export const getJob = (id) => client.get(`/jobs/${id}/`)
export const createJob = (data) => client.post('/jobs/', data)
export const updateJob = (id, data) => client.put(`/jobs/${id}/`, data)
export const deleteJob = (id) => client.delete(`/jobs/${id}/`)

export const applyToJob = (jobId, data) =>
  client.post(`/jobs/${jobId}/apply/`, data)

export const getMyApplications = () => client.get('/applications/my/')
export const getJobApplications = (jobId) =>
  client.get(`/jobs/${jobId}/applications/`)

export const updateApplicationStatus = (appId, status) =>
  client.patch(`/applications/${appId}/`, { status })

export const getMyProfile = () => client.get('/profiles/me/')
export const updateProfile = (data) => client.put('/profiles/me/', data)
