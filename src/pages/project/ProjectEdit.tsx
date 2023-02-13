import React, { useEffect, useState } from 'react'
import { Box, Button, Checkbox, IconButton, TextField, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminCommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import { theme } from '../../styles/theme';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { LoadingButton } from '@mui/lab';
import { createAssessment, updateAssessment } from '../../utils/assessment';

interface PreviewProps {
  newProject: boolean
}

const ProjectEdit = ({ newProject }: PreviewProps) => {
  const { isAdmin, currentRole } = applicationStore

  const location = useLocation()

  const [id, setId] = useState(null)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [titleSubmit, setTitleSubmit] = useState<boolean>(false)
  const [formSubmit, setFormSubmit] = useState<Array<boolean>>([false])
  const [feedBack, setFeedBack] = useState<boolean>(true)
  const [assessBy, setAssessBy] = useState<number>(0)
  const [score, setScore] = useState<number>(5)
  const [autoScore, setAutoScore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [form, setForm] = useState<Array<any>>([{ question: '', description: '', weight: 1, limitScore: 5, type: 1 }])
  const [scrollToBottom, setScrollToBottom] = useState<number>(0);
  const isBigScreen = useMediaQuery({ query: '(min-width: 650px)' })
  const navigate = useNavigate();

  useEffect(() => {
    if (currentRole == 0) navigate('/')
    applicationStore.setClassroom(null)
    if (!newProject) {
      if (!location.state) {
        navigate('/assessment')
      }

      else {
        const { _id, name, description, form, score, assessBy, feedBack } = location.state.assessment
        setId(_id)
        setName(name)
        setDescription(description)
        setForm(form)
        setScore(score)
        setAssessBy(assessBy)
        setFeedBack(feedBack)
        setTitleSubmit(true)
        const newFormSubmit = [] as Array<boolean>
        form.forEach(() => {
          newFormSubmit.push(true)
        })
        setFormSubmit(newFormSubmit)
      }
    }
    }, [] 
  )

  useEffect(() => {
    if (scrollToBottom) 
      window.scrollTo(0, document.body.scrollHeight);
  }, [scrollToBottom])

  const handleOnAddQuestion = () => {
    if (form.length < 50) {
      setForm([...form, { question: '', description: '', weight: 1, limitScore: 5, type: 1 }])
      setFormSubmit([...formSubmit, false])
      setScrollToBottom((scrollToBottom) => scrollToBottom + 1)
      if (autoScore) {
        setScore(score + 5)
      }
    }
  }
  const handleOnRemoveQuestion = (index: number) => {
    if (autoScore) {
      setScore(score - (form[index].limitScore * form[index].weight))
    }
    setForm(form.filter((_, i) => i !== index));
    setFormSubmit(formSubmit.filter((_, i) => i !== index))
  };

  const handleOnSubmit = async () => {
    setLoading(true)
    const reqBody = { name, description, form, feedBack, assessBy, score }
    if (newProject) {
      console.log('Creating...')
      const res = await createAssessment(reqBody)
      if (res.statusCode !== 201) {
        console.error(res.errorMsg)
        setLoading(false)
        return
      }
    } else {
      if (id) {
        console.log('Updating...')
        const res = await updateAssessment(id as string, reqBody)
        if (res.statusCode !== 201) {
          console.error(res.errorMsg)
          setLoading(false)
          return
        }  
      } else {
        console.error('assessment id not found')
        setLoading(false)
        return
      }
    }
    setTimeout(() => {
      setLoading(true)
      navigate('/assessment')
    }, 1300)
  }

  const handleOnFormChange = (type: string, index: number) => (event: any) => {
    const newForm = [...form]
    if (type === 'question') {
      const newFormSubmit = formSubmit
      newFormSubmit[index] = !(event.target.value.replace(/(\r\n|\n|\r)/gm, '').replace(/\s/g,'') == '')
      setFormSubmit(newFormSubmit)
    }

    if((type === 'weight' || type === 'limitScore')) {
      let newValue = event.target.value.replace(/[^0-9]/g, '');
      const oldWeight = form[index].weight
      const oldLimitScore = form[index].limitScore

      newValue = Math.max(newValue, 1);
      if (type === 'limitScore' && newValue > 5) newForm[index].type = 2
      newForm[index][type] = newValue

      if (autoScore) {
        const sum = (newForm[index].limitScore * newForm[index].weight) - (oldLimitScore * oldWeight)
        setScore(score + sum)
      }
    } else {
      newForm[index][type] = event.target.value
    }
    setForm(newForm)
  }

  const handleOnTitleChange = (value: string) => {
    if ((value.replace(/(\r\n|\n|\r)/gm, '').replace(/\s/g,'') == '')) setTitleSubmit(false)
    else setTitleSubmit(true)
    setName(value)
  }

  const handleOnClickAutoScore = (value: boolean) => {
    if (value) {
      let sum = 0
      form.forEach((e) => {
        sum += e.limitScore * e.weight
      })
      setScore(sum)
    }
    setAutoScore(value)
  }

  const handleOnScoreChange = (value: string) => {
    const newValue = parseInt(value.replace(/[^0-9]/g, ''))
    setScore(Math.max(isNaN(newValue) ? 1 : newValue , 1))
  }

  return (
    <AdminCommonPreviewContainer>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}> 
        <Typography
            sx={{ 
              fontSize: 45, 
              fontWeight: 600,
              marginBottom: 1, 
              color: theme.color.text.primary 
            }}
          >
          {'แบบฟอร์มประเมิน ( * คือต้องใส่ )'}
        </Typography>

        <Typography
          sx={{ 
            fontSize: 30, 
            fontWeight: 600, 
            color: theme.color.text.secondary 
          }}
        >
          ประเมินโดย
        </Typography>

        <Select
          labelId="select-assess-by-label"
          id="select-assess-by"
          value={assessBy}
          onChange={(e) => setAssessBy(e.target.value as number)}
          sx={{
            borderRadius: '10px', 
            color: theme.color.background.primary, 
            height: 45, 
            fontWeight: 500, 
            width: 180,
            marginBottom: 2, 
          }}
        >
          <MenuItem value={0}>ทั้งหมด</MenuItem>
          <MenuItem value={1}>อาจารย์ที่ปรึกษา</MenuItem>
          <MenuItem value={2}>กรรมมการคุมสอบ</MenuItem>
        </Select>

        <Typography
            sx={{ 
              fontSize: 30, 
              fontWeight: 600, 
              color: theme.color.text.secondary 
            }}
          >
          หัวข้อฟอร์ม *
        </Typography>

        <TextField
          required
          autoFocus
          id="assessment-title"
          size="medium"
          value={name}
          inputProps={{ maxLength: 150 }}
          sx={{
            "& fieldset": { 
              border: 'none',
            },
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
          onChange={(e) => handleOnTitleChange(e.target.value)}
        />

        <Typography
            sx={{ 
              fontSize: 30, 
              fontWeight: 600, 
              color: theme.color.text.secondary 
            }}
          >
          คำอธิบาย
        </Typography>

        <TextField
          multiline
          id="assessment-description"
          size="medium"
          value={description}
          maxRows={12}
          minRows={4}
          inputProps={{ maxLength: 1500, style: {padding: "0.25rem",} }}
          sx={{
            "& fieldset": { 
              border: 'none', 
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Typography
          sx={{ 
            fontSize: 30, 
            fontWeight: 600, 
            color: theme.color.text.secondary 
          }}
        >
          คะแนนรวม
        </Typography>
        <Box sx={{display: "flex", flexDirection: "column"}}>
          <Box sx={{display: "flex", flexDirection: "row", marginBottom: 1}}>
            <Checkbox
              checked={autoScore}
              sx={{
                padding: 0,
                boxShadow: "none",
                color: theme.color.background.secondary,
                '&.Mui-checked': {
                  color: theme.color.background.secondary,
                },
                marginRight: 1,
                '& .MuiSvgIcon-root': { fontSize: 25 }
              }}
              onChange={(e) => handleOnClickAutoScore(e.target.checked)}
            />
            <Typography
              sx={{ 
                fontSize: 20, 
                fontWeight: 500, 
                color: theme.color.text.secondary 
              }}
            >
              คิดคะแนนอัติโนมัติ
            </Typography>
          </Box>
          <TextField
            required
            value={score}
            disabled={autoScore}
            id={"question-score-1"}
            size="medium"
            // value={e.limitScore}
            inputProps={{ type: "number", min: 1 }}
            sx={{
              "& fieldset": { 
                border: 'none',
              },
              "& .MuiOutlinedInput-root": {
                padding: "0.25rem",
                backgroundColor: theme.color.button.default,
                borderRadius: "10px",
                fontSize: 20,
                color: theme.color.text.secondary,
                fontWeight: 500,
                marginBottom: 2,
                marginRight: 2,
                width: "8rem",
              },
            }}
            onChange={e => handleOnScoreChange(e.target.value)}
            onWheel={(e) => e.preventDefault()}
          />
        </Box>

        <Typography
            sx={{ 
              fontSize: 30, 
              fontWeight: 600, 
              color: theme.color.text.secondary 
            }}
          >
          {'คำถามการประเมิน (ระดับคะแนนมากกว่า 5 จะเป็นการเติมตัวเลขอย่างเดียว)'}
        </Typography>

        <Box
          sx={{
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
            borderRadius: "10px",
            backgroundColor: theme.color.button.default,
            flexDirection: "column",
            marginBottom: 3,
          }}>
            {form.map((e, index) => (
              <Box 
                key={index}
                sx={{
                  position: "relative",
                  backgroundColor: theme.color.background.default,
                  margin: "1rem",
                  padding: "2rem",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: isBigScreen ? "row" : "column",
                  border: "2px solid",
                  borderColor: theme.color.background.tertiary
                }}
              >
                { form.length > 1 &&
                  <IconButton 
                    sx={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                    }}
                    onClick={() => handleOnRemoveQuestion(index)}
                  >
                    <RemoveCircleIcon sx={{fontSize: "125%", color: theme.color.button.error}}/>
                  </IconButton>
                }

                <Box sx={{width: isBigScreen ? "70%" : "100%", marginRight: isBigScreen ? "2rem" : 0 }}>
                  <Typography
                    sx={{ 
                      fontSize: 25, 
                      fontWeight: 500, 
                      color: theme.color.text.secondary 
                    }}
                  >
                    {`คำถามที่ ${index + 1} *`}
                  </Typography>
                  <TextField
                    required
                    id={"question-title-1"}
                    size="medium"
                    value={e.question as string}
                    fullWidth
                    inputProps={{ maxLength: 100 }}
                    sx={{
                      "& fieldset": { 
                        border: 'none',
                      },
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
                    onChange={handleOnFormChange('question', index)}
                  />
                  <Typography
                    sx={{ 
                      fontSize: 25, 
                      fontWeight: 500, 
                      color: theme.color.text.secondary 
                    }}
                  >
                    คำอธิบายเสริม
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    id={"question-description-1"}
                    size="medium"
                    maxRows={3}
                    minRows={1}
                    value={e.description as string}
                    inputProps={{ maxLength: 1000, style: {padding: "0.25rem",} }}
                    sx={{
                      "& fieldset": { 
                        border: 'none', 
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.color.button.default,
                        borderRadius: "10px",
                        fontSize: 20,
                        color: theme.color.text.secondary,
                        fontWeight: 500,
                        marginBottom: 2,
                      },
                    }}
                    onChange={handleOnFormChange('description', index)}
                  />
                  <Typography
                    sx={{ 
                      fontSize: 25, 
                      fontWeight: 500, 
                      color: theme.color.text.secondary 
                    }}
                  >
                    รูปแบบการกรอกคะแนน
                  </Typography>
                  <Select
                    labelId={`select-option-${index}`}
                    id={`select-option-${index}`}
                    value={e.type}
                    onChange={handleOnFormChange('type', index)}
                    sx={{
                      borderRadius: '10px', 
                      color: theme.color.background.primary, 
                      height: 45, 
                      fontWeight: 500, 
                      width: 180,
                      marginTop: 0.75
                    }}
                  >
                    <MenuItem value={1} disabled={e.limitScore > 5}>ตัวเลือก</MenuItem>
                    <MenuItem value={2}>เติมเลข</MenuItem>
                  </Select>

                </Box>
                <Box>
                  <Typography
                    sx={{ 
                      fontSize: 25, 
                      fontWeight: 500, 
                      color: theme.color.text.secondary 
                    }}
                  >
                    ระดับคะแนน
                  </Typography>
                  <TextField
                    required
                    id={"question-score-1"}
                    size="medium"
                    value={e.limitScore}
                    inputProps={{ type: "number", min: 1 }}
                    sx={{
                      "& fieldset": { 
                        border: 'none',
                      },
                      "& .MuiOutlinedInput-root": {
                        padding: "0.25rem",
                        backgroundColor: theme.color.button.default,
                        borderRadius: "10px",
                        fontSize: 20,
                        color: theme.color.text.secondary,
                        fontWeight: 500,
                        marginBottom: 2,
                        width: "8rem",
                      },
                    }}
                    onChange={handleOnFormChange('limitScore', index)}
                    onWheel={(e) => e.preventDefault()}
                  />
                  <Typography
                    sx={{ 
                      fontSize: 25, 
                      fontWeight: 500, 
                      color: theme.color.text.secondary 
                    }}
                  >
                    ค่าถ่วงน้ำหนัก
                  </Typography>
                  <TextField
                    required
                    id={"question-weight-1"}
                    size="medium"
                    value={e.weight}
                    inputProps={{ type: "number", min: 1 }}
                    sx={{
                      "& fieldset": { 
                        border: 'none',
                      },
                      "& .MuiOutlinedInput-root": {
                        padding: "0.25rem",
                        backgroundColor: theme.color.button.default,
                        borderRadius: "10px",
                        fontSize: 20,
                        color: theme.color.text.secondary,
                        fontWeight: 500,
                        marginBottom: 2,
                        width: "8rem",
                      },
                    }}
                    onChange={handleOnFormChange('weight', index)}
                    onWheel={(e) => e.preventDefault()}
                  />                 
              </Box>
            </Box>
            ))}

          { form.length < 50 && 
            <Button 
            sx={{ height: '8rem', margin: "1rem",}}
            aria-label="upload" 
            component="label"
            onClick={handleOnAddQuestion}
            >
            <AddCircleIcon
              sx={{
                fontSize: "650%", 
                color: theme.color.background.secondary,
                width: '8rem'
              }}
            />
          </Button> 
          }
        </Box>

        <Box sx={{display: "flex", flexDirection: "row"}}> 
          <Typography
            sx={{ 
              fontSize: 30, 
              fontWeight: 600, 
              color: theme.color.text.secondary,
              marginRight: 2
            }}
          >
            ข้อเสนอแนะ
          </Typography>
          <Checkbox
            checked={feedBack}
            sx={{
              padding: 0,
              boxShadow: "none",
              color: theme.color.background.secondary,
              '&.Mui-checked': {
                color: theme.color.background.secondary,
              },
              '& .MuiSvgIcon-root': { fontSize: 28 }
            }}
            onChange={(e) => setFeedBack(e.target.checked)}
          />
        </Box>

        <Box sx={{display: "flex", justifyContent: "right"}}>
          <LoadingButton
            loading={loading}
            sx={{
              width: "7rem",
              height: "2.8rem",
              fontSize: 20,
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
            onClick={handleOnSubmit}
            disabled={!(titleSubmit && (formSubmit.filter((e) => e === false).length === 0))}
          >
            ยืนยัน
          </LoadingButton> 
        </Box>
      </Box>
    </AdminCommonPreviewContainer>
  )
}

export default ProjectEdit
