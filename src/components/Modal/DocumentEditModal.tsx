import React, { ChangeEvent, useState, useEffect } from "react";
import { Box, Button, Grow, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Modal from "@mui/material/Modal";
import { useMediaQuery } from "react-responsive";
import { createDocument, updateDocument } from "../../utils/document";
import { theme } from "../../styles/theme";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  id: string | null;
  name: string;
  description: string;
}

const DocumentEditModal = ({
  open,
  onClose,
  refresh,
  id,
  name,
  description,
}: ModalProps) => {
  const [documentName, setDocumentName] = useState<string>("");
  const [documentDescription, setDocumentDescription] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [isNameChange, setIsNameChange] = useState<boolean>(false);
  const [isDescriptionChange, setIsDescriptionChange] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" });

  const handleDocumentNameChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (
      event.target.value.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, "") == ""
    )
      setSubmit(false);
    else {
      setSubmit(true);
      setDocumentName(event.target.value as string);
      setIsNameChange(true);
    }
  };

  const handleDescriptionChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDocumentDescription(event.target.value as string);
    setIsDescriptionChange(true);
    if (id) setSubmit(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const reqBody = { name: documentName, description: documentDescription };
    if (!id) {
      const res = await createDocument(reqBody);
      if (res.statusCode !== 201) {
        console.error(res.errorMsg);
      }
    } else {
      if (!isDescriptionChange) reqBody.description = description;
      if (!isNameChange) reqBody.name = name;
      const res = await updateDocument(id, reqBody);
      if (res.statusCode !== 200) {
        console.error(res.errorMsg);
      }
    }
    setTimeout(() => {
      onClose();
      refresh();
    }, 1000);
    setTimeout(() => {
      setDocumentName("");
      setDocumentDescription("");
      setSubmit(false);
      setLoading(false);
    }, 1300);
  };

  const handleOnCancel = () => {
    onClose();
    setTimeout(() => {
      setDocumentName("");
      setDocumentDescription("");
      setSubmit(false);
      setLoading(false);
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={handleOnCancel}
      aria-labelledby="document-title"
      aria-describedby="document-description"
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
            height: 500,
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
            id="document-title"
            sx={{
              fontSize: 40,
              fontWeight: 500,
              marginBottom: 2,
              color: theme.color.text.primary,
            }}
          >
            รายการส่งเอกสาร
          </Typography>
          <Typography
            id="document-name"
            sx={{
              fontSize: 20,
              fontWeight: 500,
              marginBottom: 1,
              color: theme.color.text.secondary,
            }}
          >
            ชื่อรายการ *
          </Typography>
          <TextField
            autoFocus
            required
            id="document-name-textfield"
            size="medium"
            fullWidth
            defaultValue={name}
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
            onChange={handleDocumentNameChange}
          />
          <Typography
            id="document-description"
            sx={{
              fontSize: 20,
              fontWeight: 500,
              marginBottom: 1,
              color: theme.color.text.secondary,
            }}
          >
            คำอธิบาย
          </Typography>
          <TextField
            autoFocus
            id="document-description-textfield"
            fullWidth
            multiline
            maxRows={4}
            minRows={4}
            size="medium"
            defaultValue={description}
            inputProps={{ style: { padding: "0.25rem" } }}
            sx={{
              "& fieldset": { border: "none" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.color.button.default,
                borderRadius: "10px",
                fontSize: 20,
                color: theme.color.text.secondary,
                fontWeight: 500,
                marginBottom: 2,
              },
            }}
            onChange={handleDescriptionChange}
          />
          <Button
            onClick={handleOnCancel}
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
              "&:hover": { background: theme.color.button.disable },
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
                backgroundColor: theme.color.button.disable,
              },
            }}
            disabled={!submit}
          >
            ยืนยัน
          </LoadingButton>
        </Box>
      </Grow>
    </Modal>
  );
};

export default DocumentEditModal;
