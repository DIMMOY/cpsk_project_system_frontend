import React from "react";
import applicationStore from "../../stores/applicationStore";
import ClassPreview from "../class/ClassPreview";
import ProjectHomePreview from "../project/ProjectHomePreview";
import ClassJoining from "../class/ClassJoining";

const HomePage = () => {
  const { currentRole, isAdmin, isAdvisor, classroom, isStudent } =
    applicationStore;
  if ((currentRole === 2 && isAdmin) || (currentRole === 1 && isAdvisor))
    return <ClassPreview />;
  else if (currentRole === 0 && isStudent && classroom) {
    console.log("TEST");
    return (
      <ProjectHomePreview
        isStudent={true}
        isCommittee={false}
      ></ProjectHomePreview>
    );
  } else return <ClassJoining></ClassJoining>;
};

export default HomePage;
