import axios from "axios";
import { refreshToken } from "./auth";

export const createMatchCommitteeInClass = async (classId: string, name: string) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/committee`;
    const resAxios = await axios.post(url, { name });
    return {
      statusCode: resAxios.data.statusCode,
      message: resAxios.data.message,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Create match committee error",
      errorMsg: "สร้าง match committee ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const listMatchCommitteeInClass = async (
    reqQuery: any,
    classId: string
  ) => {
    try {
      await refreshToken();
      const url = `${
        process.env.REACT_APP_API_BASE_URL_CLIENT as string
      }/class/${classId}/committee`;
      const resAxios = await axios.get(url, { params: reqQuery });
      return {
        statusCode: resAxios.data.statusCode,
        message: resAxios.data.message,
        data: resAxios.data.data,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 400,
        message: "List match committee error",
        errorMsg: "ค้นหา match committee ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง",
        error,
      };
    }
  };

export const getMatchCommitteeInClass = async (
  classId: string,
  committeeId: string,
) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/committee/${committeeId}`;
    const resAxios = await axios.get(url);
    return {
      statusCode: resAxios.data.statusCode,
      message: resAxios.data.message,
      data: resAxios.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Get match committee error",
      errorMsg: "ค้นหา match committee ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const createMatchCommitteeHasGroupInClass = async (classId: string, committeeId: string, userId: Array<string>) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/committee/${committeeId}/group`;
    const resAxios = await axios.post(url, { userId });
    return {
      statusCode: resAxios.data.statusCode,
      message: resAxios.data.message,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Create match committee has group error",
      errorMsg: "สร้าง match committee has group ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const createMatchCommitteeHasGroupToProject = async (classId: string, committeeId: string, groudId: string, createP: Array<string>, deleteP: Array<string>) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/committee/${committeeId}/group/${groudId}`;
    const resAxios = await axios.post(url, 
      { 
        createInGroup: createP,
        deleteInGroup: deleteP,
      }
    );
    return {
      statusCode: resAxios.data.statusCode,
      message: resAxios.data.message,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Create match committee has group to project error",
      errorMsg: "สร้าง match committee has group to project ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const setDateMatchCommittee = async (reqBody: any) => {
  try {
    await refreshToken();
    const { startDate } = reqBody;
    const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${
      reqBody.classId as string
    }/committee/${reqBody.matchCommitteeId as string}/date`;
    await axios.put(url, { startDate });
    return {
      statusCode: 200,
      message: "Set match committee due date successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Set match committee due date error",
      errorMsg: "สร้างรายการส่ง match committee ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const disableMatchCommitteeInClass = async (
  classId: string,
  matchCommitteeId: string
) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/committee/${matchCommitteeId}/date/status`;
    await axios.patch(url, { status: false });
    return {
      statusCode: 200,
      message: "Disable match committee in class successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Disable match committee in class error",
      errorMsg: "ยกเลิก match committee ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};