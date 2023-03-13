import {
  Typography,
  Toolbar,
  Box,
  AppBar,
  Menu,
  Fade,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import defaultProfile from "../../assets/images/default_profile.png";
import applicationStore from "../../stores/applicationStore";
import { signOutWithGoogle } from "../../utils/auth";
import { changeCurrentRole } from "../../utils/user";
import Button from "@mui/material/Button";
import { useMediaQuery } from "react-responsive";

// Icon
import DescriptionIcon from "@mui/icons-material/Description";
import GroupsIcon from "@mui/icons-material/Groups";
import ClassIcon from "@mui/icons-material/Class";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import GradingIcon from "@mui/icons-material/Grading";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { theme } from "../../styles/theme";
import { getClassById } from "../../utils/class";

export const NavBar = observer(() => {
  const navigate = useNavigate();
  const { currentRole, isAdmin, isAdvisor, isStudent, classroom } =
    applicationStore;

  const { userId } = applicationStore; // สำหรับทดสอบเท่านั้น

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItems, setMenuItems] = useState<Array<any>>([]);
  const isBigScreen = useMediaQuery({ query: "(min-width: 900px)" });
  const isBigScreenTooltip = useMediaQuery({ query: "(min-width: 1100px)" });
  const responsePadding = isBigScreen
    ? "1.12rem 3rem 1.12rem 3rem"
    : "1.12rem 1.5rem 1.12rem 1.5rem";
  const open = Boolean(anchorEl);
  const buttons = [
    "คลาส",
    "เอกสาร",
    "รายงานพบอาจารย์ที่ปรึกษา",
    "ประเมิน",
    "จัดการตำแหน่ง",
  ];
  const linkButtons = [
    "class",
    "document",
    "meeting-schedule",
    "assessment",
    "role-setting",
  ];
  const firstPathname = window.location.pathname.split("/");

  const [profile, setProfile] = useState<string>(
    applicationStore.user && applicationStore.user.photoURL
      ? applicationStore.user.photoURL
      : defaultProfile
  );

  const onGoogleLogOut = async () => {
    setAnchorEl(null);
    const res = await signOutWithGoogle();
    if (res.statusCode === 200) {
      navigate("/signin");
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeCurrentRole = async (role: number) => {
    const change = await changeCurrentRole({ role });
    if (change.statusCode === 200) {
      navigate("/");
      window.location.reload();
    }
  };

  const handleOnClick = (index: number) => {
    navigate(linkButtons[index]);
  };

  useEffect(() => {
    const menuItems = [];
    if (isStudent && currentRole !== 0)
      menuItems.push({
        name: "เปลี่ยนโหมด 'นิสิต'" as string,
        role: 0 as number,
      });
    if (isAdvisor && currentRole !== 1)
      menuItems.push({
        name: "เปลี่ยนโหมด 'อาจารย์ที่ปรึกษา'" as string,
        role: 1 as number,
      });
    if (isAdmin && currentRole !== 2)
      menuItems.push({
        name: "เปลี่ยนโหมด 'ผู้ดูแลระบบ'" as string,
        role: 2 as number,
      });
    setMenuItems(menuItems);

    const pathname = window.location.pathname.split("/");
    async function getData() {
      if (pathname[1] === "class" && pathname[2]) {
        const classroom = await getClassById(pathname[2]);
        if (classroom.data) applicationStore.setClassroom(classroom.data);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (isBigScreen) applicationStore.setIsShowSideBar(false);
  }, [isBigScreen]);

  return (
    <AppBar
      position="sticky"
      sx={{
        background: theme.color.background.primary,
        display: applicationStore.isShowNavBar ? "flex" : "none",
        minWidth: "30rem",
        textAlign: "center",
        height: isBigScreenTooltip || currentRole !== 2 ? "4.5rem" : "9rem",
        paddingLeft: "4vw",
        paddingRight: "4vw",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flex: { flex: 1 },
      }}
    >
      <Toolbar disableGutters sx={{ height: "4.5rem" }}>
        <Link to="/">
          <img
            style={{
              width: "3.125rem",
              height: "3.125rem",
              display: "flex",
              alignItems: "center",
              zIndex: 2,
              position: "relative",
            }}
            src={logo}
            alt="logo"
          />
        </Link>
        {!isBigScreen &&
        applicationStore.isShowMenuSideBar &&
        currentRole !== 0 ? (
          <IconButton
            aria-label="open drawer"
            onClick={() => applicationStore.setIsShowSideBar(true)}
            edge="start"
            sx={{
              marginLeft: "1.5vw",
              color: theme.color.text.default,
              zIndex: 2,
            }}
          >
            <MenuIcon fontSize="large"></MenuIcon>
          </IconButton>
        ) : (
          <></>
        )}
        {classroom ? (
          <Typography
            sx={{
              fontSize: 20,
              marginLeft: "1.5vw",
              fontWeight: 500,
              cursor: "pointer",
              zIndex: 2,
              color: theme.color.text.default,
            }}
            onClick={() =>
              navigate(
                currentRole === 0
                  ? "/"
                  : `/class/${classroom._id as string}/project`
              )
            }
            onMouseEnter={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
              ((e.target as HTMLSpanElement).style.textDecoration = "underline")
            }
            onMouseLeave={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
              ((e.target as HTMLSpanElement).style.textDecoration = "none")
            }
          >
            {"Classroom: " + classroom.name}
          </Typography>
        ) : (
          <></>
        )}
        {currentRole === 2 ? (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              zIndex: 1,
              top: isBigScreenTooltip ? 0 : "4.5rem",
            }}
          >
            {buttons.map((name, index) => (
              <Tooltip
                key={index}
                TransitionComponent={Fade}
                title={name}
                enterNextDelay={500}
                placement={"bottom"}
                componentsProps={{
                  tooltip: {
                    sx: {
                      color: theme.color.text.default,
                      backgroundColor: theme.color.background.secondary,
                      fontSize: 16,
                      fontWeight: 300,
                    },
                  },
                }}
              >
                <span>
                  <Button
                    sx={{
                      padding: responsePadding,
                      color: theme.color.text.default,
                      borderRadius:
                        firstPathname[1] === linkButtons[index] ||
                        (index === 0 && firstPathname[1] === "")
                          ? 0
                          : "0.75rem",
                      "&:hover": {
                        backgroundColor: "#B67BFD",
                      },
                      margin: "0 0.5rem 0 0.5rem",
                      borderBottom:
                        firstPathname[1] === linkButtons[index] ||
                        (index === 0 && firstPathname[1] === "")
                          ? "5px solid"
                          : "none",
                    }}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    disabled={
                      firstPathname[1] === linkButtons[index] ||
                      (index === 0 && firstPathname[1] === "")
                    }
                    onClick={() => handleOnClick(index)}
                  >
                    {index === 0 ? (
                      firstPathname[1] === linkButtons[index] ||
                      (index === 0 && firstPathname[1] === "") ? (
                        <ClassIcon sx={{ fontSize: 30 }} />
                      ) : (
                        <ClassOutlinedIcon sx={{ fontSize: 30 }} />
                      )
                    ) : index === 1 ? (
                      firstPathname[1] === linkButtons[index] ? (
                        <DescriptionIcon sx={{ fontSize: 30 }} />
                      ) : (
                        <DescriptionOutlinedIcon sx={{ fontSize: 30 }} />
                      )
                    ) : index === 2 ? (
                      firstPathname[1] === linkButtons[index] ? (
                        <GroupsIcon sx={{ fontSize: 30 }} />
                      ) : (
                        <GroupsOutlinedIcon sx={{ fontSize: 30 }} />
                      )
                    ) : index === 3 ? (
                      firstPathname[1] === linkButtons[index] ? (
                        <GradingIcon sx={{ fontSize: 30 }} />
                      ) : (
                        <GradingOutlinedIcon sx={{ fontSize: 30 }} />
                      )
                    ) : firstPathname[1] === linkButtons[index] ? (
                      <ManageAccountsRoundedIcon sx={{ fontSize: 30 }} />
                    ) : (
                      <ManageAccountsOutlinedIcon sx={{ fontSize: 30 }} />
                    )}
                  </Button>
                </span>
              </Tooltip>
            ))}
          </Box>
        ) : (
          <></>
        )}
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            right: 0,
            zIndex: 2,
          }}
        >
          {isBigScreen ? (
            <Typography
              sx={{
                fontSize: 20,
                margin: "0.6vw",
                fontWeight: 500,
                color: theme.color.text.default,
              }}
            >
              {applicationStore.user?.displayName?.split(" ")[0]}
            </Typography>
          ) : (
            <></>
          )}
          <IconButton disableFocusRipple>
            <img
              style={{ width: "3rem", height: "3rem", borderRadius: "50%" }}
              src={profile}
              alt="profile"
              onClick={handleClick}
            />
          </IconButton>
        </Box>
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disableScrollLock
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ top: "0.5rem" }}
        >
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleClose();
            }}
          >
            ตั้งค่า
          </MenuItem>
          {menuItems.map((menu) => (
            <MenuItem
              key={menu.role}
              onClick={() => handleChangeCurrentRole(menu.role)}
            >
              {menu.name as string}
            </MenuItem>
          ))}
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={onGoogleLogOut}>ออกจากระบบ</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
});
