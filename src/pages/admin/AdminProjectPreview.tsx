import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import AddIcon from "@mui/icons-material/Add";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import applicationStore from "../../stores/applicationStore";
import { theme } from "../../styles/theme";

const exampleDocument = [
  {
    id: 1,
    name: "CPE33",
    dueDate: "2022-10-20 23:59",
    status: 0,
    statusType: "ดำเนินการ",
  },
  {
    id: 2,
    name: "SKE17",
    dueDate: "2022-10-18 23:59",
    status: 1,
    statusType: "เสร็จสิ้น",
  },
  {
    id: 3,
    name: "CPE32",
    dueDate: "2022-10-13 23:59",
    status: 1,
    statusType: "เสร็จสิ้น",
  },
  {
    id: 4,
    name: "CPE31",
    dueDate: "2022-10-13 23:59",
    status: 1,
    statusType: "เสร็จสิ้น",
  },
  {
    id: 5,
    name: "CPE30",
    dueDate: "2022-10-13 23:59",
    status: 1,
    statusType: "เสร็จสิ้น",
  },
];

export default function AdminProjectPreview() {
  const [classSelect, setClassSelect] = useState("2");
  const [sortSelect, setSortSelect] = useState("createdAtDESC");
  const { isAdmin } = applicationStore;

  const handleSelectChange = (event: SelectChangeEvent) => {
    setClassSelect(event.target.value as string);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
  };

  return (
    <AdminCommonPreviewContainer>
      <Box
        sx={{
          display: "flex",
          padding: "0 auto",
          maxWidth: 700,
          margin: "1.25rem 0 1.25rem 0",
        }}
      >
        <FormControl sx={{ marginRight: "1rem" }}>
          <InputLabel id="select-class-label">คลาส</InputLabel>
          <Select
            labelId="select-class-label"
            id="select-class"
            value={classSelect}
            onChange={handleSelectChange}
            label="คลาส"
            sx={{
              borderRadius: "10px",
              color: "#ad68ff",
              height: 45,
              fontWeight: 500,
              width: 120,
            }}
          >
            <MenuItem value={2}>ทั้งหมด</MenuItem>
            <MenuItem value={1}>ดำเนินการ</MenuItem>
            <MenuItem value={0}>เสร็จสิ้น</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ marginRight: "1rem" }}>
          <InputLabel id="select-sort-label">จัดเรียงโดย</InputLabel>
          <Select
            labelId="select-sort-label"
            id="select-sort"
            value={sortSelect}
            onChange={handleSortChange}
            label="จัดเรียงโดย"
            sx={{
              borderRadius: "10px",
              color: "#ad68ff",
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
        {isAdmin ? (
          <Button
            sx={{
              background: "#ad68ff",
              borderRadius: "10px",
              color: "#FFFFFF",
              boxShadow: "none",
              textTransform: "none",
              "&:hover": { background: "#ad68ff" },
              height: 45,
              weight: 45,
              fontSize: 15,
              padding: 1,
            }}
            startIcon={<AddIcon sx={{ width: 22, height: 22 }}></AddIcon>}
          >
            สร้างคลาส
          </Button>
        ) : (
          <></>
        )}
      </Box>
      <Box sx={{ flexDirection: "column", display: "flex" }}>
        {exampleDocument.map((document) => (
          <Button
            key={document.id}
            className="ml-96 common-preview-button"
            sx={{
              position: "relative",
              borderRadius: "20px",
              background: "#F3F3F3",
              margin: "1.25rem 0 1.25rem 0",
              display: "flex",
              textTransform: "none",
            }}
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
              }}
            >
              {document.name}
            </Typography>
            <Typography
              sx={{
                top: "1.5rem",
                right: "calc(20px + 1vw)",
                position: "absolute",
                fontSize: "calc(30px + 0.2vw)",
                color: "#686868",
                fontWeight: 600,
              }}
            >
              {document.statusType}
            </Typography>
            <Typography
              sx={{
                top: "5rem",
                left: "calc(20px + 1vw)",
                position: "absolute",
                fontSize: "calc(15px + 0.3vw)",
                color: "#686868",
                fontWeight: 600,
              }}
            >
              สร้างเมื่อ {document.dueDate} น.
            </Typography>
          </Button>
        ))}
      </Box>
    </AdminCommonPreviewContainer>
  );
}
