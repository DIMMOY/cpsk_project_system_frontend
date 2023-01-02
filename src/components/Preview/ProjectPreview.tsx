import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, IconButton } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { ListPreviewButton } from '../../styles/layout/_button';
import { useMediaQuery } from 'react-responsive';
import ClassCreateModal from '../Modal/ClassCreateModal';
import { listClass } from '../../utils/class';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import AdminSidebar from '../Sidebar/AdminSidebar';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const ProjectPreview = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin } = applicationStore

  const classOptions = ['true', 'false', 'all']
  const sortOptions = ['createdAtDESC', 'createdAtASC', 'name']
  const majorOptions = ['cpe', 'ske', 'all']

  const classCheck = search.get('select') && classOptions.find((e) => search.get('select')?.toLowerCase() == e) ? search.get('select') : 'all'
  const sortCheck = search.get('sort') && sortOptions.find((e) => search.get('sort')?.toLowerCase() == e.toLowerCase()) ? search.get('sort') : 'createdAtDESC'
  const majorCheck = search.get('major') && majorOptions.find((e) => search.get('major')?.toLowerCase() == e) ? search.get('major') : 'all'

  const [classFilter, setClassFilter] = useState<string>(classCheck || 'all')
  const [sortSelect, setSortSelect] = useState<string>(sortCheck || 'createdAtDESC')
  const isBigScreen = useMediaQuery({ query: '(min-width: 650px)' })
  const [classes, setClasses] = useState<Array<any>>([])

  useEffect(() => {
      async function getData () {
        const result = await listClass({ sort: sortSelect, select: classFilter})
        setClasses(result.data as Array<any>);
      }
      getData()
    }, [classFilter, sortSelect] 
  )

  const handleClassFilterChange = (event: SelectChangeEvent) => {
    setClassFilter(event.target.value as string);
    navigate({
      pathname: '/project',
      search: `?sort=${sortSelect}&select=${event.target.value}`,
    });
  }
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
    navigate({
      pathname: '/project',
      search: `?sort=${event.target.value}&select=${classFilter}`,
    });
  }

  return (
    <CommonPreviewContainer>
      {isAdmin ? <AdminSidebar currentSelect='คลาส'></AdminSidebar> : <></>}
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <Box sx={{ display: 'flex', padding: '0 auto', margin: '1.25rem 0 1.25rem 0', flexDirection: isBigScreen ? 'row' : 'column', maxWidth: 700 }}>
          <FormControl  sx={{marginRight: '1.5rem', position: 'relative', marginBottom: isBigScreen ? 0 : '1rem'}}>
              <InputLabel id="select-class-label">คลาส</InputLabel>
              <Select
                  labelId="select-class-label"
                  id="select-class"
                  value={classFilter}
                  onChange={handleClassFilterChange}
                  label="คลาส"
                  sx={{borderRadius: '10px', color: '#ad68ff', height: 45, fontWeight: 500, width: 120}}
              >
                  <MenuItem value={'all'}>ทั้งหมด</MenuItem>
                  <MenuItem value={'false'}>ดำเนินการ</MenuItem>
                  <MenuItem value={'true'}>เสร็จสิ้น</MenuItem>
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
                <MenuItem value={'name'}>ชื่อคลาส</MenuItem>
            </Select>
            </FormControl>
        </Box>

        <Box sx={{ flexDirection: 'column', display: 'flex'}}>
          {classes.map((c) => (
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
              <Typography
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
              </Typography>
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

export default ProjectPreview
