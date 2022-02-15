import Admin from "components/operator";
import { observer } from "mobx-react-lite";

import React from "react";

interface OperatorPageProps {}

export const OperatorPage: React.FC<OperatorPageProps> = observer((props) => {
  return (
    <React.Fragment>
      <Admin />
    </React.Fragment>
  );
});
