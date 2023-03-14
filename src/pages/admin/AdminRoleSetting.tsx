import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminCommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import {
  ActivateButton,
  CancelButton,
  EditButton,
  ListPreviewButton,
} from "../../styles/layout/_button";
import defaultProfile from "../../assets/images/default_profile.png";
import moment from "moment";
import applicationStore from "../../stores/applicationStore";
import { observer } from "mobx-react";
import { theme } from "../../styles/theme";
import { addRoleInUser, deleteRoleInUser, listUser } from "../../utils/user";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useMediaQuery } from "react-responsive";
import UserAddRoleModal from "../../components/Modal/UserAddRoleModal";

const AdminRoleSetting = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { isAdmin, currentRole, user } = applicationStore;
  const [admins, setAdmins] = useState<Array<any>>([]);
  const [advisors, setAdvisors] = useState<Array<any>>([]);
  const [adminDelete, setAdminDelete] = useState<Array<any>>([]);
  const [advisorDelete, setAdvisorDelete] = useState<Array<any>>([]);
  const [adminReal, setAdminReal] = useState<Array<any>>([]);
  const [advisorReal, setAdvisorReal] = useState<Array<any>>([]);
  const [isEditAdmin, setIsEditAdmin] = useState<boolean>(false);
  const [isEditAdvisor, setIsEditAdvisor] = useState<boolean>(false);
  const [openAdminModal, setOpenAdminModal] = useState<boolean>(false);
  const [openAdvisiorModal, setOpenAdvisorModal] = useState<boolean>(false);

  const isBigScreen = useMediaQuery({ query: "(min-width: 540px)" });

  const getData = async () => {
    const admins = await listUser({ n: 2 });
    if (admins.data) {
      setAdmins(admins.data);
      setAdminReal(admins.data);
    }
    const advisors = await listUser({ n: 1 });
    if (advisors.data) {
      setAdvisors(advisors.data);
      setAdvisorReal(advisors.data);
    }
  };

  const deleteAdmin = (index: number) => {
    setAdminDelete([...adminDelete, admins[index]]);
    const removeAdmin = admins.filter((_, i) => i !== index);
    setAdmins(removeAdmin);
  };

  const deleteAdvisor = (index: number) => {
    setAdvisorDelete([...advisorDelete, advisors[index]]);
    const removeAdvisor = advisors.filter((_, i) => i !== index);
    setAdvisors(removeAdvisor);
  };

  const submitToSubmitAdmin = async () => {
    const userId = adminDelete.map((e) => e.userId._id);
    const res = await deleteRoleInUser({ userId, role: 2 });
    if (res.statusCode !== 200) {
      console.error(res.message);
    } else {
      setIsEditAdmin(false);
      setAdminDelete([]);
      await getData();
    }
  };

  const submitToSubmitAdvisor = async () => {
    const userId = advisorDelete.map((e) => e.userId._id);
    const res = await deleteRoleInUser({ userId, role: 1 });
    if (res.statusCode !== 200) {
      console.error(res.message);
    } else {
      if (advisorDelete.find((e) => e.userId.email === user?.email)) {
        navigate(0);
      }
      setIsEditAdvisor(false);
      setAdvisorDelete([]);
      await getData();
    }
  };

  const cancelToSubmitAdmin = () => {
    setAdmins(adminReal);
    setAdminDelete([]);
    setIsEditAdmin(false);
  };

  const cancelToSubmitAdvisor = () => {
    setAdvisors(advisorReal);
    setAdvisorDelete([]);
    setIsEditAdvisor(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AdminCommonPreviewContainer>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Typography
            sx={{
              fontSize: 45,
              fontWeight: 600,
              color: theme.color.text.primary,
              marginRight: "1rem",
            }}
          >
            แอดมิน
          </Typography>
          {!isEditAdmin ? (
            <>
              <ActivateButton
                sx={{ width: "5rem", marginRight: "1rem" }}
                onClick={() => setOpenAdminModal(true)}
              >
                เพิ่ม
              </ActivateButton>
              <UserAddRoleModal
                open={openAdminModal}
                onClose={() => setOpenAdminModal(false)}
                role={2}
                refresh={getData}
                title="เพิ่มแอดมิน"
              />
              <EditButton onClick={() => setIsEditAdmin(true)}>
                แก้ไข
              </EditButton>
            </>
          ) : (
            <></>
          )}
          {isEditAdmin ? (
            <>
              <ActivateButton
                sx={{ width: "5rem" }}
                onClick={submitToSubmitAdmin}
              >
                บันทึก
              </ActivateButton>
              <CancelButton
                sx={{ marginLeft: "1rem", width: "5rem" }}
                onClick={cancelToSubmitAdmin}
              >
                ยกเลิก
              </CancelButton>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: "1rem",
            justifyContent: "left",
            textAlign: "center",
          }}
        >
          {admins.map((c, index) => (
            <Box
              key={`admin-${index}`}
              sx={{
                marginTop: "1rem",
                marginRight: "1rem",
                backgroundColor: theme.color.background.tertiary,
                border: `5px solid ${theme.color.background.primary}`,
                padding: "1rem",
                borderRadius: "20px",
                width: "10rem",
                position: "relative",
              }}
            >
              <img
                style={{
                  width: "8rem",
                  height: "8rem",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
                src={c.userId.imageUrl ? c.userId.imageUrl : defaultProfile}
                alt={`admin-${index}`}
              />
              <Typography sx={{ color: theme.color.text.secondary }}>
                {c.userId.displayName && c.userId.displayName.length
                  ? c.userId.displayName
                  : "..."}
              </Typography>
              <Typography sx={{ color: theme.color.text.secondary }}>
                {c.userId.email}
              </Typography>
              {isEditAdmin && user?.email !== c.userId.email && (
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "-0.25rem",
                    right: "-0.25rem",
                    zIndex: 2,
                  }}
                  onClick={() => deleteAdmin(index)}
                >
                  <RemoveCircleIcon
                    sx={{ fontSize: "125%", color: theme.color.button.error }}
                  />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <Typography
            sx={{
              fontSize: 45,
              fontWeight: 600,
              color: theme.color.text.primary,
              marginRight: isBigScreen ? "1rem" : "0rem",
            }}
          >
            อาจารย์ที่ปรึกษา
          </Typography>
          {!isEditAdvisor ? (
            <>
              <ActivateButton
                sx={{ width: "5rem", marginRight: "1rem" }}
                onClick={() => setOpenAdvisorModal(true)}
              >
                เพิ่ม
              </ActivateButton>
              <EditButton onClick={() => setIsEditAdvisor(true)}>
                แก้ไข
              </EditButton>
              <UserAddRoleModal
                open={openAdvisiorModal}
                onClose={() => setOpenAdvisorModal(false)}
                role={1}
                refresh={getData}
                title="เพิ่มอาจารย์ที่ปรึกษา"
              />
            </>
          ) : (
            <></>
          )}
          {isEditAdvisor ? (
            <>
              <ActivateButton
                sx={{ width: "5rem" }}
                onClick={submitToSubmitAdvisor}
              >
                บันทึก
              </ActivateButton>
              <CancelButton
                sx={{ marginLeft: "1rem", width: "5rem" }}
                onClick={cancelToSubmitAdvisor}
              >
                ยกเลิก
              </CancelButton>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: "1rem",
            justifyContent: "left",
            textAlign: "center",
          }}
        >
          {advisors.map((c, index) => (
            <Box
              key={`advisor-${index}`}
              sx={{
                marginTop: "1rem",
                marginRight: "1rem",
                backgroundColor: theme.color.background.tertiary,
                border: `5px solid ${theme.color.background.primary}`,
                padding: "1rem",
                borderRadius: "20px",
                width: "10rem",
                position: "relative",
              }}
            >
              <img
                style={{
                  width: "8rem",
                  height: "8rem",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
                src={c.userId.imageUrl ? c.userId.imageUrl : defaultProfile}
                alt={`advisor-${index}`}
              />
              <Typography sx={{ color: theme.color.text.secondary }}>
                {c.userId.displayName && c.userId.displayName.length
                  ? c.userId.displayName
                  : "..."}
              </Typography>
              <Typography sx={{ color: theme.color.text.secondary }}>
                {c.userId.email}
              </Typography>
              {isEditAdvisor && (
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "-0.25rem",
                    right: "-0.25rem",
                    zIndex: 2,
                  }}
                  onClick={() => deleteAdvisor(index)}
                >
                  <RemoveCircleIcon
                    sx={{ fontSize: "125%", color: theme.color.button.error }}
                  />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </AdminCommonPreviewContainer>
  );
});

export default AdminRoleSetting;
