import axios from 'axios'
import { baseURL } from '../constants/index'

export default axios.create({
  baseURL,
  headers: {
    'Formshaker-ApiKey': import.meta.env.VITE_BACKEND_PASSWORD
  }
})
