import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import AddIcon from "@mui/icons-material/Add";
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
import MatchCommitteeCreateModal from "../../components/Modal/MatchCommitteeCreateModal";

const MatchCommittee = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole, classroom } = applicationStore;

  const classId = window.location.pathname.split("/")[2];
  const sortOptions = ["createdAtDESC", "createdAtASC", "name"];
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

  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const [projects, setProjects] = useState<Array<any>>([]);
  const [notFound, setNotFound] = useState<number>(2);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    applicationStore.setIsShowMenuSideBar(true);
    async function getData() {
      const result = await listProjectInClass({ sort: sortSelect }, classId);
      if (result.data) {
        setProjects(result.data as Array<any>);
        setNotFound(1);
      } else setNotFound(0);
    }
    getData();
  }, [sortSelect]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${event.target.value}`,
    });
  };

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
              onClick={() => setOpen(true)}
            >
              สร้าง
            </Button>
          </Box>

          <MatchCommitteeCreateModal
            open={open}
            onClose={() => setOpen(false)}
            refresh={() => console.log("TEST")}
            id={null}
            name={"TEST"}
          />

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

export default MatchCommittee;
