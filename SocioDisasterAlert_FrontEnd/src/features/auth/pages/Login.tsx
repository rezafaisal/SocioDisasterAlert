import { Helmet } from "react-helmet-async";
import { LoginForm } from "../components/LoginForm";

export const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login Page" />
      </Helmet>
      <LoginForm />
    </>
  );
};
