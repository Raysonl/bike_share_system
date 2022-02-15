import Order from "components/order";
import { observer } from "mobx-react-lite";

import React from "react";

interface OrderPageProps {}

export const OrderPage: React.FC<OrderPageProps> = observer((props) => {
  return (
    <React.Fragment>
      <Order />
    </React.Fragment>
  );
});
