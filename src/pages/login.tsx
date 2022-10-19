import { Button, Container, Box } from '@mui/material'
import logo from '../assets/images/logo.png'
import { useMediaQuery } from 'react-responsive'
import logoGoogle from '../assets/images/google_logo.png'
import Typography from '@mui/material/Typography'
import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import { signInWithGoogle } from '../utils/auth'

export default function Login () {
  const isBigScreen = useMediaQuery({ query: '(min-width: 850px)' })

  const onGoogleLogIn = async () => {
    const res = await signInWithGoogle();
    console.log(res)
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
            <Typography sx={{ color: '#FCFCFC', fontSize: 38, fontWeight: 600 }}>
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
          <Typography sx={{ color: '#AD68FF', fontSize: 60, fontWeight: 600, marginBottom: 1 }}>
            Login
          </Typography>
          <Typography sx={{ color: '#737373', fontSize: 25, fontWeight: 300, marginBottom: 1 }}>
            ลงทะเบียนเข้าใช้งานเพื่อเริ่มต้นใช้งานเว็บไซต์ CPSK Project System
          </Typography>
          <Typography
            className="fs-25 fw-500"
            sx={{
              color: '#AD68FF',
              paddingBottom: '1rem',
              fontSize: 25,
              fontWeight: 500
            }}
          >
            @ku.th เท่านั้น
          </Typography>
          <Box>
            {/* <Button
                sx={{
                  position: 'absolute',
                  fontSize: '25px',
                  fontWeight: '500',
                  backgroundColor: '#AD68FF',
                  fontFamily: 'Prompt',
                  boxShadow:
                    '0px 0px 2.41919px rgba(0, 0, 0, 0.084), 0px 2.41919px 2.41919px rgba(0, 0, 0, 0.168)',
                  textTransform: 'none',
                  top: '17rem',
                  left: '8px',
                  padding: '0.625rem'
                }}
                disabled
            >
                <img
                src={logoGoogle}
                alt="logo_google"
                style={{ paddingRight: '0.625rem', opacity: '0' }}
                ></img>
                <Typography sx={{color: '#AD68FF'}}>Sign in with Google</Typography>
            </Button> */}
            <Button
                sx={{
                  position: 'absolute',
                  fontSize: '1.56rem',
                  fontWeight: '500',
                  color: 'rgba(0, 0, 0, 0.54)',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Prompt',
                  boxShadow:
                    '0px 0px 2.41919px rgba(0, 0, 0, 0.084), 0px 2.41919px 2.41919px rgba(0, 0, 0, 0.168)',
                  textTransform: 'none',
                  top: '16.5rem',
                  left: '0px',
                  padding: '0.625rem'
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
                  height: 'auto'
                }}
                ></img>
                Sign in with Google
            </Button>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}
