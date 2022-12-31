import axios from "axios";

export const changeCurrentRole = async (reqBody: any) => {
   try {
    console.log(reqBody)
    const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/user/current-role`
        await axios.patch(url, reqBody)
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