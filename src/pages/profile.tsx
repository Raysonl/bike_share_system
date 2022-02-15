import { Profile } from "components/profile";
import { observer } from "mobx-react-lite";

import React from "react";

interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = observer((props) => {
  return (
    <React.Fragment>
      <Profile />
    </React.Fragment>
  );
});
