import Borrow from "components/borrow";
import { observer } from "mobx-react-lite";

import React from "react";

interface BorrowPageProps {}

export const BorrowPage: React.FC<BorrowPageProps> = observer((props) => {
  return (
    <React.Fragment>
      <Borrow />
    </React.Fragment>
  );
});
