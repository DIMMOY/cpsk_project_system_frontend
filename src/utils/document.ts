import axios from "axios"
import { responsePattern } from "../constants/responsePattern"

const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/document`

export const createDocument = async (reqBody: any) => {
    try {
        await axios.post(url, reqBody)
        return {
            statusCode: 201,
            message: 'Create document successful',
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'Create document error',
            errorMsg: 'สร้างรายการส่งเอกสารผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}

export const listDocument = async (reqQuery: any) => {
    try {
        const resAxios = await axios.get(url, {params: reqQuery})
        return {
            data: resAxios.data.data
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 400,
            message: 'List document error',
            errorMsg: 'ค้นหารายการเอกสารผิดพลาด กรุณาลองใหม่ในภายหลัง',
            error
        }
    }
}