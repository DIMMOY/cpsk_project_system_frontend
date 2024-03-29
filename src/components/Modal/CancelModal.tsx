import React, { ChangeEvent, useState } from "react";
import { Box, Button, Grow, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { LoadingButton } from "@mui/lab";
import Modal from "@mui/material/Modal";
import { useMediaQuery } from "react-responsive";
import { createClass } from "../../utils/class";
import { theme } from "../../styles/theme";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => any;
  title: string;
  description: string;
}

const CancelModal = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
}: ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" });

  const handleCancel = () => onClose();

  const handleOnSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      onSubmit();
      onClose();
      setLoading(false);
    }, 1300);
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="cancel-title"
      aria-describedby="cancel-description"
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
            width: "50vw",
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
            id="cancel-title"
            sx={{
              fontSize: 40,
              fontWeight: 500,
              marginBottom: 2,
              color: theme.color.text.primary,
            }}
          >
            {title}
          </Typography>
          <Typography
            id="cancel-description"
            sx={{
              fontSize: 20,
              fontWeight: 500,
              color: theme.color.text.secondary,
            }}
          >
            {description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: 5,
              justifyContent: "right",
            }}
          >
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
                "&:hover": { background: theme.color.button.default },
                marginRight: 2,
              }}
            >
              ยกเลิก
            </Button>
            <LoadingButton
              onClick={handleOnSubmit}
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
                "&:hover": { background: theme.color.button.default },
                "&:disabled": {
                  background: theme.color.button.disable,
                },
              }}
            >
              ยืนยัน
            </LoadingButton>
          </Box>
        </Box>
      </Grow>
    </Modal>
  );
};

export default CancelModal;
