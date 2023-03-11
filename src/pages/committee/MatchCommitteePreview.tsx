import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { ActivateButton, CancelButton, EditButton, ListPreviewButton } from "../../styles/layout/_button";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import Sidebar from "../../components/Sidebar/Sidebar";
import { listProjectInClass } from "../../utils/project";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import NotFound from "../other/NotFound";
import MatchCommitteeCreateModal from "../../components/Modal/MatchCommitteeCreateModal";
import { disableMatchCommitteeInClass, listMatchCommitteeInClass } from "../../utils/matchCommittee";
import moment from "moment";
import MatchCommitteeStartModal from "../../components/Modal/MatchCommitteeStartModal";
import CancelModal from "../../components/Modal/CancelModal";

const MatchCommitteePreview = observer(() => {
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
  const [matchCommittee, setMatchCommittee] = useState<Array<any>>([]);
  const [notFound, setNotFound] = useState<number>(2);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openStart, setOpenStart] = useState<boolean>(false);
  const [openCancel, setOpenCancel] = useState<boolean>(false);
  const [currentMatchCommitteeName, setCurrentMatchCommitteeName] = useState<string>('')
  const [currentMatchCommitteeId, setCurrentMatchCommitteeId] = useState<string>('')
  const [currentStartDate, setCurrentStartDate] = useState<string | null>(null)


  const getData = async () => {
    const result = await listMatchCommitteeInClass({ sort: sortSelect }, classId);
    if (result.data) {
      setMatchCommittee(result.data as Array<any>);
      setNotFound(1);
    } else setNotFound(0);
  }

  useEffect(() => {
    applicationStore.setIsShowMenuSideBar(true);
    getData();
  }, [sortSelect]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${event.target.value}`,
    });
  };

  const handleOpenSetDateModal = (
    name: string,
    id: string,
    startDate: string,
    event: any
  ) => {
    event.stopPropagation();
    setCurrentMatchCommitteeName(name);
    setCurrentMatchCommitteeId(id);
    setCurrentStartDate(startDate);
    setOpenStart(true);
  };

  const handleOpenCancelModal = (name: string, id: string, event: any) => {
    event.stopPropagation();
    setCurrentMatchCommitteeName(name);
    setCurrentMatchCommitteeId(id);
    setOpenCancel(true);
  };

  const handleCancelSubmit = async () => {
    const result = await disableMatchCommitteeInClass(
      classId,
      currentMatchCommitteeId as string
    );
    if (result.statusCode === 200) {
      getData();
    }
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
              flexDirection: "row",
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
              onClick={() => setOpenCreate(true)}
            >
              สร้าง
            </Button>
          </Box>

          <MatchCommitteeCreateModal
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            refresh={getData}
            id={null}
            name={""}
          />

          <MatchCommitteeStartModal
            open={openStart}
            onClose={() => setOpenStart(false)}
            refresh={getData}
            defaultStartDate={currentStartDate}
            matchCommitteeName={currentMatchCommitteeName}
            matchCommitteeId={currentMatchCommitteeId}
          />

          <CancelModal
            open={openCancel}
            onClose={() => setOpenCancel(false)}
            onSubmit={handleCancelSubmit}
            title={`ปิดการใช้งาน ${currentMatchCommitteeName}`}
            description="เมื่อปิดใช้งานแล้วนิสิตและที่ปรึกษาจะไม่เห็นรายการนี้ในคลาส"
          />

          <Box sx={{ flexDirection: "column", display: "flex" }}>
            {matchCommittee.map((c) => (
              <ListPreviewButton
                key={c._id}
                onClick={() => navigate(`/class/${classId}/committee/${c._id}`)}
                sx={{ zIndex: 1 }}
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
                  {c.name}
                </Typography>
                {!c.status ? (
                  <ActivateButton
                    sx={{
                      position: "absolute",
                      right: "calc(20px + 1vw)",
                      zIndex: 2,
                    }}
                    onClick={(event) =>
                      handleOpenSetDateModal(
                        c.name,
                        c._id,
                        moment(new Date()).format("YYYY-MM-DDTHH:mm"),
                        event
                      )
                    }
                  >
                    เปิดใช้งาน
                  </ActivateButton>
                ) : (
                  <></>
                )}
                {c.status ? (
                  <EditButton
                    sx={{
                      position: "absolute",
                      right: "calc(150px + 1vw)",
                      zIndex: 2,
                    }}
                    onClick={(event) =>
                      handleOpenSetDateModal(
                        c.name,
                        c._id,
                        c.startDate,
                        event
                      )
                    }
                  >
                    แก้ไข
                  </EditButton>
                ) : (
                  <></>
                )}
                {c.status ? (
                  <CancelButton
                    sx={{
                      position: "absolute",
                      right: "calc(20px + 1vw)",
                      zIndex: 2,
                    }}
                    onClick={(event) =>
                      handleOpenCancelModal(c.name, c._id, event)
                    }
                  >
                    ปิดใช้งาน
                  </CancelButton>
                ) : (
                  <></>
                )}
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
                  สร้างเมื่อ {moment(c.createdAt).format("DD/MM/YYYY HH:mm")} น.
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

export default MatchCommitteePreview;
