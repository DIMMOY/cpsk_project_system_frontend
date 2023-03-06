import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { useMediaQuery } from "react-responsive";
import applicationStore from "../../stores/applicationStore";
import { theme } from "../../styles/theme";
import { LoadingButton } from "@mui/lab";
import SelectAdvisorToProjectDialog from "../../components/Dialog/SelectAdvisorToProjectDialog";
import { listStudentInClass, listUser } from "../../utils/user";
import SelectPartnerToProjectDialog from "../../components/Dialog/SelectPartnerToProjectDialog";
import { createProjectInClass, findProjectInClassForStudent, updateProjectInClass } from "../../utils/project";
import { observer } from "mobx-react";

interface PreviewProps {
  newProject: boolean;
}

const ProjectEdit = observer(({ newProject }: PreviewProps) => {
  const { classroom, user, project } = applicationStore;

  const [id, setId] = useState(null);
  const [nameTH, setNameTH] = useState<string>("");
  const [nameEN, setNameEN] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [scrollToBottom, setScrollToBottom] = useState<number>(0);
  const [advisors, setAdvisors] = useState<Array<any>>([]);
  const [partners, setPartners] = useState<Array<any>>([]);
  const [selectedAdvisors, setSelectedAdvisors] = useState<Array<any>>([]);
  const [selectedPartners, setSelectedPartners] = useState<Array<any>>([]);
  const [listPartners, setListPartners] = useState<Array<any>>([]);
  const [openSelectAdvisor, setOpenSelectAdvisor] = useState<boolean>(false);
  const [openSelectPartner, setOpenSelectPartner] = useState<boolean>(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const navigate = useNavigate();

  const getAdvisors = async () => {
    const result = await listUser({ n: 1 })
    if (result.data) {
      setAdvisors(result.data)
    }
  }

  const getStudents = async () => {
    const result = await listStudentInClass(classroom._id, "false");
    if (result.data) {
      setPartners(result.data.length ? result.data.filter((e: any) => e.email !== user?.email) : [])
    }
  }

  useEffect(() => {
    console.log(classroom, project)
    if (!newProject) {
      if (!project) {
        navigate("/");
      } else {
        const { nameTH, nameEN, description, advisors, partners, _id } = project;
        setId(_id)
        setNameTH(nameTH)
        setNameEN(nameEN)
        setDescription(description)
        setSelectedAdvisors(advisors.map((e: { _id: any; }) => e._id))
        setListPartners(partners)
      }
    }
    getAdvisors()
    getStudents()
  }, []);

  useEffect(() => {
    if (scrollToBottom) window.scrollTo(0, document.body.scrollHeight);
  }, [scrollToBottom]);

  const handleSubmit = async () => {
    setLoading(true);
    if (newProject) {
      const reqBody = { nameTH, nameEN, description, advisors: selectedAdvisors, partners: selectedPartners };
      const createProject = await createProjectInClass(reqBody, classroom._id)
      if (createProject.statusCode === 201) {
        setTimeout(() => {
          setLoading(false)
          navigate(0)
        }, 1300)
      }
      else setLoading(false)
    } else {
      if (id) {
        const reqBody = { nameTH, nameEN, description, advisors: selectedAdvisors, partners: selectedPartners };
        const updateProject = await updateProjectInClass(reqBody, classroom._id, id);
        if (updateProject.statusCode === 200) {
          setTimeout(async () => {
            setLoading(false)
            // refresh data
            const projectInClassRes = await findProjectInClassForStudent(
              classroom._id
            );
            const project = projectInClassRes.data
              ? projectInClassRes.data
              : null;
            applicationStore.setProject(project);
            navigate(0)
            navigate('/')
          }, 1300)
        } else setLoading(false)
      } else {
        console.error("project id not found");
        setLoading(false);
        return;
      }
    }
    setTimeout(() => {
      setLoading(true);
      navigate("/");
    }, 1300);
  };

  const handleOnNameTHChange = (value: string) => {
    const regex = /^[\u0E00-\u0E7F A-Za-z 0-9(),.-]*$/;
    if (regex.test(value)) {
      setNameTH(value);
    }
  };

  const handleOnNameENChange = (value: string) => {
    const regex = /^[A-Za-z 0-9(),.-]*$/;
    if (regex.test(value)) {
      setNameEN(value);
    }
  };

  const handleOpenSelectAdvisor = () => {
    setOpenSelectAdvisor(true)
  }

  const handleOpenSelectStudent = () => {
    setOpenSelectPartner(true)
  }

  const handleSubmitAdvisor = (advisors: Array<any>) => {
    setSelectedAdvisors(advisors)
  }

  const handleSubmitStudent = (students: Array<any>) => {
    setSelectedPartners(students)
  }

  return (
    <AdminCommonPreviewContainer>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography
          sx={{
            fontSize: 45,
            fontWeight: 600,
            marginBottom: 1,
            color: theme.color.text.primary,
          }}
        >
          {"โปรเจกต์ ( * คือต้องใส่ )"}
        </Typography>

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 600,
            color: theme.color.text.secondary,
          }}
        >
          {"ชื่อโปรเจกต์ (ภาษาไทย)"}
        </Typography>

        <TextField
          required
          autoFocus
          placeholder="ปล่อยว่างไว้ก่อนได้"
          id="project-nameTH"
          size="medium"
          value={nameTH}
          inputProps={{ maxLength: 150 }}
          sx={{
            "& fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              padding: "0.25rem",
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => handleOnNameTHChange(e.target.value)}
        />

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 600,
            color: theme.color.text.secondary,
          }}
        >
          {"ชื่อโปรเจกต์ (ภาษาอังกฤษ)"}
        </Typography>

        <TextField
          required
          autoFocus
          placeholder="ปล่อยว่างไว้ก่อนได้"
          id="project-nameEN"
          size="medium"
          value={nameEN}
          inputProps={{ maxLength: 150 }}
          sx={{
            "& fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              padding: "0.25rem",
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => handleOnNameENChange(e.target.value)}
        />

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 600,
            color: theme.color.text.secondary,
          }}
        >
          {"คำอธิบายโปรเจกต์"}
        </Typography>

        <TextField
          multiline
          placeholder="รายละเอียดเกี่ยวกับโปรเจกต์"
          id="project-description"
          size="medium"
          value={description}
          maxRows={12}
          minRows={4}
          inputProps={{ maxLength: 1500, style: { padding: "0.25rem" } }}
          sx={{
            "& fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.color.button.default,
              borderRadius: "10px",
              fontSize: 20,
              color: theme.color.text.secondary,
              fontWeight: 500,
              marginBottom: 2,
            },
          }}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box sx={{display: "flex", flexDirection: "row", marginBottom: newProject ? "1rem" : "0.5rem", marginTop: "0.5rem"}}>
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.color.text.secondary,
              marginRight: "1rem",
            }}
          >
            {"นิสิตที่ทำโปรเจกต์ร่วม (ต้องเข้าคลาสมาก่อน)"}
          </Typography>

          <Button
            sx={{
              width: "7rem",
              height: "2.8rem",
              fontSize: 20,
              background: theme.color.button.default,
              borderRadius: "10px",
              color: theme.color.text.primary,
              boxShadow: "none",
              textTransform: "none",
              "&:hover": { background: "#F6F6F6" },
              "&:disabled": {
                backgroundColor: theme.color.button.disable,
              },
            }}
            onClick={handleOpenSelectStudent}
          >
            {newProject ? "แก้ไข" : "เพิ่ม" }
          </Button>
        </Box>

        {
            !newProject ? 
            <Table sx={{width: isBigScreen ? "40rem" : "100%", marginBottom: "2rem"}}>
              <TableHead>
                <TableCell sx={{ color: theme.color.text.secondary, fontWeight: 500, fontSize: 20, width: "60%" }}>
                  ชื่อ
                </TableCell>
                <TableCell sx={{ color: theme.color.text.secondary, fontWeight: 500, fontSize: 20, width: "40%" }}>
                  อีเมล
                </TableCell>
              </TableHead>
              <TableBody>
                {
                  listPartners.map((user, index) => (
                    <TableRow key={index}>
                    <TableCell sx={{ color: theme.color.text.secondary, fontWeight: 400, fontSize: 16 }}>
                      {user.displayName}
                    </TableCell>
                    <TableCell sx={{ color: theme.color.text.secondary, fontWeight: 400, fontSize: 16 }}>
                      {user.email}
                    </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table> :
            <></>
          }

        <Box sx={{display: "flex", flexDirection: "row"}}>
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.color.text.secondary,
              marginRight: "1rem",
            }}
          >
            {"อาจารย์ที่ปรึกษา *"}
          </Typography>

          <Button
            sx={{
              width: "7rem",
              height: "2.8rem",
              fontSize: 20,
              background: theme.color.button.default,
              borderRadius: "10px",
              color: theme.color.text.primary,
              boxShadow: "none",
              textTransform: "none",
              "&:hover": { background: "#F6F6F6" },
              "&:disabled": {
                backgroundColor: theme.color.button.disable,
              },
            }}
            onClick={handleOpenSelectAdvisor}
          >
            แก้ไข
          </Button>

        </Box>

        <SelectAdvisorToProjectDialog
          open={openSelectAdvisor}
          onClose={() => setOpenSelectAdvisor(false)}
          advisors={advisors}
          submit={handleSubmitAdvisor}
          selectedAdvisors={selectedAdvisors}
        />

        <SelectPartnerToProjectDialog 
          open={openSelectPartner}
          onClose={() => setOpenSelectPartner(false)}
          students={partners}
          submit={handleSubmitStudent}
          selectedStudents={selectedPartners}
        />

        <Box
          sx={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}
        >
          <LoadingButton
            loading={loading}
            sx={{
              width: "7rem",
              height: "2.8rem",
              fontSize: 20,
              background: theme.color.button.primary,
              borderRadius: "10px",
              color: theme.color.text.default,
              boxShadow: "none",
              textTransform: "none",
              "&:hover": { background: "#B07CFF" },
              "&:disabled": {
                backgroundColor: theme.color.button.disable,
              },
            }}
            onClick={handleSubmit}
            disabled={false}
          >
            ยืนยัน
          </LoadingButton>
        </Box>
      </Box>
    </AdminCommonPreviewContainer>
  );
});

export default ProjectEdit;
