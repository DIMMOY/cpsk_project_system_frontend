import React, { useEffect, useState } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useMediaQuery } from "react-responsive";
import { observer } from "mobx-react";
import moment from "moment";
import {
  cancelSendMeetingSchedule,
  changeStatusMeetingSchedule,
  getSendMeetingScheduleInClass,
  sendMeetingSchedule,
} from "../../utils/meetingSchedule";
import { LoadingButton } from "@mui/lab";
import CancelModal from "../../components/Modal/CancelModal";
import { CommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { theme } from "../../styles/theme";
import applicationStore from "../../stores/applicationStore";
import { checkRoleInProject } from "../../utils/project";
import NotFound from "../other/NotFound";

interface PreviewProps {
  isStudent: boolean;
}

const MeetingScheduleDetail = observer(({ isStudent }: PreviewProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, classroom, project } = applicationStore;
  const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" });
  const { success, warning, error, secondary } = theme.color.text;
  const statusList = [
    { color: error, message: "ยังไม่ส่ง" },
    { color: success, message: "ส่งแล้ว" },
    { color: warning, message: "ส่งช้า" },
    { color: warning, message: "รอยืนยัน" },
    { color: secondary, message: "----" },
  ];
  const [name, setName] = useState<string>("กำลังโหลด...");
  const [dueDate, setDueDate] = useState<string>("--/--/---- --:--");
  const [status, setStatus] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [isAdvisor, setIsAdvisor] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<number>(2);
  const [detail, setDetail] = useState<string>("");

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = isStudent ? classroom._id : pathname[2];
  const projectId = isStudent ? project._id : pathname[4];
  const meetingScheduleId = isStudent ? pathname[2] : pathname[6];

  const getData = async (detail: string) => {
    const result = await getSendMeetingScheduleInClass(
      classId,
      projectId,
      meetingScheduleId
    );
    if (!result.data) {
      setNotFound(0);
    } else {
      setName(result.data.meetingSchedule.name);
      setDueDate(moment(result.data.endDate).format("DD/MM/YYYY HH:mm"));
      setStatus(result.data.sendStatus);
      setDetail(result.data.detail ? result.data.detail : detail);
      setSubmit(result.data.detail || detail !== "");
      setNotFound(1);
    }
  };

  const getRoleInProject = async () => {
    const checkRole = await checkRoleInProject(classId, projectId);
      if (checkRole.data) {
        const { data } = checkRole;
        // check role is advisor in this project or not
        if (data.filter((e: any) => e.role === 2).length) {
          setIsAdvisor(true);
        } else {
          setNotFound(0)
          return
        }
      }
  }

  useEffect(() => {
    if (isStudent && currentRole !== 0)
      navigate('/')

    if (currentRole === 1) {
      getRoleInProject();
    }
    window.history.replaceState({}, document.title);
    if (location.state) {
      setName(location.state.name);
      setDueDate(location.state.dueDate);
      setStatus(location.state.status);
      setDetail(location.state.detail);
      setSubmit(location.state.detail);
      setNotFound(1);
    } else {
      getData("");
    }
  }, []);

  const handleOnDescriptionChange = (description: string) => {
    if (description.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "") == "")
      setSubmit(false);
    else setSubmit(true);
    setDetail(description);
  };

  const handleOnSendMeetingSchedule = async () => {
    setLoading(true);
    const result = await sendMeetingSchedule(
      { detail },
      projectId,
      meetingScheduleId
    );
    if (result.statusCode === 200) {
      setTimeout(async () => {
        await getData("");
        setLoading(false);
      }, 1300);
    } else setLoading(false);
  };

  const handleOnSubmitMeetingSchedule = async () => {
    setLoading(true);
    const result = await changeStatusMeetingSchedule(
      true,
      projectId,
      meetingScheduleId
    );
    if (result.statusCode === 200) {
      setTimeout(async () => {
        await getData("");
        setLoading(false);
      }, 1300);
    } else setLoading(false);
  };

  const handleOnCancelSubmitMeetingSchedule = async () => {
    const result = await changeStatusMeetingSchedule(
      false,
      projectId,
      meetingScheduleId
    );
    if (result.statusCode === 200) {
      await getData("");
    }
  };

  const handleOnOpenModal = () => setOpen(true);
  const handleOnCloseModal = () => setOpen(false);

  const handleOnCancelSendMeetingSchedule = async () => {
    const result = await cancelSendMeetingSchedule(
      projectId,
      meetingScheduleId
    );
    if (result.statusCode === 200) {
      await getData(detail);
    }
  };

  if (notFound === 1) {
    return (
      <CommonPreviewContainer sx={{ textAlign: "center" }}>
        <Box sx={{ display: "flex", padding: "0 auto" }}>
          <Link
            to={
              isStudent
                ? "/meeting-schedule"
                : currentPathName.slice(0, currentPathName.lastIndexOf("/"))
            }
          >
            <IconButton
              disableRipple
              sx={{
                marginRight: "1.25rem",
                "& svg": {
                  color: theme.color.background.primary,
                },
              }}
              disableFocusRipple
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
          </Link>
        </Box>
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            className="ml-96 common-preview-button"
            sx={{
              position: "relative",
              borderRadius: "20px",
              background: theme.color.button.default,
              margin: "1.25rem 0 0 0",
              display: "flex",
              textTransform: "none",
              zIndex: "1",
            }}
          >
            <Typography
              sx={{
                top: "1.5rem",
                left: "calc(20px + 1vw)",
                position: "absolute",
                fontSize: "calc(30px + 0.2vw)",
                fontFamily: "Prompt",
                fontWeight: 600,
                color: theme.color.text.primary,
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                top: isBigScreen ? "1.5rem" : "1.95rem",
                right: "calc(20px + 1vw)",
                position: "absolute",
                fontSize: isBigScreen
                  ? "calc(30px + 0.2vw)"
                  : "calc(15px + 2vw)",
                color: statusList[status].color,
                fontWeight: 600,
              }}
            >
              {statusList[status].message}
            </Typography>
            <Typography
              sx={{
                top: "5rem",
                left: "calc(20px + 1vw)",
                position: "absolute",
                fontSize: "calc(15px + 0.3vw)",
                color: theme.color.text.secondary,
                fontWeight: 600,
              }}
            >
              ภายในวันที่ {dueDate}
            </Typography>
          </Box>

          <Box
            sx={{
              top: "-5rem",
              position: "relative",
              height: "23rem",
              background: theme.color.background.tertiary,
              borderRadius: "20px",
            }}
          >
            <TextField
              id="outlined-multiline-flexible"
              disabled={status || !isStudent ? true : false}
              placeholder={isStudent ? `กรุณาใส่ข้อความ` : ""}
              value={detail}
              multiline
              maxRows={4}
              minRows={4}
              inputProps={{ style: { padding: "0.25rem" } }}
              size="medium"
              sx={{
                top: "7rem",
                width: "88vw",
                left: "0",
                right: "0",
                marginLeft: "auto",
                marginRight: "auto",
                position: "absolute",
                "& fieldset": { border: "none" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: theme.color.background.default,
                  borderRadius: "20px",
                  fontSize: 20,
                  color: theme.color.text.secondary,
                  fontWeight: 500,
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: theme.color.text.secondary,
                },
              }}
              onChange={(e) => handleOnDescriptionChange(e.target.value)}
            />

            {isStudent && currentRole === 0 && (
              <>
                <CancelModal
                  open={open}
                  onClose={handleOnCloseModal}
                  onSubmit={handleOnCancelSendMeetingSchedule}
                  title={`ยกเลิกการส่ง ${name}`}
                  description="เมื่อยกเลิกแล้วจะต้องให้ที่ปรึกษายืนยันใหม่อีกครั้ง"
                />

                {status != 4 ? (
                  <LoadingButton
                    loading={loading}
                    sx={{
                      top: "18rem",
                      width: "7rem",
                      height: "2.8rem",
                      fontSize: 20,
                      textAlign: "center",
                      justifyContent: "center",
                      background: status
                        ? theme.color.button.error
                        : theme.color.button.primary,
                      borderRadius: "10px",
                      color: theme.color.text.default,
                      boxShadow: "none",
                      textTransform: "none",
                      "&:hover": { background: status ? "#FF545E" : "#B07CFF" },
                      "&:disabled": {
                        backgroundColor: theme.color.button.disable,
                      },
                    }}
                    onClick={
                      status ? handleOnOpenModal : handleOnSendMeetingSchedule
                    }
                    disabled={!submit}
                  >
                    {status ? "ยกเลิก" : "ยืนยัน"}
                  </LoadingButton>
                ) : (
                  <></>
                )}
              </>
            )}
            {!isStudent && isAdvisor && (status === 3 || status === 2 || status === 1) && currentRole === 1 ? (
              <>
                <CancelModal
                  open={open}
                  onClose={handleOnCloseModal}
                  onSubmit={handleOnCancelSubmitMeetingSchedule}
                  title={`ยกเลิกการยืนยัน ${name}`}
                  description="เมื่อยกเลิกแล้วจะกลับสู่สถานะรอยืนยัน"
                />

                <LoadingButton
                  loading={loading}
                  sx={{
                    top: "18rem",
                    width: "7rem",
                    height: "2.8rem",
                    fontSize: 20,
                    textAlign: "center",
                    justifyContent: "center",
                    background:
                      status === 3
                        ? theme.color.button.success
                        : theme.color.button.error,
                    borderRadius: "10px",
                    color: theme.color.text.default,
                    boxShadow: "none",
                    textTransform: "none",
                    "&:hover": {
                      background:
                        status === 3 ? theme.color.button.success : "#FF545E",
                    },
                    "&:disabled": {
                      backgroundColor: theme.color.button.disable,
                    },
                  }}
                  onClick={
                    status === 3
                      ? handleOnSubmitMeetingSchedule
                      : handleOnOpenModal
                  }
                  disabled={!submit}
                >
                  {status === 3 ? "ยืนยัน" : "ยกเลิก"}
                </LoadingButton>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </CommonPreviewContainer>
    );
  } else if (notFound === 2) {
    return <CommonPreviewContainer />;
  } else {
    return <NotFound />;
  }
});

export default MeetingScheduleDetail;
