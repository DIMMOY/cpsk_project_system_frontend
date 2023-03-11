import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, Table, TableBody, TableRow, TableCell, TableHead, Grow, Typography } from '@mui/material';
import { theme } from '../../styles/theme';
import applicationStore from '../../stores/applicationStore';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    submit: (advisors: Array<any>) => void;
    assessment: any;
    score: Array<number>;
    selectedStudents: Array<any>;
}

const ShowScoreDialog = ({ open, onClose, assessment, submit, selectedStudents }: DialogProps) => {
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

  useEffect(() => {
    if (open)
      setChecked(selectedStudents)
  }, [open, selectedStudents])

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
          {`นิสิตที่ทำโปรเจกต์ร่วม`}
      </DialogTitle>
      <DialogContent sx={{height: "35rem", width: "30rem"}}>
        { assessment.length ? 
          <Table>
            <TableHead>
              <TableRow>
                  <TableCell sx={{fontSize: 20, color: theme.color.text.secondary, width: "50%"}}>ข้อ</TableCell>
                  <TableCell sx={{fontSize: 20, color: theme.color.text.secondary, width: "30%"}}>คะแนน</TableCell>
                  <TableCell sx={{fontSize: 20, color: theme.color.text.secondary, width: "50%"}}>น้ำหนัก</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessment.question.map((data: any) => (
                <TableRow 
                  key={data._id} 
                  sx={{
                    "&:hover": { background: theme.color.button.default },
                  }}
                >
                    <TableCell sx={{fontSize: 16, color: theme.color.text.secondary}}>
                        {data.displayName ? data.displayName : "..."}
                    </TableCell>
                    <TableCell sx={{fontSize: 16, color: theme.color.text.secondary}}>
                        {data.email}
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
                        onChange={(event) => handleCheckboxChange(event.target.value)}
                        value={data._id}
                      />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table> : 
            <Typography 
              sx={{
                color: theme.color.text.secondary, 
                fontSize: 30, 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100%"
              }}
            > 
              ไม่พบนิสิตที่ยังไม่มีโปรเจกต์
            </Typography>
          }
      </DialogContent>
    </Dialog>
  );
}

export default ShowScoreDialog