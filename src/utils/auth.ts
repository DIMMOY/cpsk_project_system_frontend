import axios from 'axios'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseApp, firebaseAuth } from '../config/firebase';
import firebase from 'firebase/app';
import applicationStore from '../stores/applicationStore';

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
      await auth.signOut();
      applicationStore.setUser(null)
      return {
        statusCode: 403,
        message: 'Authentication error',
        errorMsg: 'กรุณาใช้โดเมน @ku.th ในการเข้าใช้งาน !'
      };
    }

    const credential = await GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    applicationStore.setUser(result.user)
    return {
      statusCode: 200,
      message: 'Sign in successfull',
      result,
    };
  } catch (error) {
    // if (error.code && error.code === 'auth/popup-closed-by-user')
    if (error instanceof Error) {
      if (error.message === 'Firebase: Error (auth/popup-closed-by-user).' || error.message === 'Firebase: Error (auth/cancelled-popup-request).') {
        return {
          statusCode: 400,
          message: 'Popup closed by user',
          errorMsg: ''
        };
      } else {
        console.error(error);
        return {
          statusCode: 400,
          message: 'Authentication error',
          errorMsg: 'การเข้าใช้งานผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง'
        };
      }
    } else {
      console.error(error);
      return {
        statusCode: 400,
        message: 'Authentication error',
        errorMsg: 'การเข้าใช้งานผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง'
      };
    }
  }
}

export const signOutWithGoogle = async () => {
  try {
    const auth = firebaseAuth;
    await auth.signOut();
    applicationStore.setUser(null)
    applicationStore.setIsShowNavBar(false)

    return {
      statusCode: 200,
      message: 'Sign out successfull',
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: 'Authentication error',
      errorMsg: 'ออกจากระบบผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง'
    }
  }
}

export const refreshToken = async () => {
  const { expiredTime } = applicationStore
  const now = new Date().getTime()
  if (expiredTime < now) {
    const auth = getAuth()
    const user = auth.currentUser
    if (user && user.email?.indexOf('@ku.th') !== -1) {
      const accessToken = await user.getIdTokenResult(true);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken.token;
      applicationStore.setExpiredTime(new Date(accessToken.expirationTime).getTime() - 120000);
      console.log("REFRESH: " + new Date(accessToken.expirationTime) + " " + new Date(expiredTime));
    }
  }
}
