import { Login } from "components/login";
import { observer } from "mobx-react-lite";

interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = observer((props) => {
  return <Login />;
});
