import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box"

export const ProjectPreviewDetail = styled(Box)({
    minWidth: '65.3vw',
    maxWidth: "70rem",
    minHeight: '20rem',
    maxHeight: '30rem',
    margin: '64px 50px 0 50px',
    background: '#F3F3F3',
    borderRadius: '20px',
    padding: '20px 30px 20px 30px',
})

export const ProjectPreviewContainer = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    minWidth: '30rem',
    flexDirection: 'column',
})