import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminCommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { ListPreviewButton } from '../../styles/layout/_button';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import MeetingScheduleCreateModal from '../../components/Modal/MeetingScheduleCreateModal';
import { listMeetingSchedule } from '../../utils/meetingSchedule';
import { theme } from '../../styles/theme';
import { observer } from 'mobx-react';

const AdminMeetingSchedulePreview = observer(() => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole } = applicationStore

  const sortOptions = ['createdAtDESC', 'createdAtASC', 'name']
  const sortCheck = search.get('sort') && sortOptions.find((e) => search.get('sort')?.toLowerCase() == e.toLowerCase()) ? search.get('sort') : 'createdAtDESC'

  const [sortSelect, setSortSelect] = useState<string>(sortCheck || 'createdAtDESC')
  const [open, setOpen] = useState<boolean>(false);
  const isBigScreen = useMediaQuery({ query: '(min-width: 650px)' })
  const [meetingSchedules, setMeetingSchedules] = useState<Array<any>>([])
  const navigate = useNavigate()

  useEffect(() => {
      if (currentRole == 0) navigate('/')
      applicationStore.setClassroom(null)
      applicationStore.setIsShowSideBar(false)
      applicationStore.setIsShowMenuSideBar(false)
      async function getData () {
        const result = await listMeetingSchedule({ sort: sortSelect })
        setMeetingSchedules(result.data as Array<any>);
      }
      getData()
    }, [sortSelect] 
  )

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false)
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
    navigate({
      pathname: window.location.pathname,
      search: `?sort=${event.target.value}`,
    });
  }
  const refreshData = async () => {
    const result = await listMeetingSchedule({ sort: sortSelect } )
    setMeetingSchedules(result.data as Array<any>);
  }

  return (
    <AdminCommonPreviewContainer>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}> 
        <Typography
            sx={{ fontSize: 45, fontWeight: 600, color: theme.color.text.primary }}
          >
          รายงานพบอาจารย์ที่ปรึกษา
        </Typography>
        <Box sx={{ display: 'flex', padding: '0 auto', margin: '1.25rem 0 1.25rem 0', flexDirection: 'row', maxWidth: 700, flexWrap: "wrap" }}>
          <FormControl sx={{marginRight: '1.5rem', position: 'relative', marginBottom: isBigScreen ? 0 : '1rem'}}>
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
                  width: 180}}
            >
                <MenuItem value={'createdAtDESC'}>วันที่สร้างล่าสุด</MenuItem>
                <MenuItem value={'createdAtASC'}>วันที่สร้างเก่าสุด</MenuItem>
                <MenuItem value={'name'}>ชื่อคลาส</MenuItem>
            </Select>
            </FormControl>
          {isAdmin 
              ? 
                <Box>  
                  <Button 
                    sx={{
                      background: theme.color.button.primary, 
                      color: theme.color.text.default, 
                      borderRadius: '10px', 
                      boxShadow: 'none', 
                      textTransform: 'none', 
                      '&:hover': { background: '#B07CFF' }, 
                      height: 45, 
                      weight: 42, 
                      fontSize: isBigScreen ? 16 : 13, 
                      padding: isBigScreen ? 1 : 0.5, 
                      marginRight: '1.5rem'}}
                      startIcon={<AddIcon sx={{width: 20, height: 20}}></AddIcon>}
                      onClick={handleOpenModal}
                  >
                    สร้างรายการ
                  </Button>
                  <MeetingScheduleCreateModal
                    open={open} 
                    onClose={handleCloseModal}
                    refresh={refreshData}>
                  </MeetingScheduleCreateModal>
                </Box>
              :  <></>
          }
        </Box>

        <Box sx={{ flexDirection: 'column', display: 'flex'}}>
          {meetingSchedules.map((c) => (
            <ListPreviewButton key={c._id}>
              <Typography
                sx={{
                  top: '1.5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(30px + 0.2vw)',
                  fontWeight: 600,
                  color: theme.color.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  textAlign: "left",
                  width: "90%"
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
            </ListPreviewButton>
          ))}
        </Box>
      </Box>
    </AdminCommonPreviewContainer>
  )
})

export default AdminMeetingSchedulePreview
