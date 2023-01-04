import axios from "axios"

export const listProjectInClass = async (reqQuery: any, classId: string) => {
    try {
        const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/class/${classId}/project`
        console.log(url)
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List class error',
            errorMsg: 'ค้นหา Class ผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}