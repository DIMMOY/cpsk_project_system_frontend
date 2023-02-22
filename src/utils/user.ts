import axios from "axios";
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from "../config/firebase";
import { refreshToken } from "./auth";

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/user`

export const changeCurrentRole = async (reqBody: any) => {
   try {
    await refreshToken();
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

export const listUser = async (reqQuery: any) => {
  try {
    await refreshToken();
    const result = await axios.get(`${url}/role`, {params: reqQuery})
    return {
      data: result.data.data
  };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'Find user error',
      errorMsg: 'ค้นหา User ผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง'
    }
   } 
}

export const addRoleInUser = async(reqBody: any) => {
  try {
    await refreshToken();
    const res = await axios.post(`${url}/role`, reqBody)
    return {
      statusCode: res.data.statusCode,
      message: res.data.message,
  };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'Add role error',
      errorMsg: error.response.data.message,
    }
   } 
}

export const deleteRoleInUser = async(reqBody: any) => {
  try {
    await refreshToken();
    const res = await axios.put(`${url}/role`, reqBody)
    return {
      statusCode: res.data.statusCode,
      message: res.data.message,
  };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'Delete role error',
      errorMsg: error.response.data.message,
    }
   } 
}

export const joinClass = async (reqBody: any) => {
  try {
    await refreshToken();
    await axios.post(`${url}/class/join`, reqBody)
    return {
      statusCode: 200,
      message: 'Join class Successful',
  };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'Join class error',
      errorMsg: 'เข้า Class ผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง'
    }
   } 
}