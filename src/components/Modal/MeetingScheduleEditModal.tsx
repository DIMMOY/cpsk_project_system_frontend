import React, { ChangeEvent, useState } from 'react'
import { Box, Button, Grow, TextField, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import Modal from '@mui/material/Modal';
import { useMediaQuery } from 'react-responsive';
import { createMeetingSchedule, updateMeetingSchedule } from '../../utils/meetingSchedule';
import { theme } from '../../styles/theme';

interface ModalProps {
    children: React.ReactNode; 
    open: boolean
    onClose: () => void
    refresh: () => void
    id: string | null;
    name: string;
}

const MeetingScheduleEditModal = ({ open, onClose, refresh, id, name }: ModalProps) => {
  const [meetingScheduleName, setMeetingScheduleName] = useState<string>('')
  const [submit, setSubmit] = useState<boolean>(false) 
  const [loading, setLoading] = useState<boolean>(false)
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })

    const handleMeetingScheduleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if ((event.target.value.replace(/(\r\n|\n|\r)/gm, '').replace(/\s/g,'') == '')) setSubmit(false)
        else {
            setMeetingScheduleName(event.target.value as string)
            setSubmit(true)
        }
    }
    const handleSubmit = async () => {
        setLoading(true)
        const reqBody = { name: meetingScheduleName }
        if (!id) {
            const res = await createMeetingSchedule(reqBody);
            if (res.statusCode !== 201) {
                console.error(res.errorMsg)
            }
        } else {
            const res = await updateMeetingSchedule(id, reqBody)
            if (res.statusCode !== 200) {
                console.error(res.errorMsg)
            }
        }
        setTimeout(() => {
            onClose()
            refresh()
        }, 1000)
        setTimeout(() => {
            setMeetingScheduleName('')
            setSubmit(false)
            setLoading(false)
        }, 1300)
    }
    
    const handleCancel = () => {
        onClose()
        setTimeout(() => {
            setMeetingScheduleName('')
            setSubmit(false)
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
                bgcolor: theme.color.background.default,
                borderRadius: '20px',
                boxShadow: 24,
                padding: '2rem 3rem 2rem 3rem',
                flexDirection: 'column',
                transform: 'translate(-50%, -50%)',
                'element.style': {transform: 'none'},
            }}>
                <Typography 
                    id="meetingschedule-title" 
                    sx={{
                        fontSize: 40, 
                        fontWeight: 500, 
                        marginBottom: 2,
                        color: theme.color.text.primary
                    }}
                >
                    รายงานพบอาจารย์ที่ปรึกษา
                </Typography>
                <Typography 
                    id="meetingschedule-description"
                    sx={{
                        fontSize: 20, 
                        fontWeight: 500, 
                        marginBottom: 1, 
                        color: theme.color.text.secondary
                    }}
                >
                    ชื่อรายการ *
                </Typography>
                <TextField
                    autoFocus
                    required
                    defaultValue={name}
                    id="meetingschedule-description"
                    size="medium"
                    fullWidth
                    inputProps={{ 
                        maxLength: 50,
                    }}
                    sx={{
                        "& fieldset": { border: 'none' },
                        "& .MuiOutlinedInput-root": {
                            padding: "0.25rem",
                            backgroundColor: theme.color.button.default,
                            borderRadius: "10px",
                            fontSize: 20,
                            color: theme.color.text.secondary,
                            fontWeight: 500,
                            marginBottom: 2,
                        },
                    }}
                    onChange={handleMeetingScheduleNameChange}
                />
                <Button
                    onClick={handleCancel} 
                    sx={{
                        width: "7rem",
                        height: "2.8rem",   
                        fontSize: 20,
                        background: theme.color.button.disable,
                        borderRadius: '10px',
                        color: theme.color.text.secondary,
                        boxShadow: 'none',
                        textTransform: 'none',
                        transform: 'translate(-50%, -50%)',
                        position: 'absolute',
                        right: 130,
                        bottom: 10,
                        '&:hover': { background: theme.color.button.default }
                    }}
                >
                    ยกเลิก
                </Button>
                <LoadingButton
                    onClick={handleSubmit}
                    loading={loading} 
                    sx={{
                        width: "7rem",
                        height: "2.8rem",   
                        fontSize: 20,
                        background: theme.color.button.disable,
                        borderRadius: '10px',
                        color: theme.color.text.primary,
                        boxShadow: 'none',
                        textTransform: 'none',
                        transform: 'translateY(-50%)',
                        position: 'absolute',
                        right: '3rem',
                        bottom: 10,
                        '&:hover': { background: theme.color.button.default },
                        "&:disabled": {
                            background: theme.color.button.disable,
                        }
                    }}
                    disabled={!submit}
                >
                    ยืนยัน
                </LoadingButton>
            </Box>
            </Grow>
        </Modal>
    )
}

export default MeetingScheduleEditModal