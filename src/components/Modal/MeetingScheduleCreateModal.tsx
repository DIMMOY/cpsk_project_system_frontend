import React, { ChangeEvent, useState } from 'react'
import { Box, Button, Grow, TextField, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import Modal from '@mui/material/Modal';
import { useMediaQuery } from 'react-responsive';
import { createMeetingSchedule } from '../../utils/meetingSchedule';

interface ModalProps {
    children: React.ReactNode; 
    open: boolean
    onClose: () => void
    refresh: () => void
}

const MeetingScheduleCreateModal = ({ open, onClose, refresh }: ModalProps) => {
  const [meetingScheduleName, setMeetingScheduleName] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState<boolean>(false) 
  const [loading, setLoading] = useState<boolean>(false)
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })

    const handleMeetingScheduleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMeetingScheduleName(event.target.value as string)
        setCanSubmit(event.target.value ? true : false)
    }
    const handleCreateClass = async () => {
        setLoading(true)
        console.log('Creating...')
        const reqBody = { name: meetingScheduleName }
        const res = await createMeetingSchedule(reqBody);
        if (res.statusCode !== 201) {
        }
        setTimeout(() => {
            onClose()
            refresh()
        }, 1000)
        setTimeout(() => {
            setMeetingScheduleName(null)
            setCanSubmit(false)
            setLoading(false)
        }, 1300)
    }
    
    const handleCancel = () => {
        onClose()
        setTimeout(() => {
            setMeetingScheduleName(null)
            setCanSubmit(false)
            setLoading(false)
        }, 300)
    }

    return (
        <Modal
            open={open}
            onClose={handleCancel}
            aria-labelledby="meetingschedule-title"
            aria-describedby="meetingschedule-description"
            sx={{ display: 'flex', justifyContent: 'center', top: '25%', overflow: 'auto' }}
            disableEnforceFocus
            disableScrollLock
        >
            <Grow in={open}>
            <Box sx={{
                position: 'absolute',
                display: 'flex',
                height: 350,
                width: '60vw',
                minWidth: 350,
                bgcolor: '#FCFCFC',
                borderRadius: '20px',
                boxShadow: 24,
                padding: '2rem 3rem 2rem 3rem',
                flexDirection: 'column',
                transform: 'translate(-50%, -50%)',
                'element.style': {transform: 'none'},
            }}>
                <Typography 
                    id="meetingschedule-title" 
                    className='maincolor'
                    sx={{fontSize: 40, fontWeight: 500, marginBottom: 2}}
                >
                    สร้างรายงานพบอาจารย์ที่ปรึกษา
                </Typography>
                <Typography 
                    id="meetingschedule-description"
                    sx={{fontSize: 20, fontWeight: 500, marginBottom: 1, color: '#686868'}}
                >
                    ชื่อรายการ *
                </Typography>
                <TextField
                    autoFocus
                    required
                    id="meetingschedule-description"
                    size="medium"
                    fullWidth
                    inputProps={{ 
                        maxLength: 50,
                    }}
                    sx={{
                        "& fieldset": { border: 'none' },
                        "& .MuiOutlinedInput-root": {
                            padding: "0.1rem 0.35rem 0.1rem 0.35rem",
                            backgroundColor: "#F3F3F3",
                            borderRadius: "10px",
                            fontSize: 20,
                            color: "#686868",
                            fontWeight: 500,
                            marginBottom: 2,
                        },
                    }}
                    onChange={handleMeetingScheduleNameChange}
                />
                {/* <Typography 
                    id="meetingschedule-description"
                    sx={{fontSize: 20, fontWeight: 500, marginBottom: 1, color: '#686868'}}
                >
                    คำอธิบาย
                </Typography>
                <TextField
                    autoFocus
                    id="meetingschedule-description"
                    fullWidth
                    multiline
                    maxRows={4}
                    minRows={4}
                    size="medium"
                    sx={{
                        "& fieldset": { border: 'none' },
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#F3F3F3",
                            borderRadius: "10px",
                            padding: "1rem 1.25rem 1rem 1.25rem",
                            fontSize: 20,
                            color: "#686868",
                            fontWeight: 500,
                            marginBottom: 2,
                        },
                    }}
                    onChange={handleMeetingScheduleNameChange}
                /> */}
                <Button
                    onClick={handleCancel} 
                    sx={{
                        width: "7rem",
                        height: "2.8rem",   
                        fontSize: 20,
                        background: '#FCFCFC',
                        borderRadius: '10px',
                        color: '#686868',
                        boxShadow: 'none',
                        textTransform: 'none',
                        transform: 'translate(-50%, -50%)',
                        position: 'absolute',
                        right: 130,
                        bottom: 10,
                        '&:hover': { background: '#F3F3F3' }
                    }}
                >
                    ยกเลิก
                </Button>
                <LoadingButton
                    onClick={handleCreateClass}
                    loading={loading} 
                    sx={{
                        width: "7rem",
                        height: "2.8rem",   
                        fontSize: 20,
                        background: '#FCFCFC',
                        borderRadius: '10px',
                        color: '#AD50FF',
                        boxShadow: 'none',
                        textTransform: 'none',
                        transform: 'translateY(-50%)',
                        position: 'absolute',
                        right: '3rem',
                        bottom: 10,
                        '&:hover': { background: '#F3F3F3' },
                        "&:disabled": {
                        backgroundColor: '#FCFCFC',
                        }
                    }}
                    disabled={!canSubmit}
                >
                    ยืนยัน
                </LoadingButton>
            </Box>
            </Grow>
        </Modal>
    )
}

export default MeetingScheduleCreateModal