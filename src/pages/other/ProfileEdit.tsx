import React, { useEffect, useState } from "react";
import { CommonPreviewContainer } from "../../styles/layout/_preview/_previewCommon";
import { Box, TextField, Typography } from "@mui/material";
import { theme } from "../../styles/theme";
import defaultProfile from "../../assets/images/default_profile.png";
import applicationStore from "../../stores/applicationStore";
import { LoadingButton } from "@mui/lab";
import { updateUser } from "../../utils/user";
import { Navigate, useNavigate } from "react-router";
import { CancelButton } from "../../styles/layout/_button";
import LeaveProjectModal from "../../components/Modal/LeaveProjectModal";
import LeaveClassModal from "../../components/Modal/LeaveClassModal";

const ProfileEdit = () => {
  const { user, currentRole, classroom, project } = applicationStore;
  const profile = user && user.photoURL ? user.photoURL : defaultProfile;

  const displayName = applicationStore.user?.displayName?.split(" ");
  const [name, setName] = useState<string>(
    displayName && displayName[0] ? displayName[0] : ""
  );
  const [surname, setSurname] = useState<string>(
    displayName && displayName[1] ? displayName[1] : ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openLeaveProjectModal, setOpenLeaveProjectModal] =
    useState<boolean>(false);
  const [openLeaveClassModal, setOpenLeaveClassModal] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const handleNameChange = (name: string) => {
    const regex = /^[\u0E00-\u0E7F]*$/;
    if (regex.test(name)) {
      setName(name);
    }
  };

  const handleSurNameChange = (surname: string) => {
    const regex = /^[\u0E00-\u0E7F]*$/;
    if (regex.test(surname)) {
      setSurname(surname);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await updateUser(name, surname);
    if (res.statusCode !== 200) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      applicationStore.setUser({ ...user, displayName: `${name} ${surname}` });
      navigate("/");
    }, 1000);
  };

  return (
    <CommonPreviewContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            style={{
              width: "10rem",
              height: "10rem",
              borderRadius: "50%",
              border: `10px solid ${theme.color.background.primary}`,
              marginBottom: "2rem",
            }}
            src={profile}
            alt="profile"
          />

          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.color.text.secondary,
            }}
          >
            {"ชื่อ (ภาษาไทย)"}
          </Typography>

          <TextField
            required
            autoFocus
            id="assessment-title"
            size="medium"
            value={name}
            inputProps={{ maxLength: 150, style: { textAlign: "center" } }}
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
            onChange={(e) => handleNameChange(e.target.value)}
          />

          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.color.text.secondary,
            }}
          >
            {"นามสกุล (ภาษาไทย)"}
          </Typography>

          <TextField
            required
            id="assessment-title"
            size="medium"
            value={surname}
            inputProps={{ maxLength: 150, style: { textAlign: "center" } }}
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
            onChange={(e) => handleSurNameChange(e.target.value)}
          />

          <LoadingButton
            loading={loading}
            sx={{
              width: "7rem",
              height: "2.8rem",
              marginTop: "1.5rem",
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
            disabled={!name.length || !surname.length}
          >
            ยืนยัน
          </LoadingButton>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {currentRole === 0 && project ? (
              <>
                <CancelButton
                  sx={{ width: "12rem", marginTop: "10rem" }}
                  onClick={() => setOpenLeaveProjectModal(true)}
                >
                  ออกจากโปรเจกต์
                </CancelButton>
                <LeaveProjectModal
                  open={openLeaveProjectModal}
                  onClose={() => setOpenLeaveProjectModal(false)}
                />
              </>
            ) : (
              <></>
            )}
            {currentRole === 0 && !project && classroom ? (
              <>
                <CancelButton
                  sx={{ width: "12rem", marginTop: "10rem" }}
                  onClick={() => setOpenLeaveClassModal(true)}
                >
                  ออกจากคลาส
                </CancelButton>
                <LeaveClassModal
                  open={openLeaveClassModal}
                  onClose={() => setOpenLeaveClassModal(false)}
                />
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Box>
    </CommonPreviewContainer>
  );
};

export default ProfileEdit;
