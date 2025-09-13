import React from 'react'
import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

export default axios.create({
    baseUrl: BASE_URL,
    headers: {'Content-Type': 'application/json'}
})

export const axiosPrivate = axios.create({
    baseUrl: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})