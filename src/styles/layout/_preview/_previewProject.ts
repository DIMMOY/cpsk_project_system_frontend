import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box"

export const ProjectPreviewDetail = styled(Box)({
    position: 'static',
    minWidth: '65vw',
    height: '20rem',
    margin: '64px 50px 0 50px',
    background: '#f3f3f3',
    borderRadius: '20px',
    padding: '20px 30px 0 30px',
})

export const ProjectPreviewContainer = styled(Box)({
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    minWidth: '30rem',
    flexDirection: 'column'
})