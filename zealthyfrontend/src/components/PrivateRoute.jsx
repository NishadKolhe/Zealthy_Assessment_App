import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const patient = localStorage.getItem("patient");

  if (!patient) {
    return <Navigate to="/" replace />;
  }

  return children;
}
