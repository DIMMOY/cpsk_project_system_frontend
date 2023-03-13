import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const ProjectPreviewDetail = styled(Box)({
  minWidth: "66%",
  maxWidth: "70rem",
  minHeight: "20rem",
  margin: "64px 50px 0 50px",
  background: "#F3F3F3",
  borderRadius: "20px",
  padding: "20px 30px 30px 30px",
  position: "relative"
});

export const ProjectPreviewContainer = styled(Box)({
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  minWidth: "30rem",
  maxWidth: "150rem",
  flexDirection: "column",
});
