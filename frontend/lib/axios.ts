import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:3001'
axios.defaults.timeout = 10_000

axios.interceptors.response.use(
  function (response) {
    // If the response status is 401, redirect to the signin page
    if (response.status === 401) {
      // Perform redirection to the signin page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin'
      }
    }

    // If the response status is not 401, return the response
    return response
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

export default axios
