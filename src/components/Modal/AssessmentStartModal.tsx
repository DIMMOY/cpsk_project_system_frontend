import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grow,
  TextField,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Modal from "@mui/material/Modal";
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { theme } from "../../styles/theme";
import { setDateAssessment } from "../../utils/assessment";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  assessmentName: string | null;
  assessment: any;
  matchCommittee: Array<any>;
  defaultStartDate: string | null;
  defaultEndDate: string | null;
}

const AssessmentStartModal = ({
  open,
  assessmentName,
  onClose,
  assessment,
  matchCommittee,
  refresh,
  defaultStartDate,
  defaultEndDate,
}: ModalProps) => {
  const currentDate = new Date();
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checked, setChecked] = useState<Array<string>>([]);
  const isBigScreen = useMediaQuery({ query: "(min-width: 900px)" });

  const handleStartDateChange = (newDate: string | null) => {
    const date = newDate ? moment(newDate).format("YYYY-MM-DDTHH:mm") : null;
    setStartDate(date);
    if (defaultEndDate && !endDate)
      setEndDate(moment(defaultEndDate).format("YYYY-MM-DDTHH:mm"));
    setCanSubmit(date && (defaultEndDate || endDate) ? true : false);
  };

  const handleEndDateChange = (newDate: string | null) => {
    const date = newDate ? moment(newDate).format("YYYY-MM-DDTHH:mm") : null;
    if (defaultStartDate && !startDate)
      setStartDate(moment(defaultStartDate).format("YYYY-MM-DDTHH:mm"));
    setEndDate(date);
    setCanSubmit(date ? true : false);
  };

  const handleCheckboxChange = (value: string) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    if (defaultEndDate && !endDate)
      setEndDate(moment(defaultEndDate).format("YYYY-MM-DDTHH:mm"));

    if (defaultStartDate && !startDate)
      setStartDate(moment(defaultStartDate).format("YYYY-MM-DDTHH:mm"));

    setCanSubmit(
      (defaultEndDate && defaultStartDate) || (startDate && endDate)
        ? true
        : false
    );

    setChecked(newChecked);
  };

  const handleSetDate = async () => {
    setLoading(true);
    const reqBody = {
      classId: window.location.pathname.split("/")[2],
      assessmentId: assessment._id,
      startDate,
      endDate,
      matchCommitteeId: checked,
    };
    const res = await setDateAssessment(reqBody);
    if (res.statusCode !== 200) {
      console.error(res.errorMsg);
    }
    setTimeout(() => {
      onClose();
      refresh();
    }, 1000);
    setTimeout(() => {
      setStartDate(null);
      setEndDate(null);
      setCanSubmit(false);
      setLoading(false);
      setChecked([]);
    }, 1300);
  };

  const handleCancel = () => {
    onClose();
    setTimeout(() => {
      setStartDate(null);
      setEndDate(null);
      setCanSubmit(false);
      setLoading(false);
      setChecked([]);
    }, 300);
  };

  useEffect(() => {
    if (open)
      setChecked(
        assessment
          ? assessment.matchCommitteeId
            ? assessment.matchCommitteeId
            : []
          : []
      );
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="assessment-title"
      aria-describedby="assessment-description"
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
            id="assessment-title"
            sx={{
              fontSize: 40,
              fontWeight: 500,
              marginBottom: 5,
              color: theme.color.text.primary,
            }}
          >
            เปิดใช้งาน {assessmentName}
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
            <TextField
              id="end-datetime-local"
              label="เวลาสิ้นสุด"
              type="datetime-local"
              defaultValue={
                defaultEndDate
                  ? moment(defaultEndDate).format("YYYY-MM-DDTHH:mm")
                  : null
              }
              sx={{ width: 250 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleEndDateChange(e.target.value)}
            />
          </Box>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 500,
              marginTop: "2rem",
              color: theme.color.text.secondary,
            }}
          >
            {`ประเมินโดย ${
              assessment && assessment.assessBy === 0
                ? "อาจารย์ที่ปรึกษาและกรรมการคุมสอบ"
                : assessment && assessment.assessBy === 1
                ? "อาจารย์ที่ปรึกษา"
                : "กรรมการคุมสอบ"
            }`}
          </Typography>
          {assessment && assessment.assessBy !== 1 ? (
            <Box sx={{ marginTop: "1.5rem" }}>
              <Typography
                sx={{
                  fontSize: 20,
                  color: theme.color.text.secondary,
                  fontWeight: 500,
                }}
              >
                กลุ่มกรรมการคุมสอบที่ให้ประเมิน
              </Typography>
              <Box
                sx={{
                  width: isBigScreen ? "50%" : "100%",
                  maxHeight: "20rem",
                  overflow: "auto",
                }}
              >
                <Table>
                  <TableHead>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: 16,
                        color: theme.color.text.secondary,
                        width: "20%",
                      }}
                    >
                      ลำดับ
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 16,
                        color: theme.color.text.secondary,
                        width: "70%",
                      }}
                    >
                      ชื่อรายการ
                    </TableCell>
                    <TableCell></TableCell>
                  </TableHead>
                  <TableBody>
                    {matchCommittee.map((data: any, index: number) => (
                      <TableRow
                        key={data._id}
                        onClick={() => handleCheckboxChange(data._id)}
                        sx={{
                          "&:hover": { background: theme.color.button.default },
                        }}
                      >
                        <TableCell
                          align="center"
                          sx={{
                            fontSize: 16,
                            color: theme.color.text.secondary,
                            width: "10%",
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 16,
                            color: theme.color.text.secondary,
                            width: "10%",
                          }}
                        >
                          {data.name}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            sx={{
                              padding: 0,
                              boxShadow: "none",
                              color: theme.color.background.secondary,
                              "&.Mui-checked": {
                                color: theme.color.background.secondary,
                              },
                              "& .MuiSvgIcon-root": { fontSize: 28 },
                            }}
                            checked={checked.indexOf(data._id) !== -1}
                            onChange={(event) =>
                              handleCheckboxChange(event.target.value)
                            }
                            value={data._id}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          ) : (
            <></>
          )}
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

export default AssessmentStartModal;
