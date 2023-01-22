import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useLocation, useNavigate } from 'react-router-dom'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { ListPreviewButton } from '../../styles/layout/_button';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import Button from '@mui/material/Button';
import DocumentStartModal from '../../components/Modal/DocumentStartModal';
import { listMeetingScheduleInClass } from '../../utils/meetingSchedule';
import MeetingScheduleStartModal from '../../components/Modal/MeetingScheduleStartModal';

const MeetingSchedulePreview = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const { isAdmin } = applicationStore
  
    const sortOptions = ['createdAtDESC', 'createdAtASC', 'name']
    const statisOptions = ['all', 'true', 'false']
    const sortCheck = search.get('sort') && sortOptions.find((e) => search.get('sort')?.toLowerCase() == e.toLowerCase()) ? search.get('sort') : 'createdAtDESC'
    const statusCheck = search.get('status') && statisOptions.find((e) => search.get('status')?.toLowerCase() == e.toLowerCase()) ? search.get('status') : 'all'
    const [sortSelect, setSortSelect] = useState<string>(sortCheck || 'createdAtDESC')
    const [statusSelect, setStatusSelect] = useState<string>(statusCheck || 'all')
    const [openStartDate, setOpenStartDate] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<string | null>(null)
    const [endDate, setEndDate] = useState<string | null>(null)
    const [lastMeetingScheduleName, setLastMeetingScheduleName] = useState<string | null>(null)
    const [lastMeetingScheduleId, setLastMeetingScheduleId] = useState<string | null>(null)
    
    const isBigScreen = useMediaQuery({ query: '(min-width: 650px)' })
    const [meetingSchedules, setMeetingSchedules] = useState<Array<any>>([])
  
    useEffect(() => {
        // if (!applicationStore.classroom)
        async function getData () {
          const result = await listMeetingScheduleInClass({ sort: sortSelect, status: statusSelect }, window.location.pathname.split('/')[2])
          setMeetingSchedules(result.data as Array<any>);
        }
        getData()
      }, [sortSelect, statusSelect] 
    )
  
    const handleSortChange = (event: SelectChangeEvent) => {
      setSortSelect(event.target.value as string);
      navigate({
        pathname: window.location.pathname,
        search: `?sort=${event.target.value}&status=${statusSelect}`,
      });
    }
  
    const handleStatusChange = (event: SelectChangeEvent) => {
      setStatusSelect(event.target.value as string);
      navigate({
        pathname: window.location.pathname,
        search: `?sort=${sortSelect}&status=${event.target.value}`,
      })
    }
  
    const handleOpenModal = (name: string, id: string, startDate: string, endDate: string | null) => {
      setLastMeetingScheduleName(name)
      setLastMeetingScheduleId(id)
      setStartDate(startDate)
      setEndDate(endDate)
      setOpenStartDate(true)
    }
  
    const handleCloseModal = () => setOpenStartDate(false)
  
    const refreshData = async () => {
      const result = await listMeetingScheduleInClass({ sort: sortSelect, status: statusSelect }, window.location.pathname.split('/')[2])
      setMeetingSchedules(result.data as Array<any>);
    }
  
  
    return (
      <CommonPreviewContainer>
        {isAdmin ? <AdminSidebar/> : <></> }
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <Box sx={{ display: 'flex', padding: '0 auto', margin: '1.25rem 0 1.25rem 0', flexDirection: isBigScreen ? 'row' : 'column', maxWidth: 700 }}>
            <FormControl sx={{marginRight: '1.5rem', position: 'relative', marginBottom: isBigScreen ? 0 : '1rem'}}>
              <InputLabel id="select-status-label">สถานะ</InputLabel>
              <Select
                  labelId="select-status-label"
                  id="select-status"
                  value={statusSelect}
                  onChange={handleStatusChange}
                  label="สถานะ"
                  sx={{borderRadius: '10px', color: '#ad68ff', height: 45, fontWeight: 500, width: 160}}
              >
                  <MenuItem value={'all'}>ทั้งหมด</MenuItem>
                  <MenuItem value={'true'}>เปิดใช้งาน</MenuItem>
                  <MenuItem value={'false'}>ยังไม่เปิดใช้งาน</MenuItem>
              </Select>
            </FormControl>
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
                  <MenuItem value={'name'}>ชื่อเอกสาร</MenuItem>
              </Select>
              </FormControl>
          </Box>
  
          <MeetingScheduleStartModal 
            open={openStartDate} 
            meetingScheduleName={lastMeetingScheduleName} 
            meetingScheduleId={lastMeetingScheduleId} 
            onClose={handleCloseModal} 
            refresh={refreshData}
            defaultStartDate={startDate}
            defaultEndDate={endDate}
          ></MeetingScheduleStartModal>
  
          <Box sx={{ flexDirection: 'column', display: 'flex'}}>
            {meetingSchedules.map((c) => (
              <ListPreviewButton key={c._id} sx={{zIndex: 1}} onClick={() => console.log('TEST')}>
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
                {
                  !c.statusInClass ? 
                  <Button sx={{
                      position: 'absolute',
                      right: 'calc(20px + 1vw)',
                      width: "7rem",
                      height: "2.8rem",
                      fontSize: 20,
                      background: '#43BF64',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      boxShadow: 'none',
                      textTransform: 'none',
                      '&:hover': { background: '#43BF6E' },
                      zIndex: 2
                      }}
                      onClick={() => 
                        handleOpenModal(c.name, c._id, moment(new Date()).format('YYYY-MM-DDTHH:mm'), null)}
                  >
                          เปิดใช้งาน
                  </Button> : 
                  <></>
              }
              {
                  c.statusInClass ? 
                  <Button sx={{
                      position: 'absolute',
                      right: 'calc(150px + 1vw)',
                      width: "5rem",
                      height: "2.8rem",
                      fontSize: 20,
                      background: '#FBBC05',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      boxShadow: 'none',
                      textTransform: 'none',
                      '&:hover': { background: '#FBBC0E' },
                      zIndex: 2
                      }}
                      onClick={() => handleOpenModal(c.name, c._id, c.startDate, c.endDate)}
                  >
                          แก้ไข
                  </Button> : 
                  <></>
              }
              {
                  c.statusInClass ? 
                  <Button sx={{
                      position: 'absolute',
                      right: 'calc(20px + 1vw)',
                      width: "7rem",
                      height: "2.8rem",
                      fontSize: 20,
                      background: '#FF5454',
                      borderRadius: '10px',
                      color: '#FFFFFF',
                      boxShadow: 'none',
                      textTransform: 'none',
                      '&:hover': { background: '#FF545E' },
                      zIndex: 2
                      }}
                      onClick={() => handleOpenModal(c.name, c._id, c.startDate, c.endDate)}
                  >
                          ปิดใช้งาน
                  </Button> : 
                  <></>
              }
  
                <Typography
                  sx={{
                    top: '5rem',
                    left: 'calc(20px + 1vw)',
                    position: 'absolute',
                    fontSize: 'calc(15px + 0.3vw)',
                    color: c.statusInClass ? '#686868' : '#FF5454',
                    fontWeight: 600
                  }}
                >
                  {c.statusInClass ? `เปิดใช้งานวันที่ ${moment(c.startDate).format('DD/MM/YYYY HH:mm')}` : 'ยังไม่ถูกใช้ในคลาสนี้'} 
                </Typography>
              </ListPreviewButton>
            ))}
          </Box>
        </Box>
      </CommonPreviewContainer>
    )
}

export default MeetingSchedulePreview
