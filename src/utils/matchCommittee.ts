import axios from "axios";
import { refreshToken } from "./auth";

export const createMatchCommittee = async (classId: string, name: string) => {
  try {
    await refreshToken();
    const url = `${
      process.env.REACT_APP_API_BASE_URL_CLIENT as string
    }/class/${classId}/committee`;
    await axios.post(url, { name });
    return {
      statusCode: 201,
      message: "Create match committee successful",
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
