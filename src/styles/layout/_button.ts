import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const ProjectPreviewButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'isBigScreen'
})<{isBigScreen?: boolean}>(({ isBigScreen }) => ({
  fontSize: isBigScreen ? '1.6vw' : '1.5rem',
  color: '#AD68FF',
  fontFamily: 'Prompt',
  background: '#F3F3F3',
  margin: '60px 2.22vw 0 2.22vw',
  flexDirection: 'column',
  borderRadius: '20px',
  minWidth: '24rem',
  height: '20rem'
}))