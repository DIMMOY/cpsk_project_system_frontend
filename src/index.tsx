import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./config/firebase";
import applicationStore from "./stores/applicationStore";
import axios from "axios";
import { findProjectInClassForStudent } from "./utils/project";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

onAuthStateChanged(firebaseAuth, async (user) => {
  if (user && user.email?.indexOf("@ku.th") !== -1) {
    const accessToken = await user.getIdTokenResult();
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + accessToken.token;
    axios.defaults.headers.common["Access-Control-Allow-Credentials"] = "true";
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Access-Control-Allow-Methods"] = "GET,OPTIONS,PATCH,DELETE,POST,PUT";
    axios.defaults.headers.common["Access-Control-Allow-Headers"] = "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version";
    
    applicationStore.setExpiredTime(
      new Date(accessToken.expirationTime).getTime() - 120000
    );
    const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/user`;
    const userRes = await axios.patch(`${url}/last-login`, {
      imageUrl: user.photoURL,
    });
    const userData = userRes.data.data;
    applicationStore.setRole(userData.role);
    applicationStore.setUser({ ...user, displayName: userData.displayName });

    // find class when user is student
    if (applicationStore.currentRole === 0) {
      const userJoinClassRes = await axios.get(`${url}/class`);
      const classroom = userJoinClassRes.data.data
        ? userJoinClassRes.data.data.classId
        : null;
      applicationStore.setClassroom(classroom);
      if (classroom) {
        // find project
        const projectInClassRes = await findProjectInClassForStudent(
          classroom._id
        );
        const project = projectInClassRes.data ? projectInClassRes.data : null;
        applicationStore.setProject(project);
      }
    }
  }
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
