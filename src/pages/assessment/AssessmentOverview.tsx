import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { ActivateButton, CancelButton, EditButton, ListPreviewButton } from "../../styles/layout/_button";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import Sidebar from "../../components/Sidebar/Sidebar";
import { listProjectInClass } from "../../utils/project";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import NotFound from "../other/NotFound";
import { listMatchCommitteeInClass } from "../../utils/matchCommittee";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getAssessmentInClass, getProjectHasAssessmentInClass, listProjectHasAssessment } from "../../utils/assessment";

const AssessmentOverview = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, isAdvisor, currentRole, classroom, user } = applicationStore;

  const sortOptions = ["createdAtDESC", "createdAtASC", "name"];
  const roleOptions = ["advisor", "committee"]
  const sortCheck =
    search.get("sort") &&
    sortOptions.find(
      (e) => search.get("sort")?.toLowerCase() == e.toLowerCase()
    )
      ? search.get("sort")
      : "createdAtDESC";
  const [selectedSort, setSelectedSort] = useState<string>(
    sortCheck || "createdAtDESC"
  );
  const roleCheck =
  search.get("role") &&
    roleOptions.find(
      (e) => search.get("role")?.toLowerCase() == e.toLowerCase()
    )
      ? search.get("role")
      : "advisor";
  const matchCommitteeCheck =
  search.get("matchCommittee")
      ? search.get("matchCommittee")
      : "";
  const [selectedRole, setSelectedRole] = useState<string>(roleCheck || "advisor")
  const [selectedMatchCommittee, setSelectedMatchCommittee] = useState<string>(matchCommitteeCheck || '');

  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const [matchCommittee, setMatchCommittee] = useState<Array<any> | null>(null);
  const [notFound, setNotFound] = useState<number>(2);
  const [assessment, setAssessment] = useState<any>(null);
  const [projects, setProjects] = useState<Array<any>>([]);

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];
  const assessmentId = pathname[5];

  useEffect(() => {
    applicationStore.setIsShowMenuSideBar(true);
    async function getData() {
      const assessmentData = await getAssessmentInClass(classId, assessmentId);
      if (assessmentData.data) {
        setAssessment(assessmentData.data.assessment);
        if (assessmentData.data.assessment.assessBy === 2) {
          setSelectedRole("committee")
        }
        if (assessmentData.data.assessment.assessBy !== 1) {
          if (assessmentData.data.matchCommitteeId.length) {
            setMatchCommittee(assessmentData.data.matchCommitteeId)
            setSelectedMatchCommittee(assessmentData.data.matchCommitteeId[0]._id)
          } else {
            if (selectedRole === 'committee') {
              setProjects([])
              setNotFound(1)
              return
            }
          }
        }
      } else {
        setNotFound(0);
        return;
      }
      
      const params = assessmentData.data.assessment.assessBy !== 2 && selectedRole === 'advisor' ? 
        { id: assessmentId, role: 2 } : 
        { id: assessmentId, role: 3, matchCommitteeId: selectedMatchCommittee };

      const projectHasAssessment = await listProjectHasAssessment(classId, params);
      if (projectHasAssessment.data) {
        setAssessment(projectHasAssessment.data.assessment)
        setProjects(projectHasAssessment.data.project)
        if (projectHasAssessment.data.assessment.assessBy === 2)
          setSelectedRole("committee")
        setNotFound(1) 
      } else {
        setNotFound(0)
      }
    }
    getData();
  }, [selectedRole, selectedMatchCommittee]);

  const handleMatchCommitteeChange = (event: SelectChangeEvent) => {
    setSelectedMatchCommittee(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${selectedSort}&role=${selectedRole}&matchCommittee=${event.target.value}`,
    });
  };

  const handleRoleChange = (role: string) => {
    if (role !== selectedRole) {
      setSelectedRole(role)
      navigate({
        pathname: window.location.pathname,
        search: `sort=${selectedSort}&role=${role}`
      })
    }
  }

  if (notFound === 1) {
    return (
      <AdminCommonPreviewContainer>
        <Sidebar />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Box sx={{ display: "flex", padding: "0 auto", alignItems: "center", marginBottom: "1.25rem" }}>
            <Link
              to={`/class/${classId}/assessment`}
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
            <Typography sx={{ color: theme.color.text.primary, fontSize: "calc(30px + 0.2vw)", fontWeight: 600, }}> 
              {assessment ? assessment.name : ''}
            </Typography>
          </Box>
          
          {
            currentRole === 1 && assessment ?
            <Box sx={{margin: "0.5rem 0 1.25rem 0", }}>
              {
                assessment.assessBy === 0 || assessment.assessBy === 1 ?
                <Button 
                  sx={{
                    marginRight: "1.25rem", 
                    borderRadius: "10px",
                    color: selectedRole === "advisor" ? theme.color.text.default : theme.color.text.primary,
                    backgroundColor: selectedRole === "advisor" ? theme.color.background.primary : theme.color.background.default,
                    height: 45,
                    padding: "1rem",
                    fontSize: 16,
                    "&:hover": { background: selectedRole === "advisor" ? "#B07CFF" : theme.color.background.tertiary }
                  }} 
                  onClick={() => handleRoleChange('advisor')}
                >
                  โปรเจกต์ที่เป็นที่ปรึกษา
                </Button> : <></>
              } 
              {
                assessment.assessBy === 0 || assessment.assessBy === 2 ?
                <Button 
                  sx={{
                    marginRight: "1.25rem", 
                    borderRadius: "10px", 
                    color: selectedRole === "committee" ? theme.color.text.default : theme.color.text.primary,
                    backgroundColor: selectedRole === "committee" ? theme.color.background.primary : theme.color.background.default,
                    height: 45,
                    padding: "1rem",
                    fontSize: 16,
                    "&:hover": { background: selectedRole === "committee" ? "#B07CFF" : theme.color.background.tertiary }
                  }} 
                  onClick={() => handleRoleChange('committee')}
                >
                  โปรเจกต์ที่เป็นกรรมการคุมสอบ
                </Button> : <></>
              }
              {
                (assessment.assessBy === 0 || assessment.assessBy === 2) && selectedRole === 'committee' && matchCommittee && matchCommittee.length ? 
                <FormControl sx={{ marginRight: "1.5rem", position: "relative" }}>
                  <InputLabel id="select-match-committee-label">รายการคุมสอบ</InputLabel>
                  <Select
                    labelId="select-match-committee-label"
                    id="select-match-committee"
                    value={selectedMatchCommittee}
                    onChange={handleMatchCommitteeChange}
                    label="รายการคุมสอบ"
                    sx={{
                      borderRadius: "10px",
                      color: theme.color.background.primary,
                      height: 45,
                      fontWeight: 500,
                      width: 180,
                    }}
                  >
                    {
                      matchCommittee.map((data) => (
                        <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                : <></>
              }    
            </Box> : 
            <></>
          }

          <Box sx={{ flexDirection: "column", display: "flex" }}>
            {projects.map((data) => (
              <ListPreviewButton
                key={data._id}
                onClick={() =>
                  navigate(`/class/${classId}/assessment/${assessmentId}/project/${data._id as string}/form`)
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
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    textAlign: "left",
                    width: "70%",
                  }}
                >
                  {data.nameTH}
                </Typography>
                <Typography
                  sx={{
                    top: "5rem",
                    left: "calc(20px + 1vw)",
                    position: "absolute",
                    fontSize: "calc(15px + 0.3vw)",
                    color: theme.color.text.secondary,
                    fontWeight: 600,
                    textAlign: "left",
                    width: "70%",
                  }}
                >
                  {data.nameEN}
                </Typography>
                {!data.assessmentResults.find((data: any) => user?.email === data.userId.email) && isAdvisor && currentRole === 1 ? (
                  <ActivateButton
                    sx={{
                      position: "absolute",
                      right: "calc(20px + 1vw)",
                      zIndex: 2,
                    }}
                    onClick={() =>
                      navigate(`/class/${classId}/assessment/${assessmentId}/project/${data._id as string}/form`)
                    }
                  >
                    ประเมิน
                  </ActivateButton>
                ) : (
                  <></>
                )}
                {data.assessmentResults.find((data: any) => user?.email === data.userId.email) && isAdvisor && currentRole === 1 ? (
                  <EditButton
                    sx={{
                      position: "absolute",
                      right: "calc(150px + 1vw)",
                      zIndex: 2,
                    }}
                    onClick={() =>
                      navigate(`/class/${classId}/assessment/${assessmentId}/project/${data._id as string}/form`)
                    }
                  >
                    แก้ไข
                  </EditButton>
                ) : (
                  <></>
                )}
                {data.assessmentResults.find((data: any) => user?.email === data.userId.email) && isAdvisor && currentRole === 1 ? (
                  <CancelButton
                    sx={{
                      position: "absolute",
                      right: "calc(20px + 1vw)",
                      zIndex: 2,
                    }}
                    // onClick={(event) =>
                    //   handleOpenCancelModal(c.name, c._id, event)
                    // }
                  >
                    ยกเลิก
                  </CancelButton>
                ) : (
                  <></>
                )}
              </ListPreviewButton>
            ))}
          </Box>
        </Box>
      </AdminCommonPreviewContainer>
    );
  } else if (notFound === 2) {
    return (
      <AdminCommonPreviewContainer>
        <Sidebar />
      </AdminCommonPreviewContainer>
    );
  } else {
    return <NotFound></NotFound>;
  }
});

export default AssessmentOverview;
