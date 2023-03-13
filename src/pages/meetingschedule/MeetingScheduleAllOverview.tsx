import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  TableContainer,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import Sidebar from "../../components/Sidebar/Sidebar";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import NotFound from "../other/NotFound";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  listMeetingScheduleInClass,
  listProjectSendMeetingScheduleInClass,
} from "../../utils/meetingSchedule";

const MeetingScheduleAllOverview = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole, classroom } = applicationStore;
  const { success, warning, error, secondary } = theme.color.text;
  const statusList = [
    { color: error, message: "ยังไม่ส่ง" },
    { color: success, message: "ส่งแล้ว" },
    { color: warning, message: "ส่งช้า" },
    { color: warning, message: "รอยืนยัน" },
    { color: secondary, message: "----" },
  ];

  const sortOptions = ["status", "nameTH"];
  const sortCheck =
    search.get("sort") &&
    sortOptions.find(
      (e) => search.get("sort")?.toLowerCase() == e.toLowerCase()
    )
      ? search.get("sort")
      : "nameTH";
  const [sortSelect, setSortSelect] = useState<string>(sortCheck || "nameTH");
  const [notFound, setNotFound] = useState<number>(2);

  const isBigScreen = useMediaQuery({ query: "(min-width: 900px)" });
  const [meetingSchedule, setMeetingSchedule] = useState<any>([]);
  const [meetingSchedules, setMeetingSchedules] = useState<any>([]);
  const [projects, setProjects] = useState<Array<any>>([]);
  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];

  const getData = async () => {
    const sendMeetingScheduletData =
      await listProjectSendMeetingScheduleInClass(null, classId, sortSelect);

    if (!sendMeetingScheduletData?.data) {
      setNotFound(0);
    } else {
      setMeetingSchedule(sendMeetingScheduletData.data.meetingSchedule);
      setProjects(sendMeetingScheduletData.data.project);
      setNotFound(1);
    }

    const meetingScheduleData = await listMeetingScheduleInClass(
      { sort: sortSelect, status: "true" },
      classId
    );

    if (!meetingScheduleData?.data) {
      setNotFound(0);
    } else {
      setMeetingSchedules(meetingScheduleData.data as Array<any>);
      setNotFound(1);
    }
  };

  useEffect(() => {
    // if (!applicationStore.classroom)
    applicationStore.setIsShowMenuSideBar(true);
    getData();
    setNotFound(1);
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
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <Link to={`/class/${classId}/meeting-schedule`}>
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

            <Typography
              sx={{
                color: theme.color.text.primary,
                fontSize: "calc(30px + 0.2vw)",
                fontWeight: 600,
              }}
            >
              ภาพรวม รายงานพบอาจารย์ที่ปรึกษา
            </Typography>
          </Box>

          <Box sx={{ maxWidth: "100%", overflowX: "auto", maxHeight: 700 }}>
            <Table stickyHeader>
              <TableHead>
                <TableCell
                  sx={{
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    fontWeight: 600,
                  }}
                >
                  โปรเจกต์
                </TableCell>
                {meetingSchedules.map((data: any) => (
                  <TableCell
                    key={data._id}
                    align="center"
                    sx={{
                      fontSize: 20,
                      color: theme.color.text.secondary,
                      fontWeight: 600,
                    }}
                  >
                    {data.name}
                  </TableCell>
                ))}
              </TableHead>
              <TableBody>
                {projects.map((data) => (
                  <TableRow
                    key={data._id}
                    sx={{
                      "&:hover": { background: theme.color.button.default },
                    }}
                    onClick={() =>
                      navigate(
                        `/class/${classId}/project/${
                          data._id as string
                        }/document`
                      )
                    }
                  >
                    <TableCell
                      sx={{
                        fontSize: 18,
                        color: theme.color.text.secondary,
                        fontWeight: 500,
                      }}
                    >
                      {data.nameTH}
                    </TableCell>
                    {meetingSchedules.map((mt: any) => (
                      <TableCell
                        key={data._id + mt._id}
                        align="center"
                        sx={{
                          fontSize: 20,
                          color: data.meetingSchedule.find(
                            (e: any) => e._id.toString() === mt._id.toString()
                          )
                            ? statusList[
                                data.meetingSchedule.find(
                                  (e: any) =>
                                    e._id.toString() === mt._id.toString()
                                ).sendStatus
                              ].color
                            : statusList[0].color,
                          fontWeight: 600,
                        }}
                      >
                        {data.meetingSchedule.find(
                          (e: any) => e._id.toString() === mt._id.toString()
                        )
                          ? statusList[
                              data.meetingSchedule.find(
                                (e: any) =>
                                  e._id.toString() === mt._id.toString()
                              ).sendStatus
                            ].message
                          : statusList[0].message}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
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
    return <NotFound />;
  }
});

export default MeetingScheduleAllOverview;
