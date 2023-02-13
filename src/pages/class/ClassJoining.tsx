import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, TextField } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select';
import { useLocation, useNavigate } from 'react-router-dom'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { useMediaQuery } from 'react-responsive';
import { listClass } from '../../utils/class';

import applicationStore from '../../stores/applicationStore';
import { observer } from 'mobx-react';
import { theme } from '../../styles/theme';
import { display } from '@mui/system/Box/Box';
import { LoadingButton } from '@mui/lab';
import { joinClass } from '../../utils/user';

const ClassJoining = observer(() => {
  const navigate = useNavigate()
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole } = applicationStore

  const [inviteCode, setInviteCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
      applicationStore.setClassroom(null)
      applicationStore.setIsShowSideBar(false)
      applicationStore.setIsShowMenuSideBar(false)
    }, [] 
  )

  const onInviteCodeChange = (code: string) => {
    const isLetters = (str: string) => /^[A-Za-z0-9]*$/.test(str);
    if (isLetters(code)) setInviteCode(code)
  };

  const handleOnSubmit = async () => {
    setLoading(true)
    const res = await joinClass({})

  }

  return (
    <CommonPreviewContainer>
      <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', height: '35rem', textAlign: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <Typography
            sx={{ fontSize: 60, fontWeight: 500, color: theme.color.text.primary }}
          >
          ยินดีต้อนรับสู่
        </Typography> 
        <Typography
            sx={{ fontSize: 60, fontWeight: 500, color: theme.color.text.primary }}
          >
          CPSK Project  System
        </Typography>
        <Typography
            sx={{ fontSize: 30, fontWeight: 500, color: theme.color.text.primary, marginTop: '1rem' }}
          >
          ใส่รหัส Classroom
        </Typography>
        <TextField
            autoFocus
            required
            value={inviteCode}
            id="class-invite-code"
            size="small"
            inputProps={{ maxLength: 6, style: { textAlign: 'center' } }}
            sx={{
                "& fieldset": { border: 'none' },
                "& .MuiOutlinedInput-root": {
                    padding: "0.25rem",
                    backgroundColor: theme.color.background.default,
                    borderRadius: "10px",
                    fontSize: 20,
                    width: '20rem',
                    color: theme.color.text.secondary,
                    border: "3px solid",
                    borderColor: theme.color.background.primary,
                    fontWeight: 500,
                    marginTop: '1rem',
                    marginBottom: '1.5rem',
                },
            }}
            onChange={(e) => onInviteCodeChange(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    //Submit
                }
            }}
        />
        
        <LoadingButton 
            loading={loading}
            sx={{
                width: "7rem",
                height: "2.8rem",
                fontSize: 20,
                textAlign: "center",
                justifyContent: "center",
                background: theme.color.button.primary,
                borderRadius: '10px',
                color: theme.color.text.default,
                boxShadow: 'none',
                textTransform: 'none',
                '&:hover': { background: '#B07CFF' },
                "&:disabled": {
                    backgroundColor: theme.color.button.disable,
                }
            }}
            disabled={inviteCode.length !== 6}
            // onClick={handleOnSubmit}
            >
                ยืนยัน
        </LoadingButton>  
      </Box>
    </CommonPreviewContainer>
  )
})

export default ClassJoining
