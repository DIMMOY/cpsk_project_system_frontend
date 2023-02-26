import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import { theme } from "../../styles/theme";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import { listUser } from "../../utils/user";
import SelectAdvisorToGroupDialog from "../../components/Dialog/SelectAdvisorToGroupDialog";
import { getMatchCommitteeInClass } from "../../utils/matchCommittee";
import NotFound from "../other/NotFound";
import { ActivateButton, CancelButton, EditButton } from "../../styles/layout/_button";
import { listProjectInClass } from "../../utils/project";
import AddCommitteeToProject from "../../components/Dialog/AddCommitteeToProject";
import AddCommitteeToProjectOnlyOne from "../../components/Dialog/AddCommitteeToProjectOnlyOne";

interface PreviewProps {
  newForm: boolean;
}

const MatchCommitteeEdit = ({ newForm }: PreviewProps) => {
  const { isAdmin, currentRole } = applicationStore;

  const location = useLocation();
  const [notFound, setNotFound] = useState<number>(2);
  const [advisors, setAdvisors] = useState<Array<any>>([]);
  const [matchCommittee, setMatchCommittee] = useState<any>(null);
  const [projects, setProjects] = useState<any>([]);
  const [sortSelect, setSortSelect] = useState<string>("committee");
  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });

  const [currentGroup, setCurrentGroup] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [projectFilter, setProjectFilter] = useState<any>([]);
  const [advisorFilter, setAdvisorFilter] = useState<any>([]);

  const navigate = useNavigate();

  const [scrollToBottom, setScrollToBottom] = useState<number>(0);
  const [openAddGroup, setOpenAddGroup] = useState<boolean>(false)
  const [openAddGroupToProject, setOpenAddGroupToProject] = useState<boolean>(false)
  const [openAddGroupToProjectOnlyOne, setOpenAddGroupToProjectOnlyOne] = useState<boolean>(false)

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];
  const matchCommitteeId = pathname[4]
  ;
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
  };

  const handleOnAddGroupToProject = (groudId: any, projectFilter: Array<any>) => {
    setCurrentGroup(groudId);
    setOpenAddGroupToProject(true);
    setProjectFilter(projectFilter)
  }

  const handleOnAddGroupToProjectOnlyOne = (projectId: any) => {
    setCurrentProject(projectId);
    setOpenAddGroupToProjectOnlyOne(true);
  }

  const getData = async (sort: string) => {
    const matchCommittee = await getMatchCommitteeInClass(classId, matchCommitteeId)
    const projects = await listProjectInClass({ sort, matchCommitteeId }, classId)
    const advisors = await listUser({ n: 1 });
    if (!matchCommittee.data || !projects.data || !advisors.data) {
      setNotFound(0)
    } else {
      setMatchCommittee(matchCommittee.data)
      const advisorHasGroup = matchCommittee.data?.committeeGroup.map((group: { userId: any; }) => group.userId.map((user: { _id: string; }) => user._id))
      const scanAdvisors: Array<any> = [];
      advisors.data.forEach((advisor: any, index: number) => {
        if (!advisorHasGroup.find((subArr: string | any[]) => subArr.includes(advisor.userId._id))) {
          scanAdvisors.push(advisor)
        }
      })
      setAdvisors(scanAdvisors)
      setProjects(projects.data)
      setNotFound(1)

    }
  }

  useEffect(() => {
    getData(sortSelect)
  }, [sortSelect]);

  useEffect(() => {
    if (scrollToBottom) window.scrollTo(0, document.body.scrollHeight);
  }, [scrollToBottom]);

  if (notFound === 1) {
    return (
      <CommonPreviewContainer>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Typography
            sx={{
              fontSize: 45,
              fontWeight: 600,
              marginBottom: 1,
              color: theme.color.text.primary,
            }}
          >
            {matchCommittee.name}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "row", marginBottom: "1.5rem" }}>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 600,
                color: theme.color.text.secondary,
                marginRight: "1rem",
              }}
            >
              กลุ่มกรรมการคุมสอบ
            </Typography>

            <Button
              sx={{
                background: theme.color.button.primary,
                color: theme.color.text.default,
                borderRadius: "10px",
                boxShadow: "none",
                textTransform: "none",
                "&:hover": { background: "#B07CFF" },
                height: 45,
                weight: 42,
                fontSize: isBigScreen ? 16 : 13,
                padding: isBigScreen ? 1 : 0.5,
                marginRight: "1.5rem",
              }}
              startIcon={<AddIcon sx={{ width: 20, height: 20 }}></AddIcon>}
              onClick={() => setOpenAddGroup(true)}
            >
              เพิ่มกลุ่ม
            </Button>

            <SelectAdvisorToGroupDialog
              open={openAddGroup}
              onClose={() => setOpenAddGroup(false)}
              refresh={() => getData(sortSelect)}
              advisors={advisors}
              ordGroup={matchCommittee.committeeGroup.length + 1}
            />

            <AddCommitteeToProject
              open={openAddGroupToProject}
              onClose={() => setOpenAddGroupToProject(false)}
              refresh={() => getData(sortSelect)}
              projects={projects}
              ordGroup={matchCommittee.committeeGroup.length + 1} 
              matchCommitteeId={matchCommitteeId} 
              matchCommitteeHasGroup={currentGroup} 
              projectsInGroup={projectFilter}            
            />

            {
              /*ทำตรงนี้ต่อ ตอนเช้า */
            }
            <AddCommitteeToProjectOnlyOne
              open={openAddGroupToProjectOnlyOne}
              onClose={() => setOpenAddGroupToProjectOnlyOne(false)}
              refresh={() => getData(sortSelect)}
              advisors={advisors}
              ordGroup={matchCommittee.committeeGroup.length + 1}
              project={currentProject}
            />

          </Box>

          <Box 
            sx={{ 
              marginBottom: "2rem", 
              width: isBigScreen ? "60%" : "100%", 
              display: "flex", 
              justifyContent: "center",
              maxHeight: "30rem",
              overflowY: "auto",
            }}
          >
            {
              matchCommittee.committeeGroup.length ?
              (
                <Table>
                  <TableHead>
                    <TableCell align="center" sx={{fontSize: 16, color: theme.color.text.secondary, width: "10%"}}>กลุ่ม</TableCell>
                    <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "50%"}}>รายชื่ออาจารย์</TableCell>
                    <TableCell align="center" sx={{fontSize: 16, color: theme.color.text.secondary, width: "10%"}}>จำนวน</TableCell>
                    <TableCell align="center" sx={{fontSize: 16, color: theme.color.text.secondary, width: "20%"}}></TableCell>
                    <TableCell align="center" sx={{fontSize: 16, color: theme.color.text.secondary, width: "10%"}}></TableCell>
                  </TableHead>
                  <TableBody>
                      {
                        matchCommittee.committeeGroup.map((data: any, index: number) => (
                          <TableRow key={data._id}>
                            <TableCell align="center">
                              <Typography 
                                sx={{fontSize: 16, color: theme.color.text.secondary}}
                              >
                                {index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {data.userId.map((user: any) => (
                                <Typography
                                  key={data._id + " " + user._id} 
                                  sx={{fontSize: 16, color: theme.color.text.secondary}}
                                >
                                  {user.displayName ? user.displayName : "..."}
                                </Typography>
                              ))}
                            </TableCell>
                            <TableCell align="center">
                              <Typography 
                                  sx={{fontSize: 16, color: theme.color.text.secondary}}
                              >
                                {projects.filter((project: { committeeGroupId: any; }) => project.committeeGroupId && project.committeeGroupId._id.toString() === data._id.toString()).length}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <ActivateButton 
                                sx={{ width: "7rem" }} 
                                onClick={() => handleOnAddGroupToProject(data, projects.filter((project: { committeeGroupId: any; }) => 
                                  project.committeeGroupId && project.committeeGroupId._id.toString() === data._id.toString()))}
                              >
                                โปรเจกต์
                              </ActivateButton>
                            </TableCell>
                            <TableCell align="center">
                              <CancelButton sx={{ width: "1rem" }}>
                                ลบ
                              </CancelButton>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                  </TableBody>
                </Table> 
              ) : 
              <Typography sx={{fontSize: 20, color: theme.color.text.secondary}}>ยังไม่มีกลุ่ม</Typography>
            }
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 600,
                color: theme.color.text.secondary,
                marginRight: "1rem",
                marginBottom: "1.5rem"
              }}
            >
              ภาพรวมการจับกลุ่ม
            </Typography>
          </Box>

          <FormControl sx={{ marginRight: "1.5rem", position: "relative" }}>
              <InputLabel id="select-sort-label">จัดเรียงโดย</InputLabel>
              <Select
                labelId="select-sort-label"
                id="select-sort"
                value={sortSelect}
                onChange={handleSortChange}
                label="จัดเรียงโดย"
                sx={{
                  borderRadius: "10px",
                  color: theme.color.background.primary,
                  height: 45,
                  fontWeight: 500,
                  width: 180,
                  marginBottom: "1.5rem"
                }}
              >
                <MenuItem value={"name"}>ชื่อโปรเจกต์</MenuItem>
                <MenuItem value={"advisor"}>อาจารย์ที่ปรึกษา</MenuItem>
                <MenuItem value={"committee"}>กรรมการคุมสอบ</MenuItem>
              </Select>
            </FormControl>

          <Box 
            sx={{ 
              marginBottom: "2rem", 
              width: isBigScreen ? (projects.length ? "80%" : "40rem") : "100%", 
              display: "flex", 
              justifyContent: "center",
              maxHeight: "30rem",
              overflow: "auto",
            }}
          >
            {
              projects.length ?
              (
                <Table>
                  <TableHead>
                    <TableCell align="center" sx={{fontSize: 16, color: theme.color.text.secondary, width: "10%"}}>ลำดับ</TableCell>
                    <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "30%"}}>ชื่อโปรเจกต์ภาษาไทย</TableCell>
                    <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "20%"}}>นิสิต</TableCell>
                    <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "20%"}}>อาจารย์ที่ปรึกษา</TableCell>
                    <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "20%"}}>กรรมการคุมสอบ</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableHead>
                  <TableBody>
                      {
                        projects.map((data: any, index: number) => (
                          <TableRow key={data._id}>
                            <TableCell align="center">
                              <Typography 
                                sx={{fontSize: 16, color: theme.color.text.secondary}}
                              >
                                {index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography 
                                  sx={{fontSize: 16, color: theme.color.text.secondary}}
                              >
                                {data.nameTH}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {data.student.map((user: any) => (
                                <Typography
                                  key={data._id + " " + user._id} 
                                  sx={{fontSize: 16, color: theme.color.text.secondary}}
                                >
                                  {user.displayName ? user.displayName : "..."}
                                </Typography>
                              ))}
                            </TableCell>
                            <TableCell>
                              {data.advisor.map((user: any) => (
                                <Typography
                                  key={data._id + " " + user._id} 
                                  sx={{fontSize: 16, color: theme.color.text.secondary}}
                                >
                                  {user.displayName ? user.displayName : "..."}
                                </Typography>
                              ))}
                            </TableCell>
                            <TableCell>
                              {data.committee.map((user: any) => (
                                <Typography
                                  key={data._id + " " + user._id} 
                                  sx={{fontSize: 16, color: theme.color.text.secondary}}
                                >
                                  {user.displayName ? user.displayName : "..."}
                                </Typography>
                              ))}
                            </TableCell>
                            <TableCell align="center">
                              <EditButton 
                                sx={{ width: "1rem" }} 
                                onClick={() => 
                                  handleOnAddGroupToProjectOnlyOne(data._id)}
                              >
                                แก้ไข
                              </EditButton>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                  </TableBody>
                </Table> 
              ) : 
              <Typography sx={{fontSize: 20, color: theme.color.text.secondary}}>ยังไม่โปรเจกต์ในคลาส</Typography>
            }
          </Box>

        </Box>
      </CommonPreviewContainer>
    );
  } else if (notFound === 2) {
    return <CommonPreviewContainer />;
  } else {
    return <NotFound />;
  }
};

export default MatchCommitteeEdit;
