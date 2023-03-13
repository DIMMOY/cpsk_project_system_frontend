import React, { ChangeEvent, useState, useEffect } from "react";
import { Box, Button, Grow, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { LoadingButton } from "@mui/lab";
import Modal from "@mui/material/Modal";
import { useMediaQuery } from "react-responsive";
import { createClass, updateClass } from "../../utils/class";
import { theme } from "../../styles/theme";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  currentClass: any;
}

const ClassCreateModal = ({
  open,
  onClose,
  refresh,
  currentClass,
}: ModalProps) => {
  const [majorSelect, setMajorSelect] = useState<string>("ALL");
  const [className, setClassName] = useState<string | null>(null);
  const [completeSelect, setCompleteSelect] = useState<string>("false");
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" });

  useEffect(() => {
    if (open) {
      if (currentClass) {
        setClassName(currentClass.name);
        setMajorSelect(currentClass.major);
        setCompleteSelect(currentClass.complete);
      } else {
        setClassName(null);
        setMajorSelect("ALL");
        setCompleteSelect("false");
      }
    }
  }, [open, currentClass]);

  const handleClassNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setClassName(event.target.value as string);
    setCanSubmit(event.target.value ? true : false);
  };

  const handleMajorSelectChange = (event: SelectChangeEvent) => {
    setMajorSelect(event.target.value as string);
    if (currentClass) setCanSubmit(true);
  };

  const handleCompleteSelectChange = (event: SelectChangeEvent) => {
    setCompleteSelect(event.target.value as string);
    if (currentClass) setCanSubmit(true);
  };

  const handleSubmitClass = async () => {
    setLoading(true);
    const reqBody = {
      name: className,
      endDate: completeSelect === "true" ? new Date() : null,
      complete: completeSelect === "true",
      major: majorSelect,
    };
    let res;
    if (!currentClass) {
      res = await createClass(reqBody);
      if (res.statusCode !== 201) {
        console.error(res.errorMsg);
        return;
      }
    } else {
      res = await updateClass(currentClass._id, reqBody);
      if (res.statusCode !== 200) {
        console.error(res.errorMsg);
        return;
      }
    }
    setTimeout(() => {
      onClose();
      refresh();
    }, 1000);
    setTimeout(() => {
      setClassName(null);
      setCanSubmit(false);
      setLoading(false);
      setMajorSelect("ALL");
    }, 1300);
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => {
      setClassName(null);
      setCanSubmit(false);
      setLoading(false);
      setMajorSelect("ALL");
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="class-title"
      aria-describedby="class-description"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
      disableEnforceFocus
      disableScrollLock
    >
      <Grow in={open}>
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            height: 350,
            width: "60vw",
            minWidth: 350,
            bgcolor: theme.color.background.default,
            borderRadius: "20px",
            boxShadow: 24,
            padding: "2rem 3rem 2rem 3rem",
            flexDirection: "column",
            transform: "translate(-50%, -50%)",
            "element.style": { transform: "none" },
          }}
        >
          <Typography
            id="class-title"
            sx={{
              fontSize: 40,
              fontWeight: 500,
              marginBottom: 2,
              color: theme.color.text.primary,
            }}
          >
            คลาส
          </Typography>
          <Typography
            id="class-description"
            sx={{
              fontSize: 20,
              fontWeight: 500,
              marginBottom: 1,
              color: theme.color.text.secondary,
            }}
          >
            ชื่อคลาส *
          </Typography>
          <TextField
            autoFocus
            required
            value={className}
            id="class-description"
            size="medium"
            fullWidth
            inputProps={{ maxLength: 50 }}
            sx={{
              "& fieldset": { border: "none" },
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
            onChange={handleClassNameChange}
          />
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ marginRight: "1.5rem" }}>
              <Typography
                id="class-description"
                sx={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginBottom: 1,
                  color: theme.color.text.secondary,
                }}
              >
                ภาค
              </Typography>
              <FormControl sx={{ marginBottom: 5 }}>
                <Select
                  labelId="select-class-label"
                  id="select-class"
                  value={majorSelect}
                  onChange={handleMajorSelectChange}
                  sx={{
                    borderRadius: "10px",
                    color: theme.color.text.primary,
                    height: "2.8rem",
                    fontWeight: 500,
                    width: isBigScreen ? 300 : "100%",
                    fontSize: 20,
                  }}
                >
                  <MenuItem value={"ALL"}>ทั้งหมด</MenuItem>
                  <MenuItem value={"CPE"}>วิศวกรรมคอมพิวเตอร์ (CPE)</MenuItem>
                  <MenuItem value={"SKE"}>วิศวกรรมซอฟต์แวร์ (SKE)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {currentClass ? (
              <Box>
                <Typography
                  id="class-description"
                  sx={{
                    fontSize: 20,
                    fontWeight: 500,
                    marginBottom: 1,
                    color: theme.color.text.secondary,
                  }}
                >
                  สถานะ
                </Typography>
                <FormControl sx={{ marginBottom: 5 }}>
                  <Select
                    labelId="select-class-label"
                    id="select-class"
                    value={completeSelect}
                    onChange={handleCompleteSelectChange}
                    sx={{
                      borderRadius: "10px",
                      color: theme.color.text.primary,
                      height: "2.8rem",
                      fontWeight: 500,
                      width: isBigScreen ? 150 : "100%",
                      fontSize: 20,
                    }}
                  >
                    <MenuItem value={"false"}>ดำเนินการ</MenuItem>
                    <MenuItem value={"true"}>เสร็จสิ้น</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <></>
            )}
          </Box>
          <Button
            onClick={handleCancel}
            sx={{
              width: "7rem",
              height: "2.8rem",
              fontSize: 20,
              background: theme.color.button.disable,
              borderRadius: "10px",
              color: theme.color.text.secondary,
              boxShadow: "none",
              textTransform: "none",
              transform: "translate(-50%, -50%)",
              position: "absolute",
              right: 130,
              bottom: 10,
              "&:hover": { background: theme.color.button.default },
            }}
          >
            ยกเลิก
          </Button>
          <LoadingButton
            onClick={handleSubmitClass}
            loading={loading}
            sx={{
              width: "7rem",
              height: "2.8rem",
              fontSize: 20,
              background: theme.color.button.disable,
              borderRadius: "10px",
              color: theme.color.text.primary,
              boxShadow: "none",
              textTransform: "none",
              transform: "translateY(-50%)",
              position: "absolute",
              right: "3rem",
              bottom: 10,
              "&:hover": { background: theme.color.button.default },
              "&:disabled": {
                background: theme.color.button.disable,
              },
            }}
            disabled={!canSubmit}
          >
            ยืนยัน
          </LoadingButton>
        </Box>
      </Grow>
    </Modal>
  );
};

export default ClassCreateModal;
