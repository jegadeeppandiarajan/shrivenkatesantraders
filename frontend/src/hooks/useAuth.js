import { useSelector } from "react-redux";

const useAuth = () => {
  const authState = useSelector((state) => state.auth);
  return authState;
};

export default useAuth;
