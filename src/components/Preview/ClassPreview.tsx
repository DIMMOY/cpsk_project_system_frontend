import React, { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom'
import { CommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { ListPreviewButton } from '../../styles/layout/_button';
import { useMediaQuery } from 'react-responsive';
import ClassCreateModal from '../Modal/ClassCreateModal';
import { listClass } from '../../utils/class';
import { responsePattern } from '../../constants/responsePattern';
import moment from 'moment';

interface PreviewProps {
  isAdmin: boolean
}

const ClassPreview = ({ isAdmin }: PreviewProps) => {
  const [classFilter, setClassFilter] = useState<string>('all')
  const [sortSelect, setSortSelect] = useState<string>('createdAtDESC')
  const [majorFilter, setMajorFilter] = useState<string>('all')
  const [open, setOpen] = useState<boolean>(false);
  const isBigScreen = useMediaQuery({ query: '(min-width: 600px)' })
  const [classes, setClasses] = useState<Array<any>>([])

  useEffect(() => {
      async function getData () {
        console.log({ sort: sortSelect, select: classFilter, type: majorFilter})
        const result = await listClass({ sort: sortSelect, select: classFilter, major: majorFilter})
        // console.log(result)
        setClasses(result.data as Array<any>);
      }
      getData()
    }, [classFilter, sortSelect, majorFilter] 
  )

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false)
  const handleClassFilterChange = (event: SelectChangeEvent) => setClassFilter(event.target.value as string);
  const handleMajorFilterChange = (event: SelectChangeEvent) => setMajorFilter(event.target.value as string);
  const handleSortChange = (event: SelectChangeEvent) => setSortSelect(event.target.value as string);
  const refreshData = async () => {
    const result = await listClass({ sort: sortSelect, select: classFilter, major: majorFilter} )
    setClasses(result.data as Array<any>);
  }

  const statusColorList = {
    ส่งแล้ว: '#43BF64',
    ส่งช้า: '#FBBC05',
    ยังไม่ส่ง: '#FF5454'
  }

  return (
    <CommonPreviewContainer>
      <Box sx={{ display: 'flex', padding: '0 auto', maxWidth: 700, margin: '1.25rem 0 1.25rem 0', flexDirection: 'row' }}>
        <FormControl  sx={{marginRight: '1.5rem', position: 'relative'}}>
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
        <FormControl sx={{marginRight: '1.5rem', position: 'relative'}}>
            <InputLabel id="select-sort-label">ภาค</InputLabel>
            <Select
                labelId="select-major-label"
                id="select-major"
                value={majorFilter}
                onChange={handleMajorFilterChange}
                label="ภาค"
                sx={{borderRadius: '10px', color: '#ad68ff', height: 45, fontWeight: 500, width: 120}}
            >
                <MenuItem value={'all'}>ทั้งหมด</MenuItem>
                <MenuItem value={'cpe'}>CPE</MenuItem>
                <MenuItem value={'ske'}>SKE</MenuItem>
            </Select>
          </FormControl>
        <FormControl sx={{marginRight: '1.5rem', position: 'relative'}}>
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
                    textTransform: 'none', '&:hover': { background: '#ad68ff' }, height: 45, weight: 42, fontSize: isBigScreen ? 16 : 13, padding: isBigScreen ? 1 : 0.5, position: 'relative'}}
                  startIcon={<AddIcon sx={{width: 20, height: 20}}></AddIcon>}
                  onClick={handleOpenModal}
                >
                  สร้าง Class
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
      <Box sx={{ flexDirection: 'column', display: 'flex' }}>
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
    </CommonPreviewContainer>
  )
}

export default ClassPreview
