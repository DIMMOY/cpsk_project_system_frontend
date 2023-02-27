import React, { useState } from "react";
import { Box, Button, Grow, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Modal from "@mui/material/Modal";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { theme } from "../../styles/theme";
import { setDateMatchCommittee } from "../../utils/matchCommittee";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  matchCommitteeName: string | null;
  matchCommitteeId: string | null;
  defaultStartDate: string | null;
}

const MatchCommitteeStartModal = ({
  open,
  matchCommitteeName,
  onClose,
  matchCommitteeId,
  refresh,
  defaultStartDate,
}: ModalProps) => {
  const currentDate = new Date();
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const isBigScreen = useMediaQuery({ query: "(min-width: 600px)" });

  const handleStartDateChange = (newDate: string | null) => {
    const date = newDate ? moment(newDate).format("YYYY-MM-DDTHH:mm") : null;
    setStartDate(date);
    setCanSubmit(true);
  };

  const handleSetDate = async () => {
    setLoading(true);
    const reqBody = {
      classId: window.location.pathname.split("/")[2],
      matchCommitteeId,
      startDate,
    };
    const res = await setDateMatchCommittee(reqBody);
    if (res.statusCode !== 200) {
      console.error(res.errorMsg);
    }
    setTimeout(() => {
      onClose();
      refresh();
    }, 1000);
    setTimeout(() => {
      setStartDate(
        moment(defaultStartDate ? defaultStartDate : new Date()).format(
          "YYYY-MM-DDTHH:mm"
        )
      );
      setCanSubmit(false);
      setLoading(false);
    }, 1300);
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => {
      setStartDate(
        moment(defaultStartDate ? defaultStartDate : new Date()).format(
          "YYYY-MM-DDTHH:mm"
        )
      );
      setCanSubmit(false);
      setLoading(false);
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="match-committee-title"
      aria-describedby="match-committee-description"
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
            width: "40vw",
            minWidth: 350,
            backgroundColor: theme.color.background.default,
            borderRadius: "20px",
            boxShadow: 24,
            padding: "2rem 3rem 2rem 3rem",
            flexDirection: "column",
            transform: "translate(-50%, -50%)",
            "element.style": { transform: "none" },
          }}
        >
          <Typography
            id="match-committee-title"
            sx={{
              fontSize: 40,
              fontWeight: 500,
              marginBottom: 5,
              color: theme.color.text.primary,
            }}
          >
            เปิดใช้งาน {matchCommitteeName}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <TextField
              id="start-datetime-local"
              label="เวลาเริ่มต้น"
              type="datetime-local"
              defaultValue={moment(
                defaultStartDate ? defaultStartDate : currentDate
              ).format("YYYY-MM-DDTHH:mm")}
              sx={{ width: 250, marginRight: 4 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </Box>
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
              onClick={handleSetDate}
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
              disabled={!canSubmit}
            >
              ยืนยัน
            </LoadingButton>
          </Box>
        </Box>
      </Grow>
    </Modal>
  );
};

export default MatchCommitteeStartModal;
