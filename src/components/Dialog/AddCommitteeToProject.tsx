import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Box, Grid, MenuItem, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, Table, TableBody, TableRow, TableCell, TableHead, Grow, Typography } from '@mui/material';
import { theme } from '../../styles/theme';
import { LoadingButton } from '@mui/lab';
import { createMatchCommitteeHasGroupInClass, createMatchCommitteeHasGroupToProject } from '../../utils/matchCommittee';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    matchCommitteeId: string;
    matchCommitteeHasGroup: any;
    projects: Array<any>;
    projectsInGroup: Array<any>;
    ordGroup: number
  }

const AddCommitteeToProject = ({ open, onClose, refresh, projects, ordGroup, matchCommitteeId, matchCommitteeHasGroup, projectsInGroup }: DialogProps) => {
  const [checked, setChecked] = useState<Array<string>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const currentPathName = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const pathname = currentPathName.split("/");
  const classId = pathname[2];
  const committeeId = pathname[4];

  const advisorIdInGroup = matchCommitteeHasGroup ? 
    matchCommitteeHasGroup.userId.map((user: any) => user._id) : 
    null
  
  const projectIdInGroup = projectsInGroup.map((project: any) => project._id);

  useEffect(() => {
    if (open) {
      setChecked(projectIdInGroup);
    }
  }, [open, projectsInGroup]);

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
    
    // find create and delete project in group
    const deleteProjectInGroup = projectIdInGroup.filter((id: string) => !checked.includes(id));
    const createProjectInGroup = checked.filter((id: string) => !projectIdInGroup.includes(id));
    
    const res = await createMatchCommitteeHasGroupToProject(
      classId, committeeId, matchCommitteeHasGroup._id, createProjectInGroup, deleteProjectInGroup);

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
      maxWidth="lg"
      fullWidth
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
      <DialogContent sx={{height: "35rem", width: "95%"}}>
          <Table>
            <TableHead>
              <TableRow>
                  <TableCell align="center" sx={{fontSize: 16, color: theme.color.text.secondary, width: "10%"}}>ลำดับ</TableCell>
                  <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "30%"}}>ชื่อโปรเจกต์ภาษาไทย</TableCell>
                  <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "20%"}}>นิสิต</TableCell>
                  <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "20%"}}>อาจารย์ที่ปรึกษา</TableCell>
                  <TableCell sx={{fontSize: 16, color: theme.color.text.secondary, width: "20%"}}>กรรมการคุมสอบ</TableCell>
                  <TableCell></TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
              {projects.map((data, index) => (
              <TableRow 
                key={data._id} 
                onClick={() => 
                  advisorIdInGroup && 
                    !data.advisor
                    .map((a: { _id: any; }) => a._id)
                    .filter((id: any) => advisorIdInGroup.includes(id)).length ? 
                  handleCheckboxChange(data._id) : 
                  {}
                }
                sx={{
                  "&:hover": { background: theme.color.button.default },
                  backgroundColor: advisorIdInGroup && 
                  !data.advisor
                  .map((a: { _id: any; }) => a._id)
                  .filter((id: any) => advisorIdInGroup.includes(id)).length ? 
                  "none" : theme.color.button.default
                }}
              >
                  <TableCell align="center">
                    <Typography 
                      sx={{fontSize: 16, color: theme.color.text.secondary}}
                    >
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                        sx={{fontSize: 16, color: theme.color.text.secondary}}
                    >
                      {data.nameTH}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {data.student.map((user: any) => (
                      <Typography
                        key={data._id + " " + user._id} 
                        sx={{fontSize: 16, color: theme.color.text.secondary}}
                      >
                        {user.displayName ? user.displayName : "..."}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    {data.advisor.map((user: any) => (
                      <Typography
                        key={data._id + " " + user._id} 
                        sx={{fontSize: 16, color: theme.color.text.secondary}}
                      >
                        {user.displayName ? user.displayName : "..."}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    {data.committee.map((user: any) => (
                      <Typography
                        key={data._id + " " + user._id} 
                        sx={{fontSize: 16, color: theme.color.text.secondary}}
                      >
                        {user.displayName ? user.displayName : "..."}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                      { advisorIdInGroup && 
                      !data.advisor
                      .map((a: { _id: any; }) => a._id)
                      .filter((id: any) => advisorIdInGroup.includes(id)).length ?
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
                      onChange={(event) => handleCheckboxChange(event.target.value)}
                      value={data._id}
                      // disabled
                    /> : <></>
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
          disabled={!checked.length}
        >
          ยืนยัน
        </LoadingButton>
      </Box>
      </DialogActions>
    </Dialog>
  );
}

export default AddCommitteeToProject