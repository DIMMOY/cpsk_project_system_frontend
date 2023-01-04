import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import { useLocation, useNavigate } from 'react-router-dom'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { ListPreviewButton } from '../../styles/layout/_button';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import MeetingScheduleCreateModal from '../Modal/MeetingScheduleCreateModal';
import { listMeetingSchedule } from '../../utils/meetingSchedule';

const AdminMeetingSchedulePreview = () => {
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
    <CommonPreviewContainer>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}> 
        <Typography
            className="maincolor"
            sx={{ fontSize: 45, fontWeight: 600 }}
          >
          รายงานพบอาจารย์ที่ปรึกษา
        </Typography>
        <Box sx={{ display: 'flex', padding: '0 auto', margin: '1.25rem 0 1.25rem 0', flexDirection: isBigScreen ? 'row' : 'column', maxWidth: 700 }}>
          <FormControl sx={{marginRight: '1.5rem', position: 'relative', marginBottom: isBigScreen ? 0 : '1rem'}}>
            <InputLabel id="select-sort-label">จัดเรียงโดย</InputLabel>
            <Select
                labelId="select-sort-label"
                id="select-sort"
                value={sortSelect}
                onChange={handleSortChange}
                label="จัดเรียงโดย"
                sx={{borderRadius: '10px', color: '#ad68ff', height: 45, fontWeight: 500, width: 180}}
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
                    sx={{background: '#ad68ff', borderRadius: '10px', color: '#FFFFFF', boxShadow: 'none', 
                      textTransform: 'none', '&:hover': { background: '#ad68ff' }, height: 45, weight: 42, 
                      fontSize: isBigScreen ? 16 : 13, padding: isBigScreen ? 1 : 0.5, 
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
                className="maincolor"
                sx={{
                  top: '1.5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(30px + 0.2vw)',
                  fontFamily: 'Prompt',
                  fontWeight: 600
                }}
              >
                {c.name}
              </Typography>
              {/* <Typography
                sx={{
                  top: '1.5rem',
                  right: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(30px + 0.2vw)',
                  color: '#686868',
                  fontWeight: 600
                }}
              >
                {c.complete ? 'เสร็จสิ้น' : 'ดำเนินการ'}
              </Typography> */}
              <Typography
                sx={{
                  top: '5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(15px + 0.3vw)',
                  color: '#686868',
                  fontWeight: 600
                }}
              >
                สร้างเมื่อ {moment(c.createdAt).format('DD/MM/YYYY HH:mm')} น.
              </Typography>
            </ListPreviewButton>
          ))}
        </Box>
      </Box>
    </CommonPreviewContainer>
  )
}

export default AdminMeetingSchedulePreview
