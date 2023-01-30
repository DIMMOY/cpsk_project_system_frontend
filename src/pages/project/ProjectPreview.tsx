import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminCommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { ListPreviewButton } from '../../styles/layout/_button';
import { useMediaQuery } from 'react-responsive';
import { listClass } from '../../utils/class';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { listProjectInClass } from '../../utils/project';
import { theme } from '../../styles/theme';

const ProjectPreview = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin } = applicationStore

  const sortOptions = ['createdAtDESC', 'createdAtASC', 'name']
  const sortCheck = search.get('sort') && sortOptions.find((e) => search.get('sort')?.toLowerCase() == e.toLowerCase()) ? search.get('sort') : 'createdAtDESC'
  const [sortSelect, setSortSelect] = useState<string>(sortCheck || 'createdAtDESC')
  
  const isBigScreen = useMediaQuery({ query: '(min-width: 650px)' })
  const [projects, setProjects] = useState<Array<any>>([])

  useEffect(() => {
      // if (!applicationStore.classroom)
      async function getData () {
        const result = await listProjectInClass({ sort: sortSelect}, window.location.pathname.split('/')[2])
        setProjects(result.data as Array<any>);
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

  return (
    <AdminCommonPreviewContainer>
      {isAdmin ? <AdminSidebar/> : <></> }
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <Box sx={{ display: 'flex', padding: '0 auto', margin: '1.25rem 0 1.25rem 0', flexDirection: isBigScreen ? 'row' : 'column', maxWidth: 700 }}>
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
                  width: 180
                }}
            >
                <MenuItem value={'createdAtDESC'}>วันที่สร้างล่าสุด</MenuItem>
                <MenuItem value={'createdAtASC'}>วันที่สร้างเก่าสุด</MenuItem>
                <MenuItem value={'name'}>ชื่อคลาส</MenuItem>
            </Select>
            </FormControl>
        </Box>

        <Box sx={{ flexDirection: 'column', display: 'flex'}}>
          {projects.map((c) => (
            <ListPreviewButton key={c._id}>
              <Typography
                sx={{
                  top: '1.5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(30px + 0.2vw)',
                  fontFamily: 'Prompt',
                  fontWeight: 600,
                  color: theme.color.text.primary
                }}
              >
                {c.nameTH}
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
                {c.nameEN}
              </Typography>
            </ListPreviewButton>
          ))}
        </Box>
      </Box>
    </AdminCommonPreviewContainer>
  )
}

export default ProjectPreview
