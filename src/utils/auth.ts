import axios from 'axios'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseAuth, firebaseConfig } from '../config/firebase';

export const signInWithGoogle = async () => {
  try {
    const url = `${process.env.REACT_APP_API_BASE_URL_CLIENT}/user`
    const auth = firebaseAuth;
    auth.languageCode = 'th';

    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

    const result = await signInWithPopup(auth, provider);

    if (result.user.email?.indexOf('@ku.th') == -1) {
      return {
        statusCode: 400,
        message: 'Authentication error',
        errorMsg: 'กรุณาใช้โดเมน @ku.th ในการเข้าใช้งาน !'
      };
    }

    const credential = await GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    let errorMsg = null
    const reqBody = {
      displayName: result.user.displayName,
      email: result.user.email,
      lastLoginAt: new Date(),
    }
    console.log(url)
    const resAxios = await axios.post(url, reqBody)
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          errorMsg = error.response.data.message
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
      })

    return {
      statusCode: 200,
      message: 'Sign in successfull',
      data: { resAxios, token },
      errorMsg
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'Authentication error',
      errorMsg: 'การเข้าใช้งานผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง'
    };
  }
}
