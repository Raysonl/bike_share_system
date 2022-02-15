import { Register } from "components/register";
import { observer } from "mobx-react-lite";

interface RegisterPageProps {}

export const RegisterPage: React.FC<RegisterPageProps> = observer((props) => {
  return <Register />;
});
