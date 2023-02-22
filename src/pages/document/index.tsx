import React from "react";
import applicationStore from "../../stores/applicationStore";
import AdminDocumentPreview from "../admin/AdminDocumentPreview";
import DocumentHomePreview from "./DocumentHomePreview";

const DocumentPage = () => {
  const { currentRole, isAdmin, isAdvisor } = applicationStore;
  if (currentRole == 2 && isAdmin) return <AdminDocumentPreview />;
  else if (currentRole == 1 && isAdvisor)
    return <DocumentHomePreview isStudent={false} />;
  return <DocumentHomePreview isStudent={true} />;
};

export default DocumentPage;
