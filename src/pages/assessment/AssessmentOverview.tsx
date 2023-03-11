import React, { Fragment, useEffect, useState } from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { ActivateButton, CancelButton, EditButton } from "../../styles/layout/_button";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import Sidebar from "../../components/Sidebar/Sidebar";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import NotFound from "../other/NotFound";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { deleteSendAssessment, getAssessmentInClass, listProjectHasAssessment } from "../../utils/assessment";
import CancelModal from "../../components/Modal/CancelModal";

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
  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);
  const [currentCancelProjectName, setCurrentCancelProjectName] = useState<string>('');
  const [currentCancelFormId, setCurrentCancelFormId] = useState<string>('');

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];
  const assessmentId = pathname[5];

  useEffect(() => {
    applicationStore.setIsShowMenuSideBar(true);
    getData();
  }, [selectedRole, selectedMatchCommittee]);

  const getData = async () => {
    const assessmentData = await getAssessmentInClass(classId, assessmentId);
    if (assessmentData.data) {
      setAssessment(assessmentData.data.assessment);
      if (assessmentData.data.assessment.assessBy === 2) {
        setSelectedRole("committee")
      }
      if (assessmentData.data.assessment.assessBy !== 1) {
        if (assessmentData.data.matchCommitteeId.length) {
          setMatchCommittee(assessmentData.data.matchCommitteeId)
          if (selectedMatchCommittee === "")
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
      setNotFound(1) 
    }
  }

  const handleMatchCommitteeChange = (event: SelectChangeEvent) => {
    setSelectedMatchCommittee(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${selectedSort}&role=${selectedRole}&matchCommittee=${event.target.value}`,
    });
  };

  const handleOpenCancelModal = (name: string, id: string) => {
    setOpenCancelModal(true)
    setCurrentCancelProjectName(name)
    setCurrentCancelFormId(id)
  }

  const handleRoleChange = (role: string) => {
    if (role !== selectedRole) {
      setSelectedRole(role)
      navigate({
        pathname: window.location.pathname,
        search: `sort=${selectedSort}&role=${role}`
      })
    }
  }
  
  const handleSubmitToCancel = async () => {
    await deleteSendAssessment(currentCancelFormId);
    getData()
  }

  if (notFound === 1) {
    return (
      <AdminCommonPreviewContainer>
        <Sidebar />
        <CancelModal
          open={openCancelModal}
          onClose={() => setOpenCancelModal(false)}
          onSubmit={handleSubmitToCancel}
          title={`ยกเลิกการประเมินโปรเจกต์`}
          description={`${currentCancelProjectName}`}
        />
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
            assessment ?
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
                  อาจารย์ที่ปรึกษาลงคะแนน
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
                  กรรมการคุมสอบลงคะแนน
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

          <Typography 
            sx={{ 
              color: theme.color.text.primary, 
              fontSize: 20, 
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            {`คะแนนเต็ม ${assessment.score} คะแนน (คะแนนดิบแบบยังไม่หาร ${assessment.form.map((question: any) => question.limitScore * question.weight).reduce((a: any, b: any) => a + b)} คะแนน)`}
          </Typography>

          <Box sx={{ maxWidth: "100%", overflowX: "auto", maxHeight: 700 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontSize: 20, color: theme.color.text.secondary, width: "40%", fontWeight: 600}}>
                    โปรเจกต์
                  </TableCell>
                  <TableCell align="center" sx={{fontSize: 20, color: theme.color.text.secondary, width: "10%", fontWeight: 600}}>
                    คะแนนดิบ
                  </TableCell>
                  <TableCell align="center" sx={{fontSize: 20, color: theme.color.text.secondary, width: "10%", fontWeight: 600}}>
                    คะแนนรวม
                  </TableCell>
                  <TableCell align="center" sx={{fontSize: 20, color: theme.color.text.secondary, width: "20%", fontWeight: 600}}>
                    ประเมินโดย
                  </TableCell>
                  {
                    currentRole === 1 && isAdvisor ? 
                    <>
                      <TableCell align="center" sx={{fontSize: 20, color: theme.color.text.secondary, width: "10%", fontWeight: 600}}></TableCell>
                      <TableCell align="center" sx={{fontSize: 20, color: theme.color.text.secondary, width: "10%", fontWeight: 600}}></TableCell>
                    </>
                    : <></>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  projects.map((data) => (
                    <Fragment key={data._id}>
                      <TableRow>
                        <TableCell 
                          rowSpan={
                            data.assessmentResults.length ? 
                              data.assessmentResults.length + 1 + (!data.assessmentResults.find((data: any) => data.userId.email === user?.email) ? 1 : 0): 
                              2
                          }
                          sx={{
                            fontSize: 18, 
                            color: theme.color.text.secondary, 
                            fontWeight: 500
                          }}>
                          {data.nameTH}
                        </TableCell>
                      </TableRow>
                      {
                        currentRole === 1 && isAdvisor && data.assessmentResults.length && !data.assessmentResults.find((data: any) => data.userId.email === user?.email) ? 
                        <TableRow>
                          <TableCell 
                            align="center"
                            sx={{
                              fontSize: 18, 
                              color: theme.color.text.secondary, 
                              fontWeight: 500
                            }}
                            >
                              -
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{
                              fontSize: 18, 
                              color: theme.color.text.secondary, 
                              fontWeight: 500
                            }}
                          >
                            -
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{
                              fontSize: 18, 
                              color: theme.color.text.secondary, 
                              fontWeight: 500
                            }}
                          >
                            -
                          </TableCell>
                          {
                            currentRole === 1 && isAdvisor ?
                            <>
                              <TableCell>
                              </TableCell>
                              <TableCell>
                                <ActivateButton
                                  onClick={() =>
                                    navigate({
                                      pathname: `/class/${classId}/assessment/${assessmentId}/project/${data._id as string}/form`,
                                      search: `role=${selectedRole}${selectedRole === "committee" ? `&matchCommittee=${selectedMatchCommittee}` : ''}`
                                    })
                                  }
                                >
                                  ประเมิน
                                </ActivateButton>
                              </TableCell> 
                            </>
                            : <></>
                          }
                         </TableRow>
                        : <></>
                      }
                      {
                        data.assessmentResults.length ? 
                          data.assessmentResults.sort((a: any, b: any) => {
                            if (a.userId.email === user?.email)
                              return -1;
                            else if (b.userId.email === user?.email)
                              return 1;
                            else {
                              return a.userId.displayName - b.userId.displayName
                            }
                          }).map((result: any, indexForm: number) => (
                            <TableRow key={data._id + " " + result._id}>
                              <TableCell
                                align="center" 
                                sx={{
                                  fontSize: 18, 
                                  color: theme.color.text.secondary, 
                                  fontWeight: 600
                                }}
                              >
                                {result.rawScore}
                              </TableCell>
                              <TableCell
                                align="center" 
                                sx={{
                                  fontSize: 18, 
                                  color: theme.color.text.primary, 
                                  fontWeight: 600
                                }}
                              >
                                {result.sumScore}
                              </TableCell>
                              <TableCell
                                align="center" 
                                sx={{
                                  fontSize: 18, 
                                  color: theme.color.text.secondary, 
                                  fontWeight: 500
                                }}
                              >
                                {result.userId.displayName ? result.userId.displayName : "..."}
                              </TableCell>
                              {
                                currentRole === 1 && isAdvisor && result.userId.email === user?.email ? 
                                <>
                                  <TableCell>
                                    <EditButton
                                      onClick={() =>
                                        navigate({
                                          pathname: `/class/${classId}/assessment/${assessmentId}/project/${data._id as string}/form`,
                                          search: `role=${selectedRole}${selectedRole === "committee" ? `&matchCommittee=${selectedMatchCommittee}` : ''}`
                                        })
                                      }
                                    >
                                      แก้ไข
                                    </EditButton>
                                  </TableCell>
                                  <TableCell>
                                    <CancelButton
                                      onClick={() =>
                                        handleOpenCancelModal(data.nameTH, result._id)
                                      }
                                    >
                                      ยกเลิก
                                    </CancelButton>    
                                  </TableCell> 
                                </> : (
                                  currentRole === 1 && isAdvisor ? 
                                  <>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  </> :
                                  <></>
                                )
                              }
                            </TableRow>
                          ))
                         : 
                         <TableRow>
                          <TableCell 
                            align="center"
                            sx={{
                              fontSize: 18, 
                              color: theme.color.text.secondary, 
                              fontWeight: 500
                            }}
                            >
                              -
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{
                              fontSize: 18, 
                              color: theme.color.text.secondary, 
                              fontWeight: 500
                            }}
                          >
                            -
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{
                              fontSize: 18, 
                              color: theme.color.text.secondary, 
                              fontWeight: 500
                            }}
                          >
                            -
                          </TableCell>
                          {
                            currentRole === 1 && isAdvisor ?
                            <>
                              <TableCell>
                              </TableCell>
                              <TableCell>
                                <ActivateButton
                                  onClick={() =>
                                    navigate({
                                      pathname: `/class/${classId}/assessment/${assessmentId}/project/${data._id as string}/form`,
                                      search: `role=${selectedRole}${selectedRole === "committee" ? `&matchCommittee=${selectedMatchCommittee}` : ''}`
                                    })
                                  }
                                >
                                  ประเมิน
                                </ActivateButton>
                              </TableCell> 
                            </>
                            : <></>
                          }
                         </TableRow>
                      }
                    </Fragment>
                  ))
                }

              </TableBody>
            </Table>
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
