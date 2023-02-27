import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { ListPreviewButton } from "../../styles/layout/_button";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import Sidebar from "../../components/Sidebar/Sidebar";
import { listProjectInClass } from "../../utils/project";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import NotFound from "../other/NotFound";
import { listMatchCommitteeInClass } from "../../utils/matchCommittee";

const ProjectPreview = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole, classroom } = applicationStore;

  const classId = window.location.pathname.split("/")[2];
  const sortOptions = ["createdAtDESC", "createdAtASC", "name"];
  const roleOptions = ["advisor", "committee"]
  const sortCheck =
    search.get("sort") &&
    sortOptions.find(
      (e) => search.get("sort")?.toLowerCase() == e.toLowerCase()
    )
      ? search.get("sort")
      : "createdAtDESC";
  const [sortSelect, setSortSelect] = useState<string>(
    sortCheck || "createdAtDESC"
  );
  const roleCheck =
  search.get("role") &&
    roleOptions.find(
      (e) => search.get("role")?.toLowerCase() == e.toLowerCase()
    )
      ? search.get("role")
      : "advisor";
  const [roleSelect, setRoleSelect] = useState<string>(roleCheck || "advisor")

  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const [projects, setProjects] = useState<Array<any>>([]);
  const [mathCommittee, setMatchCommittee] = useState<Array<any>>([]);
  const [notFound, setNotFound] = useState<number>(2);

  useEffect(() => {
    applicationStore.setIsShowMenuSideBar(true);
    async function getData() {
      const projectData = await listProjectInClass({ sort: sortSelect, role: roleSelect }, classId);
      if (currentRole === 1) {
        const matchCommittee = await listMatchCommitteeInClass({}, classId)
      }
      if (projectData.data) {
        setProjects(projectData.data as Array<any>);
        setNotFound(1);
      } else setNotFound(0);
    }
    getData();
  }, [sortSelect, roleSelect]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${event.target.value}&role=${roleSelect}`,
    });
  };

  const handleRoleChange = (role: string) => {
    setRoleSelect(role)
    navigate({
      pathname: window.location.pathname,
      search: `sort=${sortSelect}&role=${role}`
    })
  }

  if (notFound === 1) {
    return (
      <AdminCommonPreviewContainer>
        <Sidebar />
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
                value={sortSelect}
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
          
          {
            currentRole === 1 ?
            <Box>
              <Button sx={{marginRight: "1rem"}} onClick={() => handleRoleChange('advisor')}>
                โปรเจกต์ที่เป็นที่ปรึกษา
              </Button>
              <Button onClick={() => handleRoleChange('committee')}>
                โปรเจกต์ที่เป็นกรรมการคุมสอบ
              </Button>     
            </Box> : 
            <></>
          }

          <Box sx={{ flexDirection: "column", display: "flex" }}>
            {projects.map((c) => (
              <ListPreviewButton
                key={c._id}
                onClick={() => navigate(`/class/${classId}/project/${c._id}`)}
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
                  {c.nameTH}
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
                  {c.nameEN}
                </Typography>
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
