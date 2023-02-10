import React, { ChangeEvent, useState } from 'react'
import { Box, Button, Grow, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import Modal from '@mui/material/Modal';
import { useMediaQuery } from 'react-responsive';
import { createDocument } from '../../utils/document';
import { theme } from '../../styles/theme';

interface ModalProps {
    children: React.ReactNode; 
    open: boolean
    onClose: () => void
    refresh: () => void
}

const DocumentCreateModal = ({ open, onClose, refresh }: ModalProps) => {
  const [documentName, setDocumentName] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState<boolean>(false) 
  const [loading, setLoading] = useState<boolean>(false)
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })

    const handleDocumentNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDocumentName(event.target.value as string)
        setCanSubmit(event.target.value ? true : false)
    }

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(event.target.value as string)
    }


    const handleCreateDocument = async () => {
        setLoading(true)
        console.log('Creating...')
        const reqBody = { name: documentName, description }
        const res = await createDocument(reqBody);
        if (res.statusCode !== 201) {
            console.error(res.errorMsg)
            return
        }
        setTimeout(() => {
            onClose()
            refresh()
        }, 1000)
        setTimeout(() => {
            setDocumentName(null)
            setCanSubmit(false)
            setLoading(false)
        }, 1300)
    }
    
    const handleCancel = () => {
        onClose()
        setTimeout(() => {
            setDocumentName(null)
            setCanSubmit(false)
            setLoading(false)
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
                height: 500,
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
                    id="document-title" 
                    sx={{fontSize: 40, fontWeight: 500, marginBottom: 2, color: theme.color.text.primary}}
                >
                    สร้างรายการส่งเอกสาร
                </Typography>
                <Typography 
                    id="document-description"
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
                    id="document-description"
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
                    onChange={handleDocumentNameChange}
                />
                <Typography 
                    id="document-description"
                    sx={{
                        fontSize: 20, 
                        fontWeight: 500, 
                        marginBottom: 1, 
                        color: theme.color.text.secondary
                    }}
                >
                    คำอธิบาย
                </Typography>
                <TextField
                    autoFocus
                    id="document-description"
                    fullWidth
                    multiline
                    maxRows={4}
                    minRows={4}
                    size="medium"
                    inputProps={{ style: {padding: "0.25rem"}}}
                    sx={{
                        "& fieldset": { border: 'none' },
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: theme.color.button.default,
                            borderRadius: "10px",
                            fontSize: 20,
                            color: theme.color.text.secondary,
                            fontWeight: 500,
                            marginBottom: 2,
                        },
                    }}
                    onChange={handleDescriptionChange}
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
                        '&:hover': { background: theme.color.button.disable }
                    }}
                >
                    ยกเลิก
                </Button>
                <LoadingButton
                    onClick={handleCreateDocument}
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
                        backgroundColor: theme.color.button.disable,
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

export default DocumentCreateModal