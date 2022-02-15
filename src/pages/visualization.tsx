import Dashboard from "components/manager";
import { observer } from "mobx-react-lite";

import React from "react";

interface OperatorPageProps { }

export const OperatorDataAnalyticPage: React.FC<OperatorPageProps> = observer((props) => {
    return (
        <React.Fragment>
            <Dashboard />
        </React.Fragment>
    );
});
