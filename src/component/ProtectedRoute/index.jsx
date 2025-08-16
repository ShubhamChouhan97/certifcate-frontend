// import { Navigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState } from "react";

// const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

// const ProtectedRoute = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const verifyUser = async () => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/auth/me`,
//         { message: "hi" }, // Body data
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true, // To send cookies
//         }
//       );
//       if (response.data.user) setIsAuthenticated(true);
//     } catch (error) {
//         setIsAuthenticated(false);
//       }
//     };
//     verifyUser();
//   }, []);

//   if (isAuthenticated === null) return <div>Loading...</div>;
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spin } from "antd"; // Ant Design Spin

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/auth/me`,
          { message: "hi" },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.data.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuthenticated === null) {
    // Ant Design Spin Loader
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Verifying user..." />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
