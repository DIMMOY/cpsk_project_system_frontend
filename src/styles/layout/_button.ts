import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { theme } from "../theme";

export const ProjectPreviewButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== "isBigScreen",
})<{ isBigScreen?: boolean }>(({ isBigScreen }) => ({
  fontSize: isBigScreen ? 30 : "1.5rem",
  color: "#AD68FF",
  fontFamily: "Prompt",
  background: "#F3F3F3",
  margin: "60px 2.22vw 60px 2.22vw",
  flexDirection: "column",
  borderRadius: "20px",
  minWidth: "24rem",
  height: "20rem",
}));

export const ListPreviewButton = styled(Button)({
  position: "relative",
  borderRadius: "20px",
  background: "#F3F3F3",
  margin: "1.25rem 0 1.25rem 0",
  display: "flex",
  flexDirection: "column",
  textTransform: "none",
  height: "9rem",
  width: "100%",
});

export const CommonPreviewButton = styled(Button)({
  height: "9rem",
  background: "#F3F3F3",
  borderRadius: "20px",
});

export const ActivateButton = styled(Button)({
  width: "7rem",
  height: "2.8rem",
  fontSize: 20,
  background: theme.color.button.success,
  borderRadius: "10px",
  color: theme.color.text.default,
  boxShadow: "none",
  textTransform: "none",
  "&:hover": { background: "#43BF6E" },
});

export const EditButton = styled(Button)({
  width: "5rem",
  height: "2.8rem",
  fontSize: 20,
  background: theme.color.button.warning,
  borderRadius: "10px",
  color: theme.color.text.default,
  boxShadow: "none",
  textTransform: "none",
  "&:hover": { background: "#FBBC0E" },
});

export const CancelButton = styled(Button)({
  width: "7rem",
  height: "2.8rem",
  fontSize: 20,
  background: theme.color.button.error,
  borderRadius: "10px",
  color: theme.color.text.default,
  boxShadow: "none",
  textTransform: "none",
  "&:hover": { background: "#FF545E" },
});

export const useStylesButton = makeStyles(() => ({
  innerButton: {
    display: "inline-block",
    "&:active": {
      outline: "none",
    },
  },
}));
