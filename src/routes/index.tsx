import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import { NavBar } from "../components/Navbar/Navbar";
import Login from "../pages/login/login";
import ProjectHomePreview from "../pages/project/ProjectHomePreview";
import DocumentHomePreview from "../pages/document/DocumentHomePreview";
import MeetingScheduleHomePreview from "../pages/meetingschedule/MeetingScheduleHomePreview";
import ClassPreview from "../pages/class/ClassPreview";
import DocumentDetail from "../pages/document/DocumentDetail";
import MeetingScheduleDetail from "../pages/meetingschedule/MeetingScheduleDetail";
import HomePage from "../pages/home";
import ProjectPreview from "../pages/project/ProjectPreview";
import DocumentPage from "../pages/document";
import MeetingSchedulePage from "../pages/meetingschedule";
import DocumentPreview from "../pages/document/DocumentPreview";
import MeetingSchedulePreview from "../pages/meetingschedule/MeetingSchedulePreview";
import AssessmentPage from "../pages/assessment";
import AssessmentEdit from "../pages/assessment/AssessmentEdit";
import NotFound from "../pages/other/NotFound";
import NotStudentRoute from "./NotStudentRoute";
import NotAdvisorRoute from "./NotAdvisorRoute";
import AdminRoleSetting from "../pages/admin/AdminRoleSetting";
import MatchCommitteePreview from "../pages/committee/MatchCommitteePreview";
import MatchCommitteeEdit from "../pages/committee/MatchCommitteeEdit";
import AssessmentPreview from "../pages/assessment/AssessmentPreview";
import HaveClassRoute from "./HaveClassRoute";
import HaveProjectRoute from "./HaveProjectRoute";
import ProjectPage from "../pages/project";
import DocumentOverview from "../pages/document/DocumentOverview";
import MeetingScheduleOverview from "../pages/meetingschedule/MeetingScheduleOverview";

const Routers: React.FC = (): JSX.Element => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<Login />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />

          <Route element={<NotStudentRoute />}>
            <Route element={<NotAdvisorRoute />}>
              <Route path="/role-setting" element={<AdminRoleSetting />} />
            </Route>

            <Route path="/class" element={<ClassPreview />} />
            <Route path="/class/:id/project" element={<ProjectPreview />} />
            <Route
              path="/class/:id/project/:projectId"
              element={
                <ProjectHomePreview isStudent={false} isCommittee={false} />
              }
            />
            <Route
              path="/class/:id/project/:projectId/document"
              element={<DocumentHomePreview isStudent={false} />}
            />
            <Route
              path="/class/:id/project/:projectId/document/:documentId"
              element={<DocumentDetail isStudent={false} />}
            />
            <Route
              path="/class/:id/project/:projectId/meeting-schedule"
              element={<MeetingScheduleHomePreview isStudent={false} />}
            />
            <Route
              path="/class/:id/project/:projectId/meeting-schedule/:mtId"
              element={<MeetingScheduleDetail isStudent={false} />}
            />
            <Route path="/class/:id/document" element={<DocumentPreview />} />
            <Route
              path="/class/:id/document/overview"
              element={<DocumentPreview />}
            />
            <Route
              path="/class/:id/document/overview/:documentId"
              element={<DocumentOverview />}
            />
            <Route path="/class/:id/assessment" element={<AssessmentPreview />} />
            <Route path="/class/:id/committee" element={<MatchCommitteePreview />} />
            <Route path="/class/:id/committee/:committeeId" element={<MatchCommitteeEdit newForm={true}/>}/>
            <Route
              path="/class/:id/meeting-schedule"
              element={<MeetingSchedulePreview />}
            />
            <Route
              path="/class/:id/meeting-schedule/overview"
              element={<MeetingSchedulePreview />}
            />
            <Route
              path="/class/:id/meeting-schedule/overview/:mtId"
              element={<MeetingScheduleOverview />}
            />
          </Route>

          <Route element={<NotAdvisorRoute />}>
            <Route element={<HaveClassRoute />}>
              <Route element={<HaveProjectRoute />}>
                <Route path="/project" element={<ProjectPage />} />
                <Route path="/document" element={<DocumentPage />} />
                <Route
                  path="/document/:id"
                  element={<DocumentDetail isStudent={true} />}
                />
                <Route path="/meeting-schedule" element={<MeetingSchedulePage />} />
                <Route
                  path="/meeting-schedule/:id"
                  element={<MeetingScheduleDetail isStudent={true} />}
                />
                <Route path="/assessment" element={<AssessmentPage />} />
              </Route>
            </Route>

            <Route element={<NotStudentRoute />}>
              <Route
                path="/assessment/create"
                element={<AssessmentEdit newForm={true} />}
              />
              <Route
                path="/assessment/edit"
                element={<AssessmentEdit newForm={false} />}
              />
            </Route>
          </Route>

          {/* Page Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routers;
