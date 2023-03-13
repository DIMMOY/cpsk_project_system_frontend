import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Grow,
  Typography,
  Box,
} from "@mui/material";
import { theme } from "../../styles/theme";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  assessment: any;
  score: Array<number>;
  title: string;
  assessBy: string;
  feedBack: string;
}

const ShowScoreDialog = ({
  open,
  onClose,
  assessment,
  score,
  title,
  assessBy,
  feedBack,
}: DialogProps) => {
  const maxCredits = assessment.form
    ? assessment.form
        .map((data: any) => data.weight)
        .reduce((a: number, b: number) => a + b)
    : 0;
  const maxRawScore = assessment.form
    ? assessment.form
        .map((data: any) => data.limitScore * data.weight)
        .reduce((a: number, b: number) => a + b)
    : 0;
  const sumRawScore = assessment.form
    ? assessment.form
        .map((data: any, index: number) => score[index] * data.weight)
        .reduce((a: number, b: number) => a + b)
    : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: theme.color.background.default,
          borderRadius: "20px",
        },
      }}
      // disableEnforceFocus
      disableScrollLock
      TransitionComponent={Grow}
    >
      <DialogTitle>
        <Typography
          sx={{
            fontSize: 40,
            fontWeight: 500,
            color: theme.color.text.primary,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: 25,
            fontWeight: 500,
            color: theme.color.text.secondary,
          }}
        >
          {assessBy}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ height: "35rem" }}>
        {assessment.form.length ? (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    width: "10%",
                  }}
                >
                  ข้อ
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    width: "45%",
                  }}
                >
                  คำถาม
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    width: "15%",
                  }}
                >
                  น้ำหนัก
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    width: "15%",
                  }}
                >
                  คะแนนเต็ม
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 20,
                    color: theme.color.text.secondary,
                    width: "15%",
                  }}
                >
                  คะแนนที่ได้
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessment.form.map((data: any, index: number) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { background: theme.color.button.default },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{ fontSize: 16, color: theme.color.text.secondary }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: 16, color: theme.color.text.secondary }}
                  >
                    {data.question}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: 16, color: theme.color.text.secondary }}
                  >
                    {data.weight}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: 16, color: theme.color.text.secondary }}
                  >
                    {data.limitScore}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: 16, color: theme.color.text.primary }}
                  >
                    {score[index]}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell />
                <TableCell
                  align="right"
                  sx={{
                    fontSize: 16,
                    color: theme.color.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  รวม
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 16,
                    color: theme.color.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {maxCredits}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 16,
                    color: theme.color.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {maxRawScore}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 16,
                    color: theme.color.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {sumRawScore ? sumRawScore : "-"}
                </TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell
                  align="right"
                  sx={{
                    fontSize: 16,
                    color: theme.color.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  คะแนนรวม
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 16,
                    color: theme.color.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {assessment.score ? assessment.score : 0}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: 16,
                    color: theme.color.text.primary,
                    fontWeight: 500,
                  }}
                >
                  {assessment.score && sumRawScore && maxRawScore
                    ? ((sumRawScore * assessment.score) / maxRawScore).toFixed(
                        2
                      )
                    : "-"}
                </TableCell>
                <TableCell />
              </TableRow>
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
            ไม่พบคำถาม
          </Typography>
        )}

        <Box sx={{ marginTop: "1.25rem" }}>
          <Typography
            sx={{
              fontSize: 25,
              fontWeight: 500,
              color: theme.color.text.primary,
            }}
          >
            ข้อเสนอแนะ :
          </Typography>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 500,
              color: theme.color.text.secondary,
            }}
          >
            {feedBack && feedBack !== "" ? feedBack : "...."}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShowScoreDialog;
