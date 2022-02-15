import { observer } from "mobx-react-lite";
import AdminStation from "components/operator/stationPart";
import React from "react";

interface OperatorPageProps {}

export const OperatorStationPage: React.FC<OperatorPageProps> = observer(
  (props) => {
    return (
      <React.Fragment>
        <AdminStation />
      </React.Fragment>
    );
  }
);
