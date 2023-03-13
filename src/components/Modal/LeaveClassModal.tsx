import React, { ChangeEvent, useState } from "react";
import { Box, Button, Grow, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Modal from "@mui/material/Modal";
import { theme } from "../../styles/theme";
import applicationStore from "../../stores/applicationStore";
import { useNavigate } from "react-router";
import { leaveClass } from "../../utils/class";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const LeaveClassModal = ({ open, onClose }: ModalProps) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { classroom } = applicationStore;
  const navigate = useNavigate();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(event.target.value as string);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await leaveClass(classroom._id);
    if (res.statusCode !== 200) {
      console.error(res.error);
    } else {
      applicationStore.setClassroom(null);
    }
    setTimeout(() => {
      onClose();
      navigate("/");
    }, 1000);
    setTimeout(() => {
      setText("");
      setLoading(false);
    }, 1300);
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => {
      setText("");
      setLoading(false);
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="leave-class-title"
      aria-describedby="leave-class-description"
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
            id="leave-class-title"
            sx={{
              fontSize: 40,
              fontWeight: 500,
              marginBottom: 2,
              color: theme.color.text.primary,
            }}
          >
            ออกจากคลาสปัจจุบัน
          </Typography>
          <Typography
            id="leave-class-description"
            sx={{
              fontSize: 20,
              fontWeight: 500,
              marginBottom: 1,
              color: theme.color.text.secondary,
            }}
          >
            {`พิมพ์ "${classroom.name as string}" เพื่อยืนยันการออก`}
          </Typography>
          <TextField
            autoFocus
            required
            id="leave-class-description"
            size="medium"
            fullWidth
            inputProps={{
              maxLength: 50,
            }}
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
            onChange={handleChange}
          />
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
            onClick={handleSubmit}
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
            disabled={text !== classroom.name}
          >
            ยืนยัน
          </LoadingButton>
        </Box>
      </Grow>
    </Modal>
  );
};

export default LeaveClassModal;
