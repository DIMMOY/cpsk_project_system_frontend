import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Box, Grid, MenuItem, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, Table, TableBody, TableRow, TableCell, TableHead, Grow } from '@mui/material';
import { theme } from '../../styles/theme';
import { LoadingButton } from '@mui/lab';
import { createMatchCommitteeHasGroupInClass } from '../../utils/matchCommittee';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    advisors: Array<any>;
    ordGroup: number
    project: any;
  }

const AddCommitteeToProjectOnlyOne = ({ open, onClose, refresh, advisors, ordGroup, project }: DialogProps) => {
  const [checked, setChecked] = useState<Array<string>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];
  const committeeId = pathname[4];

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

  const handleClose = () => {
    onClose()
    setTimeout(() => {
        setChecked([])
    }, 100)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const res = await createMatchCommitteeHasGroupInClass(classId, committeeId, checked)
    if (res.statusCode !== 201) {
      console.error(res.message)
      setTimeout(() => {
        setLoading(false);
        setChecked([])
        onClose()
      }, 1300);
    } else {
      setTimeout(() => {
        setLoading(false);
        setChecked([])
        onClose()
        refresh()
      }, 1300);
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{ 
        style: { 
          backgroundColor: theme.color.background.default ,
          borderRadius: "20px",
        } 
      }}
      disableEnforceFocus
      disableScrollLock
      TransitionComponent={Grow}
    >
      <DialogTitle 
        sx={{ 
          fontSize: 40, 
          fontWeight: 500,
          color: theme.color.text.primary 
        }}
      >
          {`กลุ่มที่ ${ordGroup}`}
      </DialogTitle>
      <DialogContent sx={{height: "35rem", width: "30rem"}}>
          <Table>
            <TableHead>
              <TableRow>
                  <TableCell sx={{fontSize: 20, color: theme.color.text.secondary, width: "50%"}}>ชื่อ</TableCell>
                  <TableCell sx={{fontSize: 20, color: theme.color.text.secondary, width: "30%"}}>อีเมล</TableCell>
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
                  <TableCell sx={{fontSize: 16, color: theme.color.text.secondary}}>
                      {data.userId.displayName ? data.userId.displayName : "..."}
                  </TableCell>
                  <TableCell sx={{fontSize: 16, color: theme.color.text.secondary}}>
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
                          onChange={(event) => handleCheckboxChange(event.target.value)}
                          value={data.userId._id}
                      />
                  </TableCell>
              </TableRow>
              ))}
          </TableBody>
          </Table>
      </DialogContent>
      <DialogActions sx={{ padding: 2.5 }}>
      <Box sx={{display: "flex", justifyContent: "right"}}>
        <Button
          onClick={handleClose}
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
            "&:hover": { background: theme.color.button.default },
            "&:disabled": {
              background: theme.color.button.disable,
            },
          }}
          disabled={!checked.length}
        >
          ยืนยัน
        </LoadingButton>
      </Box>
      </DialogActions>
    </Dialog>
  );
}

export default AddCommitteeToProjectOnlyOne