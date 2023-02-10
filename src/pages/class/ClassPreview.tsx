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
import ClassCreateModal from '../../components/Modal/ClassCreateModal';
import { listClass } from '../../utils/class';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import { observer } from 'mobx-react';
import { theme } from '../../styles/theme';

const ClassPreview = observer(() => {
  const navigate = useNavigate()
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole } = applicationStore

  const classOptions = ['true', 'false', 'all']
  const sortOptions = ['createdAtDESC', 'createdAtASC', 'name']
  const majorOptions = ['cpe', 'ske', 'all']

  const classCheck = search.get('select') && classOptions.find((e) => search.get('select')?.toLowerCase() == e) ? search.get('select') : 'all'
  const sortCheck = search.get('sort') && sortOptions.find((e) => search.get('sort')?.toLowerCase() == e.toLowerCase()) ? search.get('sort') : 'createdAtDESC'
  const majorCheck = search.get('major') && majorOptions.find((e) => search.get('major')?.toLowerCase() == e) ? search.get('major') : 'all'

  const [classFilter, setClassFilter] = useState<string>(classCheck || 'all')
  const [sortSelect, setSortSelect] = useState<string>(sortCheck || 'createdAtDESC')
  const [majorFilter, setMajorFilter] = useState<string>(majorCheck || 'all')
  const [open, setOpen] = useState<boolean>(false);
  const isBigScreen = useMediaQuery({ query: '(min-width: 700px)' })
  const [classes, setClasses] = useState<Array<any>>([])

  useEffect(() => {
      if (currentRole == 0) navigate('/')
      applicationStore.setClassroom(null)
      async function getData () {
        const result = await listClass({ sort: sortSelect, select: classFilter, major: majorFilter})
        setClasses(result.data as Array<any>);
      }
      getData()
    }, [classFilter, sortSelect, majorFilter] 
  )

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false)
  const handleClassFilterChange = (event: SelectChangeEvent) => {
    setClassFilter(event.target.value as string);
    navigate({
      pathname: '/class',
      search: `?sort=${sortSelect}&select=${event.target.value}&major=${majorFilter}`,
    });
  }
  const handleMajorFilterChange = (event: SelectChangeEvent) => {
    setMajorFilter(event.target.value as string);
    navigate({
      pathname: '/class',
      search: `?sort=${sortSelect}&select=${classFilter}&major=${event.target.value}`,
    });
  }
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortSelect(event.target.value as string);
    navigate({
      pathname: '/class',
      search: `?sort=${event.target.value}&select=${classFilter}&major=${majorFilter}`,
    });
  }
  const refreshData = async () => {
    const result = await listClass({ sort: sortSelect, select: classFilter, major: majorFilter} )
    setClasses(result.data as Array<any>);
  }

  return (
    <AdminCommonPreviewContainer>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <Typography
            sx={{ fontSize: 45, fontWeight: 600, color: theme.color.text.primary }}
          >
          คลาส
        </Typography> 
        <Box sx={{ display: 'flex', padding: '0 auto', margin: '1.25rem 0 1.25rem 0', flexDirection: 'row', maxWidth: 700, flexWrap: "wrap" }}>
          <FormControl  sx={{margin: '0 1.5rem 1.5rem 0', position: 'relative', marginBottom: isBigScreen ? 0 : '1rem'}}>
              <InputLabel id="select-class-label">คลาส</InputLabel>
              <Select
                  labelId="select-class-label"
                  id="select-class"
                  value={classFilter}
                  onChange={handleClassFilterChange}
                  label="คลาส"
                  sx={{
                    borderRadius: '10px', 
                    color: theme.color.background.primary, 
                    height: 45, 
                    fontWeight: 500, 
                    width: 120}}
              >
                  <MenuItem value={'all'}>ทั้งหมด</MenuItem>
                  <MenuItem value={'false'}>ดำเนินการ</MenuItem>
                  <MenuItem value={'true'}>เสร็จสิ้น</MenuItem>
              </Select>
          </FormControl>
          <FormControl sx={{marginRight: '1.5rem', position: 'relative', marginBottom: isBigScreen ? 0 : '1rem'}}>
              <InputLabel id="select-sort-label">ภาค</InputLabel>
              <Select
                  labelId="select-major-label"
                  id="select-major"
                  value={majorFilter}
                  onChange={handleMajorFilterChange}
                  label="ภาค"
                  sx={{
                    borderRadius: '10px', 
                    color: theme.color.background.primary, 
                    height: 45, 
                    fontWeight: 500, 
                    width: 120
                  }}
              >
                  <MenuItem value={'all'}>ทั้งหมด</MenuItem>
                  <MenuItem value={'cpe'}>CPE</MenuItem>
                  <MenuItem value={'ske'}>SKE</MenuItem>
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
                    สร้างคลาส
                  </Button>
                  <ClassCreateModal
                    open={open} 
                    onClose={handleCloseModal}
                    refresh={refreshData}>
                  </ClassCreateModal>
                </Box>
              :  <></>
          }
        </Box>

        <Box sx={{ flexDirection: 'column', display: 'flex'}}>
          {classes.map((c) => (
            <ListPreviewButton 
              key={c._id}
              onClick={() => {
                applicationStore.setClassroom(c.name)
                navigate(`/class/${c._id as string}/project`)
              }}
            >
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
                  width: "60%"
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
                  color: theme.color.text.secondary,
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

export default ClassPreview
