import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import applicationStore from "../../stores/applicationStore";
import { theme } from "../../styles/theme";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { LoadingButton } from "@mui/lab";
import { createAssessment, updateAssessment } from "../../utils/assessment";

interface PreviewProps {
  newProject: boolean;
}

const ProjectEdit = ({ newProject }: PreviewProps) => {
  const { isAdmin, currentRole } = applicationStore;

  const location = useLocation();

  const [id, setId] = useState(null);
  const [nameTH, setNameTH] = useState<string>("");
  const [nameEN, setNameEN] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [scrollToBottom, setScrollToBottom] = useState<number>(0);
  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!newProject) {
      if (!location.state) {
        navigate("/assessment");
      } else {
      }
    }
  }, []);

  useEffect(() => {
    if (scrollToBottom) window.scrollTo(0, document.body.scrollHeight);
  }, [scrollToBottom]);

  const handleOnSubmit = async () => {
    setLoading(true);
    const reqBody = { name: nameTH, description };
    if (newProject) {
    } else {
      if (id) {
      } else {
        console.error("project id not found");
        setLoading(false);
        return;
      }
    }
    setTimeout(() => {
      setLoading(true);
      navigate("/");
    }, 1300);
  };

  const handleOnNameTHChange = (value: string) => {
    const regex = /^[\u0E00-\u0E7F 0-9(),.-]*$/;
    if (regex.test(value)) {
      setNameTH(value);
    }
  };

  const handleOnNameENChange = (value: string) => {
    const regex = /^[A-Za-z 0-9(),.-]*$/;
    if (regex.test(value)) {
      setNameEN(value);
    }
  };

  return (
    <AdminCommonPreviewContainer>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography
          sx={{
            fontSize: 45,
            fontWeight: 600,
            marginBottom: 1,
            color: theme.color.text.primary,
          }}
        >
          {"โปรเจกต์ ( * คือต้องใส่ )"}
        </Typography>

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 600,
            color: theme.color.text.secondary,
          }}
        >
          {"ชื่อโปรเจกต์ (ภาษาไทย)"}
        </Typography>

        <TextField
          required
          autoFocus
          placeholder="ปล่อยว่างไว้ก่อนได้"
          id="project-nameTH"
          size="medium"
          value={nameTH}
          inputProps={{ maxLength: 150 }}
          sx={{
            "& fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              padding: "0.25rem",
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => handleOnNameTHChange(e.target.value)}
        />

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 600,
            color: theme.color.text.secondary,
          }}
        >
          {"ชื่อโปรเจกต์ (ภาษาอังกฤษ)"}
        </Typography>

        <TextField
          required
          autoFocus
          placeholder="ปล่อยว่างไว้ก่อนได้"
          id="project-nameEN"
          size="medium"
          value={nameEN}
          inputProps={{ maxLength: 150 }}
          sx={{
            "& fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              padding: "0.25rem",
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => handleOnNameENChange(e.target.value)}
        />

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 600,
            color: theme.color.text.secondary,
          }}
        >
          {"คำอธิบายโปรเจกต์"}
        </Typography>

        <TextField
          multiline
          placeholder="รายละเอียดเกี่ยวกับโปรเจกต์"
          id="project-description"
          size="medium"
          value={description}
          maxRows={12}
          minRows={4}
          inputProps={{ maxLength: 1500, style: { padding: "0.25rem" } }}
          sx={{
            "& fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 600,
            color: theme.color.text.secondary,
          }}
        >
          {"นักศึกษาที่ทำโปรเจกต์ร่วม (ต้องเข้าคลาสมาก่อน)"}
        </Typography>

        <TextField
          required
          autoFocus
          id="project-partner"
          size="medium"
          value={nameTH}
          inputProps={{ maxLength: 150 }}
          sx={{
            "& fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              padding: "0.25rem",
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => handleOnNameTHChange(e.target.value)}
        />

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 600,
            color: theme.color.text.secondary,
          }}
        >
          {"อาจารย์ที่ปรึกษา *"}
        </Typography>

        <TextField
          required
          autoFocus
          id="project-advisor"
          size="medium"
          value={nameTH}
          inputProps={{ maxLength: 150 }}
          sx={{
            "& fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              padding: "0.25rem",
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => handleOnNameTHChange(e.target.value)}
        />

        <Box
          sx={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}
        >
          <LoadingButton
            loading={loading}
            sx={{
              width: "7rem",
              height: "2.8rem",
              fontSize: 20,
              background: theme.color.button.primary,
              borderRadius: "10px",
              color: theme.color.text.default,
              boxShadow: "none",
              textTransform: "none",
              "&:hover": { background: "#B07CFF" },
              "&:disabled": {
                backgroundColor: theme.color.button.disable,
              },
            }}
            onClick={handleOnSubmit}
            disabled={false}
          >
            ยืนยัน
          </LoadingButton>
        </Box>
      </Box>
    </AdminCommonPreviewContainer>
  );
};

export default ProjectEdit;
