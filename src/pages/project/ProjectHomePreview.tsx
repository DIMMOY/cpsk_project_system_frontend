import React, { Component, useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupsIcon from "@mui/icons-material/Groups";
import GradingIcon from "@mui/icons-material/Grading";
import { ProjectPreviewButton } from "../../styles/layout/_button";
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import {
  ProjectPreviewContainer,
  ProjectPreviewDetail,
} from "../../styles/layout/_preview/_previewProject";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import applicationStore from "../../stores/applicationStore";
import { findProjectInClass } from "../../utils/project";
import NotFound from "../other/NotFound";

const useStyles = makeStyles({
  iconSize: {
    "& svg": {
      fontSize: "500%",
      color: theme.color.background.primary,
    },
  },
});

const ProjectHomePreview = observer(
  (props: { isStudent: boolean; isCommittee: boolean }) => {
    const { isStudent, isCommittee } = props;
    const { currentRole, project } = applicationStore;
    const navigate = useNavigate();
    const classes = useStyles();
    const [nameTH, setNameTH] = useState<string>(".....");
    const [nameEN, setNameEN] = useState<string>(".....");
    const [notFound, setNotFound] = useState<number>(2);
    const [description, setDescription] = useState<string>(".....");
    const isBigScreen = useMediaQuery({ query: "(min-width: 1440px)" });

    const cuurentPathName = window.location.pathname.endsWith("/")
      ? window.location.pathname.slice(0, -1)
      : window.location.pathname;

    useEffect(() => {
      async function getData() {
        const pathname = cuurentPathName.split("/");
        const classId = pathname[2];
        const projectId = pathname[4];
        const projectData = await findProjectInClass(classId, projectId);
        if (!projectData.data) {
          setNotFound(0);
        } else {
          const { nameTH, nameEN, description } = projectData.data;
          setNameTH(nameTH);
          setNameEN(nameEN);
          setDescription(description);
          setNotFound(1);
        }
      }
      if (isStudent && currentRole === 0) {
        setNameTH(project.nameTH);
        setNameEN(project.nameEN);
        setDescription(project.description);
        setNotFound(1);
      } else {
        getData();
      }
    }, []);

    const scrollTop = () => {
      window.scrollTo(0, 0);
    };

    if (notFound === 1) {
      return (
        <ProjectPreviewContainer>
          <ProjectPreviewDetail>
            {
              currentRole === 0 ? 
              <IconButton 
                sx={{
                  position: "absolute",
                  right: "1rem",
                  top: "1rem"
                }}
                onClick={() => navigate('/project')}
              >
                <SettingsIcon fontSize="large"></SettingsIcon>
              </IconButton>
              :
              <></>
            }
            <Typography
              sx={{
                fontSize: 45,
                fontWeight: 500,
                color: theme.color.text.primary,
                overflowY: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "",
                display: "inline-block",
                textAlign: "left",
                width: "90%",
              }}
            >
              {nameTH}
            </Typography>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 500,
                color: theme.color.text.secondary,
              }}
            >
              {nameEN}
            </Typography>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 500,
                color: theme.color.text.secondary,
              }}
            >
              {description}
            </Typography>
          </ProjectPreviewDetail>
          <Box sx={{ textAlign: "center" }}>
            <Link
              to={
                currentRole === 0 ? "/document" : `${cuurentPathName}/document`
              }
              style={{ textDecoration: "none" }}
            >
              <ProjectPreviewButton
                isBigScreen={isBigScreen}
                onClick={scrollTop}
              >
                ส่งเอกสาร
                <IconButton className={classes.iconSize} disabled>
                  <DescriptionIcon />
                </IconButton>
              </ProjectPreviewButton>
            </Link>
            {!isCommittee && (
              <Link
                to={
                  currentRole === 0
                    ? "/meeting-schedule"
                    : `${cuurentPathName}/meeting-schedule`
                }
                style={{ textDecoration: "none" }}
              >
                <ProjectPreviewButton
                  isBigScreen={isBigScreen}
                  onClick={scrollTop}
                >
                  รายงานอาจารย์ที่ปรึกษา
                  <IconButton className={classes.iconSize} disabled>
                    <GroupsIcon />
                  </IconButton>
                </ProjectPreviewButton>
              </Link>
            )}
            <Link to="/score" style={{ textDecoration: "none" }}>
              <ProjectPreviewButton
                isBigScreen={isBigScreen}
                onClick={scrollTop}
              >
                ประเมิน
                <IconButton className={classes.iconSize} disabled>
                  <GradingIcon />
                </IconButton>
              </ProjectPreviewButton>
            </Link>
          </Box>
        </ProjectPreviewContainer>
      );
    } else if (notFound === 2) {
      return <ProjectPreviewContainer />;
    } else {
      return <NotFound />;
    }
  }
);

export default ProjectHomePreview;
