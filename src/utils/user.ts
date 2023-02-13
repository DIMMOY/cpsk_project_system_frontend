import axios from "axios";
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from "../config/firebase";
import { getToken } from "./auth";

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/user`

export const changeCurrentRole = async (reqBody: any) => {
   try {
    await getToken();
    await axios.patch(`${url}/current-role`, reqBody)
    return {
        statusCode: 200,
        message: 'Change current role Successful',
    };
   } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'Change current role error',
      errorMsg: 'เปลี่ยน Role ผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง'
    }
   } 
}

export const joinClass = async (reqBody: any) => {
  try {
    await getToken();
    return await axios.post(`${url}/join`, reqBody)
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'Join class error',
      errorMsg: 'เข้า Class ผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง'
    }
   } 
}