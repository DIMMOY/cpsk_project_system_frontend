import React, { Component, useEffect, useState } from 'react'
import { Button, Container, Box } from '@mui/material'
import logo from '../../assets/images/logo.png'
import { useMediaQuery } from 'react-responsive'
import logoGoogle from '../../assets/images/google_logo.png'
import Typography from '@mui/material/Typography'
import { signInWithGoogle } from '../../utils/auth'
import { theme } from '../../styles/theme'

export default function Login () {
  const isBigScreen = useMediaQuery({ query: '(min-width: 850px)' })
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onGoogleLogIn = async () => {
    setShowErrorMessage(false)
    const res = await signInWithGoogle();
    if (res.statusCode !== 200 && res.errorMsg !== '') {
      setShowErrorMessage(true)
      setErrorMessage(res.errorMsg || 'การเข้าใช้งานผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง')
    }
  }

  return (
    <Box>
      <div
        className={
          isBigScreen
            ? 'background-triangle-fullscreen'
            : 'background-triangle-notfullscreen'
        }
      />
      {isBigScreen && (
        <Box className="background-rectangle">
          <Box
            sx={{
              position: 'absolute',
              margin: 'auto',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -40%)'
            }}
          >
            <img
              src={logo}
              style={{
                paddingBottom: '2rem',
                maxWidth: '100%',
                height: 'auto'
              }}
              alt="logo"
            />
            <Typography sx={{ color: theme.color.text.default, fontSize: 38, fontWeight: 600 }}>
              CPSK Project System
            </Typography>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          margin: 'auto',
          width: isBigScreen ? '40vw' : '80vw',
          height: '310px',
          top: '27vh',
          left: isBigScreen ? '50vw' : '10vw'
        }}
      >
        <Box position="static">
          <Typography 
            sx={{ 
              color: theme.color.text.primary, 
              fontSize: 60, 
              fontWeight: 600, 
              marginBottom: 1 
            }}
          >
            Login
          </Typography>
          <Typography 
            sx={{ 
              color: theme.color.text.secondary, 
              fontSize: 25, 
              fontWeight: 300, 
              marginBottom: 1 
            }}
          >
            ลงทะเบียนเข้าใช้งานเพื่อเริ่มต้นใช้งานเว็บไซต์ CPSK Project System
          </Typography>
          <Typography
            sx={{
              color: theme.color.text.primary,
              marginBottom: '2rem',
              fontSize: 25,
              fontWeight: 500,
            }}
          >
            @ku.th เท่านั้น
          </Typography>
          <Button
              sx={{
                fontSize: '1.56rem',
                fontWeight: '500',
                color: 'rgba(0, 0, 0, 0.54)',
                backgroundColor: 'white',
                fontFamily: 'Prompt',
                boxShadow:
                  '0px 0px 2.41919px rgba(0, 0, 0, 0.084), 0px 2.41919px 2.41919px rgba(0, 0, 0, 0.168)',
                textTransform: 'none',
                padding: '0.5rem 0.8rem 0.5rem 0.8rem',
                borderRadius: '10px',
                marginBottom: '1rem',
              }}
              onClick={onGoogleLogIn}
              disableRipple
          >
              <img
              src={logoGoogle}
              alt="logo_google"
              style={{
                paddingRight: '0.625rem',
                minHeight: '100%',
                maxWidth: '100%',
                height: 'auto',
              }}
              ></img>
              Sign in with Google
          </Button>
          {showErrorMessage && 
            <Typography
            sx={{
              color: theme.color.text.error,
              paddingBottom: '1rem',
              fontSize: 20,
              fontWeight: 400,
            }}
            >
              {errorMessage}
            </Typography>
          }
        </Box>
      </Box>
    </Box>
  )
}
