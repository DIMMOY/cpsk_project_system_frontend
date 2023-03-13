import { Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ListPreviewButton } from "../../styles/layout/_button";
import moment from "moment";
import { CommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import applicationStore from "../../stores/applicationStore";
import NotFound from "../other/NotFound";
import { listAssessmentInClass } from "../../utils/assessment";

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

const AssessmentHomePreview = observer(({ isStudent }: PreviewProps) => {
  const [assessments, setAssessments] = useState<Array<any>>([]);
  const [notFound, setNotFound] = useState<number>(2);
  const { currentRole, classroom, project } = applicationStore;
  const classes = useStyles();
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" });
  const { success, warning, error, secondary } = theme.color.text;
  const statusList = [
    { color: error, message: "ยังไม่ส่ง" },
    { color: success, message: "ส่งแล้ว" },
    { color: warning, message: "ส่งช้า" },
    { color: warning, message: "รอยืนยัน" },
    { color: secondary, message: "----" },
  ];

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = isStudent ? classroom._id : pathname[2];
  const projectId = isStudent ? project._id : pathname[4];

  const getData = async () => {
    const assessmentData = await listAssessmentInClass(
      { sort: "sortSelect", status: "true" },
      classId
    );
    if (!assessmentData.data) {
      setNotFound(0);
    } else {
      setAssessments(assessmentData.data as Array<any>);
      setNotFound(1);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (notFound === 1) {
    return (
      <CommonPreviewContainer>
        <Box sx={{ display: "flex", padding: "0 auto", alignItems: "center" }}>
          <Link
            to={
              isStudent
                ? "/"
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
            ประเมิน
          </Typography>
        </Box>
        <Box sx={{ flexDirection: "column", display: "flex" }}>
          {assessments.map((data) => (
            <ListPreviewButton
              key={data._id}
              onClick={() => {
                navigate(
                  isStudent && currentRole === 0
                    ? `/assessment/${data._id as string}`
                    : `${currentPathName}/${data._id as string}`,
                  {
                    replace: true,
                    state: {
                      name: data.name,
                      status: data.sendStatus,
                      detail: data.detail ? data.detail : "",
                      statusType: data.statusType,
                      dueDate: moment(data.endDate).format("DD/MM/YYYY HH:mm"),
                    },
                  }
                );
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
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  textAlign: "left",
                  width: "90%",
                }}
              >
                {data.name}
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
                {`ประเมินโดย ${
                  data.assessBy === 0
                    ? "อาจารย์ที่ปรึกษาและกรรมการคุมสอบ"
                    : data.assessBy === 1
                    ? "อาจารย์ที่ปรึกษา"
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

export default AssessmentHomePreview;
