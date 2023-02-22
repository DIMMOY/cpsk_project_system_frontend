import React, { Component, SetStateAction, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Button,
  Typography,
  Link as LinkMUI,
  Divider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { fontFamily, fontWeight, Stack } from "@mui/system";
import { KeyObjectType } from "crypto";
import { padding } from "@mui/system/spacing";
import { Link, useLocation } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useMediaQuery } from "react-responsive";
import { CommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { theme } from "../../styles/theme";
import {
  deleteDocumentFromStudent,
  getDocumentFromStorage,
  uploadDocumentFromStudent,
} from "../../utils/storage";
import applicationStore from "../../stores/applicationStore";
import { LoadingButton } from "@mui/lab";
import {
  cancelSendDocument,
  getSendDocumentInClass,
  sendDocument,
} from "../../utils/document";
import moment from "moment";
import NotFound from "../other/NotFound";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  FullMetadata,
  StorageReference,
  getMetadata,
  getDownloadURL,
} from "firebase/storage";
import PDF from "../../assets/icons/PDF.png";
import Others from "../../assets/icons/Others.png";
import CancelModal from "../../components/Modal/CancelModal";

interface PreviewProps {
  isStudent?: boolean;
  id?: string;
  name?: string;
  dueDate?: string;
  status?: number;
  statusType?: string;
}

const DocumentDetail = ({ isStudent }: PreviewProps) => {
  const location = useLocation();
  const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" });
  const { currentRole, classroom, project } = applicationStore;
  const { success, warning, error, secondary } = theme.color.text;
  const statusList = [
    { color: error, message: "ยังไม่ส่ง" },
    { color: success, message: "ส่งแล้ว" },
    { color: warning, message: "ส่งช้า" },
    { color: secondary, message: "----" },
  ];

  const [files, setFiles] = useState<Array<any>>([]);
  const [metaDatas, setMetaDatas] = useState<Array<FullMetadata>>([]);
  const [downloadURL, setDownloadURL] = useState<Array<string>>([]);
  const [name, setName] = useState<string>("กำลังโหลด...");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("--/--/---- --:--");
  const [status, setStatus] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<number>(2);
  const [pathDocument, setPathDocument] = useState<Array<string>>([]);

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = isStudent ? classroom._id : pathname[2];
  const projectId = isStudent ? project._id : pathname[4];
  const documentId = isStudent ? pathname[2] : pathname[6];

  const getData = async (pathDocument: Array<string>) => {
    const result = await getSendDocumentInClass(classId, projectId, documentId);
    if (!result.data) {
      setNotFound(0);
    } else {
      if (result.data.pathDocument) await getFile();
      setName(result.data.document.name);
      setStatus(result.data.sendStatus);
      setDueDate(moment(result.data.endDate).format("DD/MM/YYYY HH:mm"));
      setDescription(result.data.document.description);
      setPathDocument(result.data.pathDocument);
      setSubmit(result.data.pathDocument || pathDocument.length !== 0);
      setNotFound(1);
    }
  };

  const getFile = async () => {
    const files = (await getDocumentFromStorage(
      projectId,
      documentId
    )) as StorageReference[];
    if (files && files.length) {
      // getMetadata
      const metadatas = await Promise.all(
        files.map((file) => getMetadata(file))
      );
      setMetaDatas(metadatas);

      const downloadURL = await Promise.all(
        files.map((file) => getDownloadURL(file))
      );
      setDownloadURL(downloadURL);

      setFiles(files);
    }
  };

  const handleAddFile = (e: any) => {
    setFiles([...files, ...Array.from(e.target.files)]);
    if ([...files, ...Array.from(e.target.files)].length) setSubmit(true);
  };

  const handleOnRemoveFile = (index: number) => {
    const removeFile = files.filter((_, i) => i !== index);
    setFiles(removeFile);
    if (!removeFile.length) setSubmit(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const pathDocument = await Promise.all(
      files.map((file) =>
        uploadDocumentFromStudent(file, projectId, documentId)
      )
    );
    const result = await sendDocument({ pathDocument }, projectId, documentId);
    if (result.statusCode === 200) {
      setTimeout(async () => {
        await getData([]);
        setLoading(false);
      }, 1300);
    }
  };

  const handleOnOpenModal = () => setOpen(true);
  const handleOnCloseModal = () => setOpen(false);

  const handleOnCancel = async () => {
    const result = await cancelSendDocument(projectId, documentId);
    if (result.statusCode === 200) {
      setFiles([]);
      await deleteDocumentFromStudent(projectId, documentId);
      await getData([]);
    }
  };

  useEffect(() => {
    window.history.replaceState({}, document.title);
    if (location.state) {
      setName(location.state.name);
      setDueDate(location.state.dueDate);
      setStatus(location.state.status);
      setPathDocument(location.state.pathDocument);
      setDescription(location.state.description);
      setSubmit(location.state.pathDocument.length !== 0);
      if (location.state.status) {
        getFile();
      }
      setNotFound(1);
    } else {
      getData([]);
    }
  }, []);

  if (notFound === 1) {
    return (
      <CommonPreviewContainer>
        <Box sx={{ display: "flex", padding: "0 auto" }}>
          <Link
            to={
              isStudent
                ? "/document"
                : currentPathName.slice(0, currentPathName.lastIndexOf("/"))
            }
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
        </Box>
        <Box
          sx={{
            position: "relative",
            borderRadius: "20px",
            background: theme.color.button.default,
            margin: "1.25rem 0 0 0",
            display: "flex",
            textTransform: "none",
            backgroundColor: theme.color.button.default,
            zIndex: "1",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              marginTop: "1.5rem",
              left: "calc(20px + 1vw)",
              position: "relative",
              fontSize: "calc(30px + 0.2vw)",
              fontFamily: "Prompt",
              fontWeight: 600,
              color: theme.color.text.primary,
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              top: isBigScreen ? "1.5rem" : "1.95rem",
              right: "calc(20px + 1vw)",
              position: "absolute",
              fontSize: isBigScreen ? "calc(30px + 0.2vw)" : "calc(15px + 2vw)",
              color: statusList[status].color,
              fontWeight: 600,
            }}
          >
            {statusList[status].message}
          </Typography>
          <Typography
            sx={{
              marginTop: "0.4rem",
              left: "calc(20px + 1vw)",
              position: "relative",
              fontSize: "calc(15px + 0.3vw)",
              color: theme.color.text.secondary,
              fontWeight: 600,
              marginBottom: description.length ? "1rem" : "2rem",
            }}
          >
            ภายในวันที่ {dueDate}
          </Typography>
          {description.length ? (
            <Divider
              sx={{
                margin: "0 2rem 0 2rem",
                color: theme.color.background.tertiary,
              }}
            />
          ) : (
            <></>
          )}
          {description.length ? (
            <Typography
              sx={{
                marginTop: "1rem",
                marginLeft: "calc(20px + 1vw)",
                position: "relative",
                fontSize: "calc(15px + 0.3vw)",
                color: theme.color.text.secondary,
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              {description}
            </Typography>
          ) : (
            <></>
          )}
        </Box>

        <Box
          sx={{
            top: "-5rem",
            position: "relative",
            background: theme.color.background.tertiary,
            borderRadius: "20px",
            padding: "7rem 2vw 2rem 2vw",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {files.map((file, index) => (
              <Box
                key={`file-${index}`}
                sx={{
                  margin: "1rem 1rem 1rem 1rem",
                  padding: "0.5rem",
                  background: theme.color.button.default,
                  borderRadius: "10px",
                  width: "12rem",
                  height: "10rem",
                  position: "relative",
                }}
              >
                {(
                  !status
                    ? file.type.startsWith("image/")
                    : metaDatas[index].contentType?.startsWith("image/")
                ) ? (
                  <img
                    style={{
                      width: "12rem",
                      height: "8rem",
                      borderRadius: "10px",
                    }}
                    src={
                      !status ? URL.createObjectURL(file) : downloadURL[index]
                    }
                    alt=""
                  />
                ) : (
                  <img
                    style={{
                      width: "8rem",
                      height: "8rem",
                      borderRadius: "10px",
                    }}
                    src={
                      (
                        !status
                          ? file.type.startsWith("application/pdf")
                          : metaDatas[index].contentType?.startsWith(
                              "application/pdf"
                            )
                      )
                        ? PDF
                        : Others
                    }
                    alt=""
                  />
                )}
                <Typography>
                  <LinkMUI
                    href={
                      !status ? URL.createObjectURL(file) : downloadURL[index]
                    }
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    sx={{
                      color: theme.color.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    {!status
                      ? file.name.length <= 20
                        ? file.name
                        : file.name.slice(0, 19) + "..."
                      : file.name.slice(0, file.name.lastIndexOf(" ")).length <=
                        20
                      ? file.name
                      : file.name.slice(0, 19) + "..."}
                  </LinkMUI>
                </Typography>
                {!status ? (
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "-1rem",
                      right: "-1rem",
                      zIndex: 2,
                    }}
                    onClick={() => handleOnRemoveFile(index)}
                  >
                    <RemoveCircleIcon
                      sx={{ fontSize: "125%", color: theme.color.button.error }}
                    />
                  </IconButton>
                ) : (
                  <></>
                )}
              </Box>
            ))}
            {isStudent && !status ? (
              <Box
                sx={{
                  margin: "1rem 1rem 1rem 1rem",
                  padding: "0.5rem",
                  width: "12rem",
                  height: "10rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{ width: "8rem", height: "8rem" }}
                  aria-label="upload"
                  component="label"
                >
                  <input
                    hidden
                    accept="*"
                    type="file"
                    multiple
                    onChange={handleAddFile}
                  />
                  <AddCircleIcon
                    sx={{
                      fontSize: "450%",
                      color: theme.color.background.secondary,
                    }}
                  />
                </IconButton>
              </Box>
            ) : (
              <></>
            )}
          </Box>

          {isStudent ? (
            <>
              <CancelModal
                open={open}
                onClose={handleOnCloseModal}
                onSubmit={handleOnCancel}
                title={`ยกเลิกการส่ง ${name}`}
                description="เมื่อยกเลิกแล้วไฟล์ที่อัปโหลดไว้จะหายหมด"
              />
              <LoadingButton
                loading={loading}
                sx={{
                  width: "7rem",
                  height: "2.8rem",
                  fontSize: 20,
                  textAlign: "center",
                  justifyContent: "center",
                  background: status
                    ? theme.color.button.error
                    : theme.color.button.primary,
                  borderRadius: "10px",
                  color: theme.color.text.default,
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": { background: status ? "#FF545E" : "#B07CFF" },
                  "&:disabled": {
                    backgroundColor: theme.color.button.disable,
                  },
                }}
                onClick={status ? handleOnOpenModal : handleSubmit}
                disabled={!submit}
              >
                {status ? "ยกเลิก" : "ยืนยัน"}
              </LoadingButton>
            </>
          ) : (
            <></>
          )}
        </Box>
      </CommonPreviewContainer>
    );
  } else if (notFound === 2) {
    return <CommonPreviewContainer />;
  } else {
    return <NotFound />;
  }
};

export default DocumentDetail;
