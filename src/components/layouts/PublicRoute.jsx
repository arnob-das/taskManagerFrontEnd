import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";

const PublicRoute = ({ children }) => {
  const { state } = useLocation();
  const { email, isLoading } = useSelector((state) => state.userSlice);

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && email) {
    const from = state?.path || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
