import React, { ChangeEvent, useState } from 'react'
import { Box, Button, Grow, TextField, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import Modal from '@mui/material/Modal';
import { useMediaQuery } from 'react-responsive';
import { createClass } from '../../utils/class';

interface ModalProps {
    children: React.ReactNode; 
    open: boolean
    onClose: () => void
    refresh: () => void
}

const ClassCreateModal = ({ open, onClose, refresh }: ModalProps) => {
  const [majorSelect, setMajorSelect] = useState<string>('ALL')
  const [className, setClassName] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState<boolean>(false) 
  const [loading, setLoading] = useState<boolean>(false)
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })

    const handleClassNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setClassName(event.target.value as string)
        setCanSubmit(event.target.value ? true : false)
    }

    const handleMajorSelectChange = (event: SelectChangeEvent) => {
        setMajorSelect(event.target.value as string)
    }

    const handleCreateClass = async () => {
        setLoading(true)
        console.log('Creating...')
        const reqBody = { name: className, endDate: null, complete: false, major: majorSelect }
        const res = await createClass(reqBody);
        if (res.statusCode !== 201) {
        }
        setTimeout(() => {
            onClose()
            refresh()
        }, 1000)
        setTimeout(() => {
            setClassName(null)
            setCanSubmit(false)
            setLoading(false)
            setMajorSelect('ALL')
        }, 1300)
    }
    
    const handleCancel = () => {
        onClose()
        setTimeout(() => {
            setClassName(null)
            setCanSubmit(false)
            setLoading(false)
            setMajorSelect('ALL')
        }, 300)
    }

    return (
        <Modal
            open={open}
            onClose={handleCancel}
            aria-labelledby="class-title"
            aria-describedby="class-description"
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
                    id="class-title" 
                    className='maincolor'
                    sx={{fontSize: 40, fontWeight: 500, marginBottom: 2}}
                >
                    สร้าง Class
                </Typography>
                <Typography 
                    id="class-description"
                    sx={{fontSize: 20, fontWeight: 500, marginBottom: 1, color: '#686868'}}
                >
                    ชื่อ Class *
                </Typography>
                <TextField
                    autoFocus
                    required
                    id="class-description"
                    size="medium"
                    fullWidth
                    inputProps={{ maxLength: 50 }}
                    sx={{
                        "& fieldset": { border: 'none' },
                        "& .MuiOutlinedInput-root": {
                        padding: "0.1rem",
                        backgroundColor: "#F3F3F3",
                        borderRadius: "10px",
                        fontSize: 20,
                        color: "#686868",
                        fontWeight: 500,
                        marginBottom: 2,
                        },
                    }}
                    onChange={handleClassNameChange}
                />
                <Typography 
                    id="class-description"
                    sx={{fontSize: 20, fontWeight: 500, marginBottom: 1, color: '#686868'}}
                >
                    ภาค
                </Typography>
                <FormControl sx={{marginBottom: 5}}>
                <Select
                    labelId="select-class-label"
                    id="select-class"
                    value={majorSelect}
                    onChange={handleMajorSelectChange}
                    sx={{borderRadius: '10px', color: '#AD68FF', height: "2.8rem", fontWeight: 500, width: isBigScreen ? 300 : '100%', fontSize: 20}}
                >
                    <MenuItem value={'ALL'}>ทั้งหมด</MenuItem>
                    <MenuItem value={'CPE'}>วิศวกรรมคอมพิวเตอร์ (CPE)</MenuItem>
                    <MenuItem value={'SKE'}>วิศวกรรมซอฟต์แวร์ (SKE)</MenuItem>
                </Select>
                </FormControl>
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

export default ClassCreateModal