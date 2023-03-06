import React from "react";
import applicationStore from "../../stores/applicationStore";
import ClassPreview from "../class/ClassPreview";
import ProjectHomePreview from "../project/ProjectHomePreview";
import ClassJoining from "../class/ClassJoining";
import NotFound from "../other/NotFound";
import ProjectEdit from "../project/ProjectEdit";

const HomePage = () => {
  const { currentRole, project, isAdmin, isAdvisor, classroom, isStudent } =
    applicationStore;
  if ((currentRole === 2 && isAdmin) || (currentRole === 1 && isAdvisor))
    return <ClassPreview />;
  else if (currentRole === 0 && isStudent) {
    if (classroom) {
      if (project) {
        return (
          <ProjectHomePreview
            isStudent={true}
            isCommittee={false}
          />
        );
      } else {
        return (
          <ProjectEdit newProject={true}/>
        )
      }
    }
    else {
      return <ClassJoining/>
    }
  } else return <NotFound/>;
};

export default HomePage;
