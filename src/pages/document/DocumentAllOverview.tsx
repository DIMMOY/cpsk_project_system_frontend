import React, { useEffect, useState } from "react";
import { Box, IconButton, SelectChangeEvent, Table, TableBody, TableCell, TableHead, TableRow, Typography, MenuItem, InputLabel, FormControl, Select } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  listDocumentInClass,
  listProjectSendDocumentInClass,
} from "../../utils/document";
import { theme } from "../../styles/theme";
import { observer } from "mobx-react";
import NotFound from "../other/NotFound";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const DocumentAllOverview = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole, classroom } = applicationStore;
  const { success, warning, error, secondary } = theme.color.text;
  const statusList = [
    { color: error, message: "ยังไม่ส่ง" },
    { color: success, message: "ส่งแล้ว" },
    { color: warning, message: "ส่งช้า" },
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
  const [sortSelect, setSortSelect] = useState<string>(
    sortCheck || "nameTH"
  );
  const [notFound, setNotFound] = useState<number>(2);

  const isBigScreen = useMediaQuery({ query: "(min-width: 900px)" });
  const [document, setDocument] = useState<any>([]);
  const [projects, setProjects] = useState<Array<any>>([]);
  const [documents, setDocuments] = useState<Array<any>>([]);

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];

  const getData = async () => {
    const sendDocumentData = await listProjectSendDocumentInClass(null, classId, sortSelect);

    if (!sendDocumentData?.data) {
      setNotFound(0);
    } else {
      setDocument(sendDocumentData.data.document);
      setProjects(sendDocumentData.data.project);
      setNotFound(1);
    }

    const documentData = await listDocumentInClass(
      { sort: sortSelect, status: "true" },
      classId
    );

    if (!documentData?.data) {
      setNotFound(0);
    } else {
      setDocuments(documentData.data as Array<any>);
      setNotFound(1);
    }
  };

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


  if (notFound === 1) {
    return (
      <AdminCommonPreviewContainer>
        <Sidebar />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Box sx={{ display: "flex", padding: "0 auto", alignItems: "center", marginBottom: "1.25rem" }}>
            <Link
              to={`/class/${classId}/document`}
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
              ภาพรวม เอกสาร
            </Typography>
          </Box>

          <Box sx={{ maxWidth: isBigScreen ? "80%" : "100%", overflowX: "auto", maxHeight: 700 }}>
            <Table stickyHeader>
              <TableHead>
                <TableCell sx={{fontSize: 20, color: theme.color.text.secondary, width: 300, fontWeight: 600}}>โปรเจกต์</TableCell>
                {
                  documents.map((data: any) => (
                    <TableCell 
                      key={data._id} 
                      align="center" 
                      sx={{fontSize: 20, color: theme.color.text.secondary, width: 100, fontWeight: 600}}
                    >
                      {data.name}
                    </TableCell>
                  ))
                }
              </TableHead>
              <TableBody>
                {
                  projects.map((data) => (
                    <TableRow 
                      key={data._id}
                      sx={{
                        "&:hover": { background: theme.color.button.default },
                      }}
                      onClick={() => navigate(`/class/${classId}/project/${data._id as string}/document`)}
                    >
                      <TableCell sx={{fontSize: 18, color: theme.color.text.secondary, fontWeight: 500}}>
                        {data.nameTH}
                      </TableCell>
                      {
                        documents.map((document) => (
                          <TableCell 
                            key={data._id + document._id} 
                            align="center" 
                            sx={{
                              fontSize: 20, 
                              color: data.document.find((e: any) => e._id.toString() === document._id.toString()) ? 
                                statusList[data.document.find((e: any) => e._id.toString() === document._id.toString()).sendStatus].color : 
                                statusList[0].color, 
                              fontWeight: 600
                            }}>
                            {data.document.find((e: any) => e._id.toString() === document._id.toString()) ? 
                              statusList[data.document.find((e: any) => e._id.toString() === document._id.toString()).sendStatus].message : 
                              statusList[0].message
                            }
                          </TableCell>
                        ))
                      }
                    </TableRow>
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
    return <NotFound />;
  }
});

export default DocumentAllOverview;
