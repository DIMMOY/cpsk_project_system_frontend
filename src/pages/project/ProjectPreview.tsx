import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import {
  ActivateButton,
  CancelButton,
  EditButton,
  ListPreviewButton,
} from "../../styles/layout/_button";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  acceptProjectByAdvisor,
  listProjectInClass,
} from "../../utils/project";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import NotFound from "../other/NotFound";
import { listMatchCommitteeInClass } from "../../utils/matchCommittee";
import moment from "moment";
import MatchCommitteeChangeStartModal from "../../components/Modal/MatchCommitteeChangeStartModal";
import CancelModal from "../../components/Modal/CancelModal";

const ProjectPreview = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole, classroom, user } = applicationStore;

  const classId = window.location.pathname.split("/")[2];
  const sortOptions = ["createdAtDESC", "createdAtASC", "name"];
  const roleOptions = ["advisor", "committee"];
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
  const matchCommitteeCheck = search.get("matchCommittee")
    ? search.get("matchCommittee")
    : "";
  const [selectedRole, setSelectedRole] = useState<string>(
    roleCheck || "advisor"
  );
  const [selectedMatchCommittee, setSelectedMatchCommittee] = useState<string>(
    matchCommitteeCheck || ""
  );

  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const [projects, setProjects] = useState<Array<any>>([]);
  const [matchCommittee, setMatchCommittee] = useState<Array<any> | null>([]);
  const [notFound, setNotFound] = useState<number>(2);
  const [currentProjectId, setCurrentProjectId] = useState<string>("");
  const [currentProjectName, setCurrentProjectName] = useState<string>("");
  const [currentStartDate, setCurrentStartDate] = useState<string>("");
  const [openStartDateModal, setOpenStartDateModal] = useState<boolean>(false);

  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [currentAccept, setCurrentAccept] = useState<boolean>(false);

  useEffect(() => {
    setProjects([]);
    applicationStore.setIsShowMenuSideBar(true);
    getData();
  }, [selectedSort, selectedRole, selectedMatchCommittee]);

  const getData = async () => {
    let projectData;
    if (currentRole === 1 && selectedRole === "committee") {
      const matchCommittee = await listMatchCommitteeInClass(
        { sort: "createdAtDESC" },
        classId
      );
      if (matchCommittee.data) {
        setMatchCommittee(matchCommittee.data);
        if (selectedMatchCommittee === "") {
          if (matchCommittee.data.length) {
            const matchCommitteeId = matchCommittee.data[0]._id;
            setSelectedMatchCommittee(matchCommitteeId);
            projectData = await listProjectInClass(
              { sort: selectedSort, role: selectedRole, matchCommitteeId },
              classId
            );
          } else projectData = { data: [] };
        } else {
          projectData = await listProjectInClass(
            {
              sort: selectedSort,
              role: selectedRole,
              matchCommitteeId: selectedMatchCommittee,
            },
            classId
          );
        }
      }
    } else {
      projectData = await listProjectInClass(
        { sort: selectedSort, role: selectedRole },
        classId
      );
    }
    if (projectData && projectData.data) {
      setProjects(projectData.data as Array<any>);
      setNotFound(1);
    } else setNotFound(0);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSelectedSort(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${event.target.value}&role=${selectedRole}`,
    });
  };

  const handleMatchCommitteeChange = (event: SelectChangeEvent) => {
    setSelectedMatchCommittee(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${selectedSort}&role=${selectedRole}&matchCommittee=${event.target.value}`,
    });
  };

  const handleRoleChange = (role: string) => {
    if (role !== selectedRole) {
      setSelectedRole(role);
      navigate({
        pathname: window.location.pathname,
        search: `sort=${selectedSort}&role=${role}`,
      });
    }
  };

  const handleOpenStartdateModal = (
    id: string,
    name: string,
    startDate: string,
    event: any
  ) => {
    event.stopPropagation();
    setCurrentProjectId(id);
    setCurrentProjectName(name);
    setCurrentStartDate(startDate);
    setOpenStartDateModal(true);
  };

  const handleOpenAcceptModal = (
    id: string,
    name: string,
    accept: boolean,
    event: any
  ) => {
    event.stopPropagation();
    if (accept) setCurrentTitle("ยอมรับโปรเจกต์");
    else setCurrentTitle("ปฏิเสธโปรเจกต์");
    setCurrentDescription(name);
    setCurrentProjectId(id);
    setOpenCancelModal(true);
    setCurrentAccept(accept);
  };

  const handleSubmitToAcceptOrRefuseProject = async () => {
    await acceptProjectByAdvisor(classId, currentProjectId, currentAccept);
    getData();
  };

  if (notFound === 1) {
    return (
      <AdminCommonPreviewContainer>
        <Sidebar />

        <CancelModal
          open={openCancelModal}
          onClose={() => setOpenCancelModal(false)}
          title={currentTitle}
          description={currentDescription}
          onSubmit={handleSubmitToAcceptOrRefuseProject}
        />

        <MatchCommitteeChangeStartModal
          open={openStartDateModal}
          onClose={() => setOpenStartDateModal(false)}
          projectId={currentProjectId}
          projectName={currentProjectName}
          matchCommitteeId={selectedMatchCommittee}
          refresh={getData}
          defaultStartDate={currentStartDate}
        />

        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              padding: "0 auto",
              margin: "1.25rem 0 1.25rem 0",
              flexDirection: isBigScreen ? "row" : "column",
              maxWidth: 700,
            }}
          >
            <FormControl sx={{ marginRight: "1.5rem", position: "relative" }}>
              <InputLabel id="select-sort-label">จัดเรียงโดย</InputLabel>
              <Select
                labelId="select-sort-label"
                id="select-sort"
                value={selectedSort}
                onChange={handleSortChange}
                label="จัดเรียงโดย"
                sx={{
                  borderRadius: "10px",
                  color: theme.color.background.primary,
                  height: 45,
                  fontWeight: 500,
                  width: 180,
                }}
              >
                <MenuItem value={"createdAtDESC"}>วันที่สร้างล่าสุด</MenuItem>
                <MenuItem value={"createdAtASC"}>วันที่สร้างเก่าสุด</MenuItem>
                <MenuItem value={"name"}>ชื่อคลาส</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {currentRole === 1 ? (
            <Box sx={{ margin: "0.5rem 0 1.25rem 0" }}>
              <Button
                sx={{
                  marginRight: "1.25rem",
                  borderRadius: "10px",
                  color:
                    selectedRole === "advisor"
                      ? theme.color.text.default
                      : theme.color.text.primary,
                  backgroundColor:
                    selectedRole === "advisor"
                      ? theme.color.background.primary
                      : theme.color.background.default,
                  height: 45,
                  padding: "1rem",
                  fontSize: 16,
                  "&:hover": {
                    background:
                      selectedRole === "advisor"
                        ? "#B07CFF"
                        : theme.color.background.tertiary,
                  },
                }}
                onClick={() => handleRoleChange("advisor")}
              >
                โปรเจกต์ที่เป็นที่ปรึกษา
              </Button>
              <Button
                sx={{
                  marginRight: "1.25rem",
                  borderRadius: "10px",
                  color:
                    selectedRole === "committee"
                      ? theme.color.text.default
                      : theme.color.text.primary,
                  backgroundColor:
                    selectedRole === "committee"
                      ? theme.color.background.primary
                      : theme.color.background.default,
                  height: 45,
                  padding: "1rem",
                  fontSize: 16,
                  "&:hover": {
                    background:
                      selectedRole === "committee"
                        ? "#B07CFF"
                        : theme.color.background.tertiary,
                  },
                }}
                onClick={() => handleRoleChange("committee")}
              >
                โปรเจกต์ที่เป็นกรรมการคุมสอบ
              </Button>
              {selectedRole === "committee" &&
              matchCommittee &&
              matchCommittee.length ? (
                <FormControl
                  sx={{ marginRight: "1.5rem", position: "relative" }}
                >
                  <InputLabel id="select-match-committee-label">
                    รายการคุมสอบ
                  </InputLabel>
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
                    {matchCommittee.map((data) => (
                      <MenuItem key={data._id} value={data._id}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <></>
          )}

          <Box sx={{ flexDirection: "column", display: "flex" }}>
            {projects.map((data) => (
              <ListPreviewButton
                key={data._id}
                sx={{ zIndex: 1 }}
                onClick={() =>
                  currentRole === 2 ||
                  data.advisor.find((u: any) => u.email === user?.email)
                    .isAccept
                    ? navigate(`/class/${classId}/project/${data._id}`)
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
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    textAlign: "left",
                    width: isBigScreen ? "65%" : "40%",
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
                  }}
                >
                  {selectedRole === "committee"
                    ? `สอบวันที่ ${moment(data.startDate).format(
                        "DD/MM/YYYY HH:mm"
                      )}`
                    : data.nameEN}
                </Typography>
                {currentRole === 1 &&
                data.advisor.length &&
                !data.advisor.find((u: any) => u.email === user?.email)
                  .isAccept ? (
                  <>
                    <ActivateButton
                      sx={{
                        position: "absolute",
                        right: "calc(150px + 1vw)",
                        zIndex: 2,
                      }}
                      onClick={(event) =>
                        handleOpenAcceptModal(
                          data._id,
                          data.nameTH,
                          true,
                          event
                        )
                      }
                    >
                      ยอมรับ
                    </ActivateButton>
                    <CancelButton
                      sx={{
                        position: "absolute",
                        right: "calc(20px + 1vw)",
                        zIndex: 2,
                      }}
                      onClick={(event) =>
                        handleOpenAcceptModal(
                          data._id,
                          data.nameTH,
                          false,
                          event
                        )
                      }
                    >
                      ปฏิเสธ
                    </CancelButton>
                  </>
                ) : (
                  <></>
                )}
                {selectedRole === "committee" ? (
                  <EditButton
                    sx={{
                      width: "7rem",
                      position: "absolute",
                      right: "calc(20px + 1vw)",
                      zIndex: 2,
                    }}
                    onClick={(event) =>
                      handleOpenStartdateModal(
                        data._id,
                        data.nameTH,
                        data.startDate,
                        event
                      )
                    }
                  >
                    แก้ไขวันที่
                  </EditButton>
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

export default ProjectPreview;
