import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, Table, TableBody, TableRow, TableCell, TableHead, Grow, Typography, Radio } from '@mui/material';
import { theme } from '../../styles/theme';
import { LoadingButton } from '@mui/lab';
import { createMatchCommitteeHasGroupToProject } from '../../utils/matchCommittee';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    committee: Array<any>;
    project: any;
    ordGroup: number
  }

const AddCommitteeToProjectOnlyOne = ({ open, onClose, refresh, committee, ordGroup, project }: DialogProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);


  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];
  const committeeId = pathname[4];

  useEffect(() => {
    if (open) {
      setSelectedId(project.committeeGroupId ? project.committeeGroupId._id : null);
    }
  }, [open, project]);

  const handleChange = (id: string) => {
    setSelectedId(id);
  };

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSelectedId(null)
    }, 100)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const res = await createMatchCommitteeHasGroupToProject(classId, committeeId, selectedId as string, [project._id], [])
    if (res.statusCode !== 201) {
      console.error(res.message)
      setTimeout(() => {
        setLoading(false);
        setSelectedId(null)
        onClose()
      }, 500);
    } else {
      setTimeout(() => {
        setLoading(false);
        setSelectedId(null)
        onClose()
        refresh()
      }, 500);
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
          {`โปรเจกต์ที่ ${ordGroup}`}
      </DialogTitle>
      <DialogContent sx={{height: "35rem", width: "30rem"}}>
          <Table>
            <TableHead>
              <TableRow>
                  <TableCell align="center" sx={{fontSize: 20, color: theme.color.text.secondary, width: "20%"}}>ลำดับ</TableCell>
                  <TableCell sx={{fontSize: 20, color: theme.color.text.secondary, width: "70%"}}>รายชื่อกรรมการคุมสอบ</TableCell>
                  <TableCell></TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
              {committee.map((data, index) => (
              <TableRow 
                key={data._id} 
                onClick={() =>
                  project && 
                  !project.advisor
                    .map((a: any) => a._id)
                    .filter((id: any) => data.userId.map((a: any) => a._id).includes(id)).length ? 
                  handleChange(data._id) : 
                  {}
                }
                sx={{
                  "&:hover": { background: theme.color.button.default },
                  backgroundColor: project && 
                    !project.advisor
                      .map((a: any) => a._id)
                      .filter((id: any) => data.userId.map((a: any) => a._id).includes(id)).length ? 
                      "none" : theme.color.button.default
                }}
              >
                  <TableCell align="center" sx={{fontSize: 16, color: theme.color.text.secondary}}>
                      {index + 1}
                  </TableCell>
                  <TableCell>
                    {data.userId.map((user: any) => (
                      <Typography
                        key={data._id + " " + user._id} 
                        sx={{fontSize: 16, color: theme.color.text.secondary}}
                      >
                        {user.displayName ? user.displayName : "..."}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    { project && 
                      !project.advisor
                        .map((a: any) => a._id)
                        .filter((id: any) => data.userId.map((a: any) => a._id).includes(id)).length ?
                      <Radio
                        sx={{
                            padding: 0,
                            boxShadow: "none",
                            color: theme.color.background.secondary,
                            "&.Mui-checked": {
                                color: theme.color.background.secondary,
                            },
                            "& .MuiSvgIcon-root": { fontSize: 28 },
                        }}
                        checked={selectedId === data._id}
                        onChange={() => handleChange(data._id)}
                        value={data._id}
                      /> : 
                      <></>
                    }
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
          disabled={!selectedId}
        >
          ยืนยัน
        </LoadingButton>
      </Box>
      </DialogActions>
    </Dialog>
  );
}

export default AddCommitteeToProjectOnlyOne