import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Grow,
  Typography,
} from "@mui/material";
import { theme } from "../../styles/theme";
import applicationStore from "../../stores/applicationStore";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  submit: (advisors: Array<any>) => void;
  advisors: Array<any>;
  selectedAdvisors: Array<any>;
}

const SelectAdvisorToProjectDialog = ({
  open,
  onClose,
  advisors,
  submit,
  selectedAdvisors,
}: DialogProps) => {
  const [checked, setChecked] = useState<Array<string>>([]);

  const handleCheckboxChange = (value: string) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSubmit = () => {
    submit(checked);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (open) setChecked(selectedAdvisors);
  }, [open, selectedAdvisors]);

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{
        style: {
          backgroundColor: theme.color.background.default,
          borderRadius: "20px",
        },
      }}
      disableEnforceFocus
      disableScrollLock
      TransitionComponent={Grow}
    >
      <DialogTitle
        sx={{
          fontSize: 40,
          fontWeight: 500,
          color: theme.color.text.primary,
        }}
      >
        {`อาจารย์ที่ปรึกษา`}
      </DialogTitle>
      <DialogContent sx={{ height: "35rem", width: "30rem" }}>
        {advisors.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    width: "50%",
                  }}
                >
                  ชื่อ
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    width: "30%",
                  }}
                >
                  อีเมล
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {advisors.map((data) => (
                <TableRow
                  key={data._id}
                  onClick={() => handleCheckboxChange(data.userId._id)}
                  sx={{
                    "&:hover": { background: theme.color.button.default },
                  }}
                >
                  <TableCell
                    sx={{ fontSize: 16, color: theme.color.text.secondary }}
                  >
                    {data.userId.displayName ? data.userId.displayName : "..."}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 16, color: theme.color.text.secondary }}
                  >
                    {data.userId.email}
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
                      checked={checked.indexOf(data.userId._id) !== -1}
                      onChange={(event) =>
                        handleCheckboxChange(event.target.value)
                      }
                      value={data.userId._id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography
            sx={{
              color: theme.color.text.secondary,
              fontSize: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            ไม่พบอาจารย์ที่ปรึกษา
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
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
          <Button
            onClick={handleSubmit}
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
            disabled={!checked.length}
          >
            ยืนยัน
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SelectAdvisorToProjectDialog;
