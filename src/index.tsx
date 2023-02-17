import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from './config/firebase'
import applicationStore from './stores/applicationStore'
import axios from 'axios'
import { findProjectInClassForStudent } from './utils/project'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

console.warn = (msg) => console.error(msg);

onAuthStateChanged(firebaseAuth, async (user) => {
  if (user && user.email?.indexOf('@ku.th') !== -1) {
    const accessToken = await user.getIdToken()
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
    applicationStore.setUser(user)
    const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/user`
    const userRes = await axios.patch(`${url}/last-login`)
    const userData = userRes.data.data
    const { userId } = userData
    applicationStore.setRole(userData.role)

    // find class when user is student
    if ( applicationStore.currentRole === 0) {
      const userJoinClassRes = await axios.get(`${url}/class`)
      const classroom = userJoinClassRes.data.data ? userJoinClassRes.data.data.classId : null
      applicationStore.setClassroom(classroom)
      if (classroom) {
        // find project
        const projectInClassRes = await findProjectInClassForStudent(classroom._id)
        const project = projectInClassRes.data ? projectInClassRes.data.projectId : null
        console.log(projectInClassRes)
        applicationStore.setProject(project)
      }
    }
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
