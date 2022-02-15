import { observer } from "mobx-react-lite";
import AdminStation from "components/operator/repairPart";
import React from "react";

interface OperatorRepairProps {}

export const OperatorRepairPage: React.FC<OperatorRepairProps> = observer(
  (props) => {
    return (
      <React.Fragment>
        <AdminStation />
      </React.Fragment>
    );
  }
);
