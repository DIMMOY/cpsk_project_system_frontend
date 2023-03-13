import { Container, Box, IconButton, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { fontFamily, fontWeight, Stack } from "@mui/system";
import React, { Component, useEffect, useState } from "react";
import { KeyObjectType } from "crypto";
import { padding } from "@mui/system/spacing";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ListPreviewButton } from "../../styles/layout/_button";
import { listSendMeetingScheduleInClass } from "../../utils/meetingSchedule";
import moment from "moment";
import { CommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import applicationStore from "../../stores/applicationStore";
import NotFound from "../other/NotFound";
import { checkRoleInProject } from "../../utils/project";
import {
  getAssessmentInClass,
  listAllProjectHasAssessmentInProject,
  listAssessmentInClass,
} from "../../utils/assessment";
import ShowScoreDialog from "../../components/Dialog/ShowScoreDialog";

const useStyles = makeStyles({
  iconSize: {
    "& svg": {
      color: "#AD68FF",
    },
  },
});

interface PreviewProps {
  isStudent: boolean;
}

const AssessmentDetail = observer(({ isStudent }: PreviewProps) => {
  const [assessment, setAssessment] = useState<any>({});
  const [projectHasAssessments, setProjectHasAssessments] = useState<
    Array<any>
  >([]);
  const [notFound, setNotFound] = useState<number>(2);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<Array<number>>([]);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [currentAssessBy, setCurrentAssessBy] = useState<string>("");
  const [currentFeedBack, setCurrentFeedBack] = useState<string>("");

  const { currentRole, classroom, project } = applicationStore;
  const classes = useStyles();
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" });
  const { success, warning, error, secondary } = theme.color.text;

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = isStudent ? classroom._id : pathname[2];
  const projectId = isStudent ? project._id : pathname[4];
  const assessmentId = isStudent ? pathname[2] : pathname[6];

  const getData = async () => {
    if (isStudent && currentRole !== 0) {
      navigate("/");
    }
    const assessmentData = await getAssessmentInClass(classId, assessmentId);
    if (!assessmentData.data) {
      setNotFound(0);
      return;
    } else {
      setAssessment(assessmentData.data as any);
      setNotFound(1);
    }

    const projectHasAssessments = await listAllProjectHasAssessmentInProject(
      projectId,
      assessmentId
    );
    if (!projectHasAssessments.data) {
      setNotFound(0);
      return;
    } else {
      setProjectHasAssessments(projectHasAssessments.data as Array<any>);
      setNotFound(1);
    }
  };

  const handleOpenDialog = (
    form: Array<number>,
    title: string,
    assessBy: string,
    feedBack: string
  ) => {
    setCurrentScore(form);
    setCurrentTitle(title);
    setCurrentAssessBy(assessBy);
    setCurrentFeedBack(feedBack);
    setOpenDialog(true);
  };

  useEffect(() => {
    getData();
  }, []);

  if (notFound === 1) {
    return (
      <CommonPreviewContainer>
        <ShowScoreDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          assessment={assessment.assessment ? assessment.assessment : {}}
          score={currentScore}
          title={currentTitle}
          assessBy={currentAssessBy}
          feedBack={currentFeedBack}
        />

        <Box sx={{ display: "flex", padding: "0 auto", alignItems: "center" }}>
          <Link
            to={
              isStudent
                ? "/assessment"
                : currentPathName.slice(0, currentPathName.lastIndexOf("/"))
            }
          >
            <IconButton
              disableRipple
              className={classes.iconSize}
              sx={{
                marginRight: "1.25rem",
                "& svg": {
                  color: theme.color.background.primary,
                },
              }}
              disableFocusRipple
              href="/"
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
          </Link>
          <Typography
            sx={{
              fontSize: "1.875rem",
              fontWeight: "600",
              color: theme.color.text.primary,
            }}
          >
            {assessment.assessment ? assessment.assessment.name : ""}
          </Typography>
        </Box>
        <Box sx={{ flexDirection: "column", display: "flex" }}>
          {projectHasAssessments.map((data) => (
            <ListPreviewButton
              key={data._id}
              onClick={() =>
                currentRole !== 0
                  ? handleOpenDialog(
                      data.form ? data.form : [],
                      data.assessBy === 1
                        ? "อาจารย์ที่ปรึกษา"
                        : data.matchCommitteeId.name,
                      `ประเมินโดย ${
                        data.assessBy === 1
                          ? data.userId.displayName
                          : "กรรมการคุมสอบ"
                      }`,
                      data.feedBack
                    )
                  : {}
              }
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
                {data.assessBy === 1
                  ? "อาจารย์ที่ปรึกษา"
                  : data.matchCommitteeId.name}
              </Typography>
              <Box
                sx={{
                  top: isBigScreen ? "1.5rem" : "1.95rem",
                  position: "absolute",
                  right: "calc(20px + 1vw)",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography
                  sx={{
                    marginRight: "0.5rem",
                    fontSize: isBigScreen
                      ? "calc(30px + 0.2vw)"
                      : "calc(15px + 2vw)",
                    fontWeight: 600,
                    color: theme.color.text.primary,
                  }}
                >
                  {data.sumScore}
                </Typography>
                <Typography
                  sx={{
                    marginRight: "0.5rem",
                    fontSize: isBigScreen
                      ? "calc(30px + 0.2vw)"
                      : "calc(15px + 2vw)",
                    fontWeight: 600,
                    color: theme.color.text.secondary,
                  }}
                >
                  {`/`}
                </Typography>
                <Typography
                  sx={{
                    fontSize: isBigScreen
                      ? "calc(30px + 0.2vw)"
                      : "calc(15px + 2vw)",
                    fontWeight: 600,
                    color: theme.color.text.secondary,
                  }}
                >
                  {assessment.assessment.score}
                </Typography>
              </Box>
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
                {`ประเมินโดย ${
                  data.assessBy === 1
                    ? data.userId.displayName
                    : "กรรมการคุมสอบ"
                }`}
              </Typography>
            </ListPreviewButton>
          ))}
        </Box>
      </CommonPreviewContainer>
    );
  } else if (notFound === 2) {
    return <CommonPreviewContainer />;
  } else {
    return <NotFound />;
  }
});

export default AssessmentDetail;
