import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import { fetchCurrentUser, logoutSuccess } from "./features/auth/authSlice";
import ErrorBoundary from "./components/ErrorBoundary";
import { setLogoutCallback } from "./services/api";

const App = () => {
  const dispatch = useDispatch();
  const { initialized, token } = useSelector((state) => state.auth);

  // Set up logout callback for API interceptor (handles 401 errors)
  useEffect(() => {
    setLogoutCallback(() => {
      dispatch(logoutSuccess());
    });
  }, [dispatch]);

  useEffect(() => {
    // Only fetch user if we have a token and haven't initialized yet
    if (token && !initialized) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized, token]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SocketProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </SocketProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

