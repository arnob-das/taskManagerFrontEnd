import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";

const PrivateRoute = ({ children }) => {
  const { pathname } = useLocation();
  const { email, isLoading } = useSelector((state) => state.userSlice);

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !email) {
    return <Navigate to="/login" state={{ path: pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;

