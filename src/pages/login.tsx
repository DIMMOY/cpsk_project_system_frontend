import { Box } from "@material-ui/core"
import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import logo from '../assets/images/logo.png'
import { useMediaQuery } from "react-responsive"
import logoGoogle from '../assets/images/google_logo.png'


export const Login = () => {
    const isBigScreen = useMediaQuery({query: '(min-width: 850px)'})

    return (
        <Box className="background min-vh-100" style={{ minHeight: "375px"}}>
            <>
            <div className = {isBigScreen ? "background-triangle-fullscreen" : "background-triangle-notfullscreen"} />
            { isBigScreen &&
                <Box className="background-rectangle">
                    <div style={{
                        position: "absolute", margin: "auto",
                        top: "40%", left: "50%",
                        transform: "translate(-50%, -40%)",
                    }}>
                        <img src={logo} style={{paddingBottom: "2rem", maxWidth: "100%", height: "auto"}} alt="logo" />
                        <h1 style={{
                            color: "#FCFCFC",
                            fontSize: "2.375rem",
                            fontWeight:"600", 
                            fontFamily: "Prompt"
                        }}>CPSK Project System</h1>
                    </div>
                </Box>
            }
            </>
            <Box style={{
                    position: "absolute", margin: "auto",
                    width: isBigScreen ? "50vw" : "80vw", height: "310px", top: "27vh", left: isBigScreen ? "50vw" : "10vw",
                }}>
                    <Box position= "relative">
                        <h1 style={{color: "#A45AFC", fontSize: "3.75rem", fontWeight:"600", lineHeight: "30px"}}>Login</h1>
                        <h1 style={{color: "#737373", fontSize: "1.56rem", fontWeight:"300", lineHeight: "30px"}}>ลงทะเบียนเข้าใช้งานเพื่อเริ่มต้นใช้งานเว็บไซต์ CPSK Project System</h1>
                        <h1 style={{color: "#A45AFC", fontSize: "1.56rem", fontWeight:"500", lineHeight: "30px", paddingBottom: "1rem"}}>@ku.th เท่านั้น</h1>
                        <Button style={{position: "absolute", fontSize: "25px", fontWeight:"500", color: "#AD68FF", backgroundColor: "#AD68FF", fontFamily: "Prompt",
                            boxShadow: "0px 0px 2.41919px rgba(0, 0, 0, 0.084), 0px 2.41919px 2.41919px rgba(0, 0, 0, 0.168)", textTransform: "none", top: "17rem", left: "8px",
                            padding: "10px"}}
                            disabled
                        >
                            <img src={logoGoogle} alt="logo_google" style={{ paddingRight: "10px", opacity: "0" }}></img>
                            Sign in with Google
                        </Button>
                        <Button style={{position: "absolute", fontSize: "1.56rem", fontWeight:"500", color: "rgba(0, 0, 0, 0.54)", backgroundColor: "#FFFFFF", fontFamily: "Prompt",
                            boxShadow: "0px 0px 2.41919px rgba(0, 0, 0, 0.084), 0px 2.41919px 2.41919px rgba(0, 0, 0, 0.168)", textTransform: "none", top: "16.5rem", left: "0px",
                            padding: "10px"} 
                        }>
                            <img src={logoGoogle} alt="logo_google" style={{ paddingRight: "10px", minHeight: "100%", maxWidth: "100%", height: "auto" }}></img>
                            Sign in with Google
                        </Button>
                    </Box>
                </Box>
        </Box>
    )
}