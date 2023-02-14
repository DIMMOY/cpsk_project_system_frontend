import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminCommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { EditButton, ListPreviewButton } from '../../styles/layout/_button';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import { listDocument } from '../../utils/document';
import { theme } from '../../styles/theme';
import { listAssessment } from '../../utils/assessment';
import AssessmentEdit from '../assessment/AssessmentEdit';
import { observer } from 'mobx-react';

const AdminAssessmentPreview = observer(() => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole } = applicationStore

  const sortOptions = ['createdAtDESC', 'createdAtASC', 'name']
  const sortCheck = search.get('sort') && sortOptions.find((e) => search.get('sort')?.toLowerCase() == e.toLowerCase()) ? search.get('sort') : 'createdAtDESC'

  const [sortSelect, setSortSelect] = useState<string>(sortCheck || 'createdAtDESC')
  const [assessments, setAssessments] = useState<Array<any>>([])
  const isBigScreen = useMediaQuery({ query: '(min-width: 650px)' })
  const navigate = useNavigate();

  useEffect(() => {
      if (currentRole == 0) navigate('/')
      applicationStore.setClassroom(null)
      applicationStore.setIsShowSideBar(false)
      applicationStore.setIsShowMenuSideBar(false)
      async function getData () {
        const result = await listAssessment({ sort: sortSelect })
        setAssessments(result.data as Array<any>);
      }
      getData()
    }, [sortSelect] 
  )

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${event.target.value}`,
    });
  }

  const handleOnCreate = () => {
    navigate('/assessment/create')
  }

  const handleOnEdit = (assessment: any) =>  {
    navigate('/assessment/edit', { state: { assessment }})
  }

  return (
    <AdminCommonPreviewContainer>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}> 
        <Typography
            sx={{ 
              fontSize: 45, 
              fontWeight: 600, 
              color: theme.color.text.primary 
            }}
          >
          แบบฟอร์มประเมิน
        </Typography>
        <Box sx={{ display: 'flex', padding: '0 auto', margin: '1.25rem 0 1.25rem 0', flexDirection: 'row', maxWidth: 700, flexWrap: "wrap" }}>
          <FormControl sx={{marginRight: '1.5rem', position: 'relative'}}>
            <InputLabel id="select-sort-label">จัดเรียงโดย</InputLabel>
            <Select
                labelId="select-sort-label"
                id="select-sort"
                value={sortSelect}
                onChange={handleSortChange}
                label="จัดเรียงโดย"
                sx={{
                  borderRadius: '10px', 
                  color: theme.color.background.primary, 
                  height: 45, 
                  fontWeight: 500, 
                  width: 180
                }}
            >
                <MenuItem value={'createdAtDESC'}>วันที่สร้างล่าสุด</MenuItem>
                <MenuItem value={'createdAtASC'}>วันที่สร้างเก่าสุด</MenuItem>
                <MenuItem value={'name'}>ชื่อแบบฟอร์ม</MenuItem>
            </Select>
            </FormControl>
          {isAdmin 
              ? 
                <Box>  
                  <Button 
                    sx={{
                      borderRadius: '10px', 
                      background: theme.color.button.primary, 
                      color: theme.color.text.default, 
                      boxShadow: 'none', 
                      textTransform: 'none', 
                      '&:hover': { background: '#B07CFF' }, 
                      height: 45, 
                      weight: 42, 
                      fontSize: isBigScreen ? 16 : 13, 
                      padding: isBigScreen ? 1 : 0.5, 
                      marginRight: '1.5rem'}}
                      startIcon={<AddIcon sx={{width: 20, height: 20}}></AddIcon>}
                      onClick={handleOnCreate}
                  >
                    สร้างฟอร์ม
                  </Button>
                </Box>
              :  <></>
          }
        </Box>

        <Box sx={{ flexDirection: 'column', display: 'flex'}}>
          {assessments.map((c) => (
            <ListPreviewButton key={c._id} onClick={() => handleOnEdit(c)}>
              <Typography
                sx={{
                  top: '1.5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(30px + 0.2vw)',
                  color: theme.color.text.primary,
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  textAlign: "left",
                  width: isBigScreen ? "80%" : "60%"
                }}
              >
                {c.name}
              </Typography>
              <Typography
                sx={{
                  top: '5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(15px + 0.3vw)',
                  color: theme.color.text.secondary,
                  fontWeight: 600
                }}
              >
                สร้างเมื่อ {moment(c.createdAt).format('DD/MM/YYYY HH:mm')} น.
              </Typography>
              <EditButton
                sx={{
                  position: 'absolute',
                  right: 'calc(20px + 1vw)',
                  zIndex: 2
                }}
                onClick={() => console.log("TEST")}
              >
                แก้ไข
              </EditButton>
            </ListPreviewButton>
          ))}
        </Box>
      </Box>
    </AdminCommonPreviewContainer>
  )
})

export default AdminAssessmentPreview
