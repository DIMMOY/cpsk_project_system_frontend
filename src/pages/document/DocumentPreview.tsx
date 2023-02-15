import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminCommonPreviewContainer } from '../../styles/layout/_preview/_previewCommon'
import { ActivateButton, CancelButton, EditButton, ListPreviewButton } from '../../styles/layout/_button';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import applicationStore from '../../stores/applicationStore';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import { disabeDocumentInClass, listDocumentInClass } from '../../utils/document';
import Button from '@mui/material/Button';
import DocumentStartModal from '../../components/Modal/DocumentStartModal';
import { theme } from '../../styles/theme';
import { observer } from 'mobx-react';
import CancelModal from '../../components/Modal/CancelModal';

const DocumentPreview = observer(() => {
  const navigate = useNavigate()
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole } = applicationStore

  const sortOptions = ['createdAtDESC', 'createdAtASC', 'name']
  const statisOptions = ['all', 'true', 'false']
  const sortCheck = search.get('sort') && sortOptions.find((e) => search.get('sort')?.toLowerCase() == e.toLowerCase()) ? search.get('sort') : 'createdAtDESC'
  const statusCheck = search.get('status') && statisOptions.find((e) => search.get('status')?.toLowerCase() == e.toLowerCase()) ? search.get('status') : 'all'
  const [sortSelect, setSortSelect] = useState<string>(sortCheck || 'createdAtDESC')
  const [statusSelect, setStatusSelect] = useState<string>(statusCheck || 'all')
  const [openStartDate, setOpenStartDate] = useState<boolean>(false)
  const [openCancel, setOpenCancel] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [currentDocumentName, setCurrentDocumentName] = useState<string | null>(null)
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null)
  
  const isBigScreen = useMediaQuery({ query: '(min-width: 900px)' })
  const [documents, setDocuments] = useState<Array<any>>([])

  const getData = async () => {
    if (currentRole === 2) {
      const result = await listDocumentInClass({ sort: sortSelect, status: statusSelect }, window.location.pathname.split('/')[2])
      setDocuments(result.data as Array<any>);
    } else if (currentRole === 1) {
      const result = await listDocumentInClass({ sort: sortSelect, status: 'true' }, window.location.pathname.split('/')[2])
      setDocuments(result.data as Array<any>);
    }
  }

  useEffect(() => {
      // if (!applicationStore.classroom)
      applicationStore.setIsShowMenuSideBar(true)
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

  const handleOpenSetDateModal = (name: string, id: string, startDate: string, endDate: string | null, event: any) => {
    event.stopPropagation()
    setCurrentDocumentName(name)
    setCurrentDocumentId(id)
    setStartDate(startDate)
    setEndDate(endDate)
    setOpenStartDate(true)
  }

  const handleCloseSetDateModal = () => setOpenStartDate(false)

  const handleOpenCancelModal = (name: string, id: string, event: any) => {
    event.stopPropagation()
    setCurrentDocumentName(name)
    setCurrentDocumentId(id)
    setOpenCancel(true)
  }

  const handleCloseCancelModal = () => setOpenCancel(false)

  const handleCancelSubmit = async () => {
    const result = await disabeDocumentInClass(window.location.pathname.split('/')[2], currentDocumentId as string)
    if (result.statusCode === 200) {
      getData()
    }
  }

  return (
    <AdminCommonPreviewContainer>
      <AdminSidebar/>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <Box sx={{ display: 'flex', padding: '0 auto', margin: '1.25rem 0 1.25rem 0', flexDirection: 'row', maxWidth: 700, flexWrap: 'wrap' }}>
          {currentRole === 2 ? 
            <FormControl sx={{marginRight: '1.5rem', position: 'relative'}}>
              <InputLabel id="select-status-label">สถานะ</InputLabel>
              <Select
                  labelId="select-status-label"
                  id="select-status"
                  value={statusSelect}
                  onChange={handleStatusChange}
                  label="สถานะ"
                  sx={{
                    borderRadius: '10px', 
                    color: theme.color.background.primary, 
                    height: 45, 
                    fontWeight: 500, 
                    width: 160}}
              >
                  <MenuItem value={'all'}>ทั้งหมด</MenuItem>
                  <MenuItem value={'true'}>เปิดใช้งาน</MenuItem>
                  <MenuItem value={'false'}>ยังไม่เปิดใช้งาน</MenuItem>
              </Select>
            </FormControl> : 
            <></>
          }
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
                <MenuItem value={'name'}>ชื่อเอกสาร</MenuItem>
            </Select>
            </FormControl>
        </Box>

        <DocumentStartModal 
          open={openStartDate} 
          documentName={currentDocumentName} 
          documentId={currentDocumentId} 
          onClose={handleCloseSetDateModal} 
          refresh={getData}
          defaultStartDate={startDate}
          defaultEndDate={endDate}
        ></DocumentStartModal>

        <CancelModal
          open={openCancel}
          onClose={handleCloseCancelModal}
          onSubmit={handleCancelSubmit}
          title={`ปิดการใช้งาน ${currentDocumentName}`}
          description='เมื่อปิดใช้งานแล้วนิสิตและที่ปรึกษาจะไม่เห็นรายการนี้ในคลาส'
        />

        <Box sx={{ flexDirection: 'column', display: 'flex'}}>
          {documents.map((c) => (
            <ListPreviewButton key={c._id} sx={{zIndex: 1}}>
              <Typography
                sx={{
                  top: '1.5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(30px + 0.2vw)',
                  fontFamily: 'Prompt',
                  fontWeight: 600,
                  color: theme.color.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  textAlign: "left",
                  width: isBigScreen ? "70%" : "40%"
                }}
              >
                {c.name}
              </Typography>
            {
              !c.statusInClass && isAdmin && currentRole === 2 ? 
              <ActivateButton 
                sx={{
                  position: 'absolute',
                  right: 'calc(20px + 1vw)',
                  zIndex: 2
                }}
                onClick={(event) => 
                  handleOpenSetDateModal(
                    c.name, 
                    c._id, 
                    moment(new Date()).format('YYYY-MM-DDTHH:mm'), 
                    null,
                    event,
                    )}
                >
                  เปิดใช้งาน
                </ActivateButton> : 
                <></>
            }
            {
                    c.statusInClass && isAdmin && currentRole === 2 ? 
                    <EditButton sx={{
                        position: 'absolute',
                        right: 'calc(150px + 1vw)',
                        zIndex: 2
                        }}
                        onClick={(event) => 
                          handleOpenSetDateModal(
                            c.name, 
                            c._id, 
                            c.startDate, 
                            c.endDate,
                            event,
                          )}
                    >
                            แก้ไข
                    </EditButton> : 
                    <></>
                }
                {
                    c.statusInClass && isAdmin && currentRole === 2 ? 
                    <CancelButton sx={{
                        position: 'absolute',
                        right: 'calc(20px + 1vw)',
                        zIndex: 2
                        }}
                        onClick={(event) => 
                          handleOpenCancelModal(
                            c.name, 
                            c._id,
                            event
                        )}
                    >
                            ปิดใช้งาน
                    </CancelButton> : 
                    <></>
                }

              <Typography
                sx={{
                  top: '5rem',
                  left: 'calc(20px + 1vw)',
                  position: 'absolute',
                  fontSize: 'calc(15px + 0.3vw)',
                  color: c.statusInClass ? theme.color.text.secondary : theme.color.text.error,
                  fontWeight: 600
                }}
              >
                { 
                  isAdmin && currentRole === 2 ? 
                    c.statusInClass ?
                    ((isBigScreen ? `เปิดใช้งานวันที่ ` : '') + `${moment(c.startDate).format('DD/MM/YYYY HH:mm')}`) : 
                    'ยังไม่ถูกใช้ในคลาสนี้' :
                  `กำหนดส่งภายในวันที่ ${moment(c.endDate).format('DD/MM/YYYY HH:mm')}`
                }
              </Typography>
            </ListPreviewButton>
          ))}
        </Box>
      </Box>
    </AdminCommonPreviewContainer>
  )
})

export default DocumentPreview
