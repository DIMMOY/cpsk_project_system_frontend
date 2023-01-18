import React, { useState } from 'react'
import { Box, Button, Grow, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import Modal from '@mui/material/Modal';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import { setDateMeetingSchedule } from '../../utils/meetingSchedule';

interface ModalProps {
    open: boolean
    onClose: () => void
    refresh: () => void
    meetingScheduleName: string | null
    meetingScheduleId: string | null
    defaultStartDate: string | null
    defaultEndDate: string | null
}

const MeetingScheduleStartModal = ({ open, meetingScheduleName: documentName, onClose, meetingScheduleId, refresh, defaultStartDate, defaultEndDate }: ModalProps) => {
  const [canSubmit, setCanSubmit] = useState<boolean>(false) 
  const [loading, setLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string | null>(
    moment(defaultStartDate ? defaultStartDate : new Date()).format('YYYY-MM-DDTHH:mm'),
  );
//   console.log(moment(defaultStartDate ? defaultStartDate : new Date()).format('YYYY-MM-DDTHH:mm'))
//   console.log(startDate)
  const [endDate, setEndDate] = useState<string | null>(defaultEndDate);
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })

  const handleStartDateChange = (newDate: string | null) => {
    const date = newDate ? moment(newDate).format('YYYY-MM-DDTHH:mm') : null;
    setStartDate(date)
    setCanSubmit(date ? true : false)
  };

  const handleEndDateChange = (newDate: string | null) => {
    const date = newDate ? moment(newDate).format('YYYY-MM-DDTHH:mm') : null;
    setEndDate(date);
    setCanSubmit(date ? true : false)
  };

    const handleSetDate = async () => {
        setLoading(true)
        console.log('Creating...')
        const reqBody = { classId: window.location.pathname.split('/')[2], meetingScheduleId, startDate, endDate }
        const res = await setDateMeetingSchedule(reqBody);
        if (res.statusCode !== 201) {
            console.error(res.errorMsg)
            return
        }
        setTimeout(() => {
            onClose()
            refresh()
        }, 1000)
        setTimeout(() => {
            setStartDate(moment(defaultStartDate ? defaultStartDate : new Date()).format('YYYY-MM-DDTHH:mm'))
            setEndDate(null)
            setCanSubmit(false)
            setLoading(false)
        }, 1300)
    }
    
    const handleCancel = () => {
        onClose()
        setTimeout(() => {
            setStartDate(moment(defaultStartDate ? defaultStartDate : new Date()).format('YYYY-MM-DDTHH:mm'))
            setEndDate(null)
            setCanSubmit(false)
            setLoading(false)
            console.log(startDate)
        }, 300)
    }

    return (
        <Modal
            open={open}
            onClose={handleCancel}
            aria-labelledby="document-title"
            aria-describedby="document-description"
            sx={{ display: 'flex', justifyContent: 'center', top: '25%', overflow: 'auto' }}
            disableEnforceFocus
            disableScrollLock
        >
            <Grow in={open}>
            <Box sx={{
                position: 'absolute',
                display: 'flex',
                height: 300,
                width: '40vw',
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
                    id="document-title" 
                    className='maincolor'
                    sx={{fontSize: 40, fontWeight: 500, marginBottom: 5}}
                >
                    เปิดใช้งาน {documentName}
                </Typography>
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
                    onClick={handleSetDate}
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
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                        id="start-datetime-local"
                        label="เวลาเริ่มต้น"
                        type="datetime-local"
                        defaultValue={startDate}
                        sx={{ width: 250, marginRight: 4 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={e => handleStartDateChange(e.target.value)}
                    />
                    <TextField
                        id="end-datetime-local"
                        label="เวลาสิ้นสุด"
                        type="datetime-local"
                        defaultValue={endDate}
                        sx={{ width: 250 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={e => handleEndDateChange(e.target.value)}
                />

                </Box>
            </Box>
            </Grow>
        </Modal>
    )
}

export default MeetingScheduleStartModal