import axios from "axios";
import { responsePattern } from "../constants/responsePattern";
import { refreshToken } from "./auth";

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class`;

export const createClass = async (reqBody: any) => {
  try {
    await refreshToken();
    await axios.post(url, reqBody);
    return {
      statusCode: 201,
      message: "Create class successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Create class error",
      errorMsg: "สร้าง Class ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const updateClass = async (classId: string, reqBody: any) => {
  try {
    await refreshToken();
    await axios.put(`${url}/${classId}`, reqBody);
    return {
      statusCode: 200,
      message: "Update class successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Update class error",
      errorMsg: "อัพเดท Class ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const listClass = async (reqQuery: any) => {
  try {
    await refreshToken();
    const resAxios = await axios.get(url, { params: reqQuery });
    return {
      data: resAxios.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "List class error",
      errorMsg: "ค้นหา Class ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const getClassById = async (id: string) => {
  try {
    await refreshToken();
    const resAxios = await axios.get(`${url}/${id}`);
    return {
      data: resAxios.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Get class error",
      errorMsg: "ค้นหา Class ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const leaveClass = async (classId: string) => {
  try {
    await refreshToken();
    const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${classId}/leave`;
    const resAxios = await axios.delete(url);
    return {
      statusCode: resAxios.data.statusCode,
      message: resAxios.data.message,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Leave Class error",
      errorMsg: "ออก Class ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
}
