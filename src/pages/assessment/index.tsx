import React from "react";
import applicationStore from "../../stores/applicationStore";
import AdminAssessmentPreview from "../admin/AdminAssessmentPreview";
import AssessmentPreview from "./AssessmentPreview";
import MeetingScheduleHomePreview from "../meetingschedule/MeetingScheduleHomePreview";
import AssessmentHomePreview from "./AssessmentHomePreview";

const AssessmentPage = () => {
  const { currentRole, isAdmin, isAdvisor } = applicationStore;
  if (currentRole == 2 && isAdmin) return <AdminAssessmentPreview />;
  return <AssessmentHomePreview isStudent={true} />;
};

export default AssessmentPage;
