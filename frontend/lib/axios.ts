import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:3001'
axios.defaults.timeout = 10_000

export default axios
