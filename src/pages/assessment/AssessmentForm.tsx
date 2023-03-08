import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import applicationStore from "../../stores/applicationStore";
import { theme } from "../../styles/theme";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { LoadingButton } from "@mui/lab";
import { createAssessment, createSendAssessment, getProjectHasAssessmentInClass as getProjectHasAssessmentInClass, updateAssessment } from "../../utils/assessment";
import NotFound from "../other/NotFound";

interface PreviewProps {
  newForm: boolean;
}

const AssessmentForm = () => {
  const { isAdmin, currentRole, user } = applicationStore;

  const location = useLocation();

  const [id, setId] = useState(null);
  const [name, setName] = useState<string>("");
  const [projectNameTH, setProjectNameTH] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [feedBack, setFeedBack] = useState<boolean>(true);
  const [feedBackInput, setFeedBackInput] = useState<string>('');
  const [score, setScore] = useState<number>(5);
  const [autoCalculate, setAutoCalculate] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<number>(2);
  const [form, setForm] = useState<Array<any>>([
    { question: "", description: "", weight: 1, limitScore: 5, type: 1, arrayChoice: [] },
  ]);
  const [formInput, setFormInput] = useState<Array<any>>([])
  const [scrollToBottom, setScrollToBottom] = useState<number>(0);
  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const navigate = useNavigate();

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];
  const assessmentId = pathname[4];
  const projectId = pathname[6];

  const getData = async () => {
    const assessmentData = await getProjectHasAssessmentInClass(classId, assessmentId, projectId);
    if (assessmentData.data) {
      const { assessmentResults, assessment, project } = assessmentData.data
      const { name, description, feedBack, form, score } = assessment;
      setName(name)
      setProjectNameTH(project.nameTH)
      setDescription(description)
      setFeedBack(feedBack)

      const newForm: Array<any> = [];
        const formInput: Array<any> = [];
        form.forEach((data: any) => {
          newForm.push({ 
            ...data, 
            arrayChoice: data.type === 1 && data.limitScore <= 5 ? Array(data.limitScore).fill(0) : null})
          formInput.push('')
        })
      setForm(newForm)

      const assessmentResultByUser = assessmentResults.find((data: any) => user?.email === data.userId.email)
      if (assessmentResultByUser) {
        setFormInput(assessmentResultByUser.form)
        setFeedBackInput(assessmentResultByUser.feedBack)
      } else {
        setFormInput(formInput)
      }
      setScore(score)
      setNotFound(1)
    } else {
      setNotFound(0)
    }
  }

  useEffect(() => {
    if (currentRole == 0) navigate("/");
    getData()
  }, []);

  useEffect(() => {
    if (scrollToBottom) window.scrollTo(0, document.body.scrollHeight);
  }, [scrollToBottom]);


  const handleOnSubmit = async () => {
    const rawScore = formInput.map((score, index) => score * form[index].weight).reduce((a, b) => a + b);
    const sumScore = (rawScore * score / form.map((data) => data.limitScore * data.weight).reduce((a, b) => a + b)).toFixed(2);

    setLoading(true);

    const body = { rawScore, sumScore, form: formInput, feedBack: feedBackInput !== '' ? feedBackInput : null };
    const res = await createSendAssessment(body, projectId, assessmentId);

    if (res.statusCode === 201) {
      setTimeout(() => {
        setLoading(false);
        navigate(`/class/${classId}/assessment/overview/${assessmentId}`);
      } , 1300);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1300);
    }
  };

  const handleInputScore = (indexQuestion: number, score: string, limitScore: number) => {
    if (!isNaN(parseInt(score)) && score[0] !== '0') {
      const intScore = parseInt(score as string)
        if (intScore <= limitScore) {
        const newForm = [...formInput ];
        newForm[indexQuestion] = intScore;
        setFormInput(newForm);
      }
    } else if (score === '') {
      const newForm = [...formInput ];
      newForm[indexQuestion] = '';
      setFormInput(newForm);
    }
  }

  if (notFound === 1) {
    return (
      <AdminCommonPreviewContainer>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Typography
            sx={{
              fontSize: 45,
              fontWeight: 600,
              marginBottom: 1,
              color: theme.color.text.primary,
            }}
          >
            {name}
          </Typography>

          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              marginBottom: 1,
              color: theme.color.text.secondary,
            }}
          >
            โปรเจกต์: {projectNameTH}
          </Typography>

          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.color.text.secondary,
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
            inputProps={{ maxLength: 1500, style: { padding: "0.25rem" } }}
            sx={{
              "& fieldset": {
                border: "none",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.color.button.default,
                borderRadius: "10px",
                fontSize: 20,
                color: theme.color.text.secondary,
                fontWeight: 500,
                marginBottom: 2,
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: theme.color.text.secondary,
              },
            }}
            disabled
          />

          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.color.text.secondary,
            }}
          >
            คะแนนรวม
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              required
              value={score}
              disabled={autoCalculate}
              id={"question-score-1"}
              size="medium"
              // value={e.limitScore}
              inputProps={{ type: "number", min: 1 }}
              sx={{
                "& fieldset": {
                  border: "none",
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
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: theme.color.text.secondary,
                },
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.color.text.secondary,
            }}
          >
            คำถามการประเมิน
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
            }}
          >
            {form.map((data, indexForm) => (
              <Box
                key={indexForm}
                sx={{
                  position: "relative",
                  backgroundColor: theme.color.background.default,
                  margin: "1rem",
                  padding: "2rem",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: isBigScreen ? "row" : "column",
                  border: "2px solid",
                  borderColor: theme.color.background.tertiary,
                }}
              >

                <Box
                  sx={{
                    width: isBigScreen ? "70%" : "100%",
                    marginRight: isBigScreen ? "2rem" : 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 25,
                      fontWeight: 500,
                      color: theme.color.text.secondary,
                    }}
                  >
                    {`คำถามที่ ${indexForm + 1} *`}
                  </Typography>
                  <TextField
                    required
                    id={"question-title-1"}
                    size="medium"
                    value={data.question as string}
                    fullWidth
                    inputProps={{ maxLength: 100 }}
                    sx={{
                      "& fieldset": {
                        border: "none",
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
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: theme.color.text.secondary,
                      },
                    }}
                    disabled
                  />
                  <Typography
                    sx={{
                      fontSize: 25,
                      fontWeight: 500,
                      color: theme.color.text.secondary,
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
                    value={data.description as string}
                    inputProps={{
                      maxLength: 1000,
                      style: { padding: "0.25rem" },
                    }}
                    sx={{
                      "& fieldset": {
                        border: "none",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.color.button.default,
                        borderRadius: "10px",
                        fontSize: 20,
                        color: theme.color.text.secondary,
                        fontWeight: 500,
                        marginBottom: 2,
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: theme.color.text.secondary,
                      },
                    }}
                    disabled
                  />
                  <Typography
                    sx={{
                      fontSize: 25,
                      fontWeight: 500,
                      color: theme.color.text.secondary,
                    }}
                  >
                    ลงคะแนน
                  </Typography>

                  {
                    data.type === 1 && data.limitScore <= 5 ?
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      sx={{marginTop: "1rem"}}
                    >
                      {
                        data.arrayChoice.map((_: any, index: number) => (
                          <FormControlLabel 
                            key={data.arrayChoice.length - index} 
                            value={data.arrayChoice.length - index} 
                            checked={formInput[indexForm] === data.arrayChoice.length - index}
                            control={<Radio
                              sx={{
                                  padding: 0,
                                  boxShadow: "none",
                                  color: theme.color.background.secondary,
                                  "&.Mui-checked": {
                                      color: theme.color.background.secondary,
                                  },
                                  "& .MuiSvgIcon-root": { fontSize: 28 },
                                  marginRight: "0.5rem"
                              }}
                              value={data.arrayChoice.length - index}
                              onClick={() => handleInputScore(indexForm, (data.arrayChoice.length - index).toString(), data.limitScore)}
                            />} 
                            label={
                              <Typography
                                sx={{
                                  fontSize: 20,
                                  fontWeight: 500,
                                  color: theme.color.text.secondary,
                                }}
                              >
                                {data.arrayChoice.length - index}
                              </Typography>
                            } 
                            sx ={{ 
                              marginLeft: "1.5rem", 
                              color: theme.color.text.secondary,
                              fontSize: 20,
                              fontWeight: 500,
                            }}
                          />
                        ))
                      }
                    </RadioGroup>
                    : 
                    <TextField
                      required
                      id={`score-${indexForm}`}
                      size="medium"
                      value={formInput[indexForm]}
                      sx={{
                        "& fieldset": {
                          border: "none",
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
                    onChange={(event) => handleInputScore(indexForm, event.target.value, data.limitScore)}
                    />
                  }
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 25,
                      fontWeight: 500,
                      color: theme.color.text.secondary,
                    }}
                  >
                    ระดับคะแนน
                  </Typography>
                  <TextField
                    required
                    id={"question-score-1"}
                    size="medium"
                    value={data.limitScore}
                    inputProps={{ type: "number", min: 1 }}
                    sx={{
                      "& fieldset": {
                        border: "none",
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
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: theme.color.text.secondary,
                      },
                    }}
                    disabled
                  />
                  <Typography
                    sx={{
                      fontSize: 25,
                      fontWeight: 500,
                      color: theme.color.text.secondary,
                    }}
                  >
                    ค่าถ่วงน้ำหนัก
                  </Typography>
                  <TextField
                    required
                    id={"question-weight-1"}
                    size="medium"
                    value={data.weight}
                    inputProps={{ type: "number", min: 1 }}
                    sx={{
                      "& fieldset": {
                        border: "none",
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
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: theme.color.text.secondary,
                      },
                    }}
                    disabled
                  />
                </Box>
              </Box>
            ))}
          </Box>

          {
            feedBack ? 
            <>
              <Typography
                sx={{
                  fontSize: 30,
                  fontWeight: 600,
                  color: theme.color.text.secondary,
                  marginRight: 2,
                }}
              >
                ข้อเสนอแนะ
              </Typography>
              <TextField
                multiline
                id="assessment-feedback"
                size="medium"
                value={feedBackInput}
                maxRows={12}
                minRows={4}
                inputProps={{ maxLength: 1500, style: { padding: "0.25rem" } }}
                sx={{
                  "& fieldset": {
                    border: "none",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.color.button.default,
                    borderRadius: "10px",
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    fontWeight: 500,
                    marginBottom: 2,
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: theme.color.text.secondary,
                  },
                }}
                onChange={(e) => setFeedBackInput(e.target.value)}
              />
            </> : <></>
          }

          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <LoadingButton
              loading={loading}
              sx={{
                width: "7rem",
                height: "2.8rem",
                marginTop: "0.5rem",
                fontSize: 20,
                background: theme.color.button.primary,
                borderRadius: "10px",
                color: theme.color.text.default,
                boxShadow: "none",
                textTransform: "none",
                "&:hover": { background: "#B07CFF" },
                "&:disabled": {
                  backgroundColor: theme.color.button.disable,
                },
              }}
              onClick={handleOnSubmit}
              disabled={formInput.filter((data: any) => data === '').length ? true : false}
            >
              ยืนยัน
            </LoadingButton>
          </Box>
        </Box>
      </AdminCommonPreviewContainer>
    );
  } else if (notFound === 2) {
    return (
      <AdminCommonPreviewContainer/>
    );
  } else {
    return <NotFound></NotFound>;
  }
};

export default AssessmentForm;
