import { styled } from '@mui/styles'
import Button from '@mui/material/Button'

export const PreviewButton = styled(Button)({
  width: '24rem',
  maxWidth: '50%',
  // min-width: 20%;
  height: '20rem',
  fontSize: 1.875,
  color: '#AD68FF',
  fontFamily: 'Prompt',
  background: '#F3F3F3',
  margin: '2.22vh 2.22vw 0 2.22vw',
  flexDirection: 'column',
  borderRadius: '20px'
})

export const BootstrapButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#0063cc',
  borderColor: '#0063cc',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:hover': {
    backgroundColor: '#0069d9',
    borderColor: '#0062cc',
    boxShadow: 'none'
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    borderColor: '#005cbf'
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
  }
})
