export default 'https://localhost'
import axios from 'axios'
import api from './request'


export function request(config) {

  const req = axios.create({
    baseURL: api,
    timeout: 5000
  })

  return req(config)
}