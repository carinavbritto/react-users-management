import axios from 'axios'

const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_URL
const enrichmentServiceBaseURL = import.meta.env.VITE_ENRICHMENT_SERVICE_URL

export const userServiceApi = axios.create({
  baseURL: userServiceBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const enrichmentServiceApi = axios.create({
  baseURL: enrichmentServiceBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
