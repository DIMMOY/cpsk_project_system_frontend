import axios from "axios";
import { responsePattern } from "../constants/responsePattern";
import { refreshToken } from "./auth";

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/assessment`;

export const createAssessment = async (reqBody: any) => {
  try {
    await refreshToken();
    await axios.post(url, reqBody);
    return {
      statusCode: 201,
      message: "Create assessment successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Create assessment error",
      errorMsg: "สร้าง Assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const setDateAssessment = async (reqBody: any) => {
  try {
    await refreshToken();
    const { startDate, endDate, matchCommitteeId } = reqBody;
    const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT as string}/class/${
      reqBody.classId as string
    }/assessment/${reqBody.assessmentId as string}/date`;
    await axios.put(url, { startDate, endDate, matchCommitteeId });
    return {
      statusCode: 200,
      message: "Set assessment due date successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Set assessment due date error",
      errorMsg: "สร้างรายการส่ง assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const listAssessment = async (reqQuery: any) => {
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
      message: "List assessment error",
      errorMsg: "ค้นหา Assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const listAssessmentInClass = async (
  reqQuery: any,
  classId: string
) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/assessment`;
    const resAxios = await axios.get(url, { params: reqQuery });
    return {
      data: resAxios.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "List assessment in class error",
      errorMsg: "ค้นหา assessment ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const listProjectHasAssessment = async (
  classId: string,
  params: { id: string, role: number, matchCommitteeId?: string },
) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/assessment/overview`;
    const resAxios = await axios.get(url, { params });
    return {
      data: resAxios.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "List project has assessment error",
      errorMsg: "ค้นหา project has assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
}

export const getProjectHasAssessmentInClass = async (
  classId: string,
  assessmentId: string,
  projectId: string,
) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/assessment/${assessmentId}/project/${projectId}/form`;
    const resAxios = await axios.get(url);
    return {
      data: resAxios.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Get project has assessment error",
      errorMsg: "ค้นหา project has assessment ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const getAssessmentInClass = async (
  classId: string,
  assessmentId: string,
) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/assessment/detail`;
    const resAxios = await axios.get(url, {params: {id: assessmentId}});
    return {
      data: resAxios.data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Get assessment in class error",
      errorMsg: "ค้นหา assessment ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const disableAssessmentInClass = async (
  classId: string,
  assessmentId: string
) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/assessment/${assessmentId}/date/status`;
    await axios.patch(url, { status: false });
    return {
      statusCode: 200,
      message: "Disable assessment in class successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Disable assessment in class error",
      errorMsg: "ยกเลิก assessment ในคลาสผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const updateAssessment = async (id: string, reqBody: any) => {
  try {
    await refreshToken();
    await axios.put(`${url}/${id}`, reqBody);
    return {
      statusCode: 201,
      message: "Create assessment successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Create assessment error",
      errorMsg: "สร้าง Assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
};

export const createSendAssessment = async (reqBody: any, projectId: string, assessmentId: string) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/project/${projectId}/assessment/${assessmentId}`;
    await axios.post(url, reqBody);
    return {
      statusCode: 201,
      message: "Create send assessment in class successful",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Create send assessment error",
      errorMsg: "สร้าง Send assessment ผิดพลาด กรุณาลองใหม่ในภายหลัง",
      error,
    };
  }
}
