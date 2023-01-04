import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from './config/firebase'
import applicationStore from './stores/applicationStore'
import axios from 'axios'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

onAuthStateChanged(firebaseAuth, async (user) => {
  if (user && user.email?.indexOf('@ku.th') !== -1) {
    applicationStore.setUser(user)
    const reqBody = {
      displayName: user.displayName,
      email: user.email,
      lastLoginAt: new Date(),
    }
    const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/user`
    const resAxios = await axios.post(url, reqBody)
    const roles = resAxios.data.data
    applicationStore.setRole(roles)
  }
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
