// src/hooks/useNavRoute.js
import { useNavigate } from 'react-router-dom';

const useNavRoute = () => {
  const navigate = useNavigate();

  // returns a callback you can use in `onClick`
  return (path) => () => navigate(path);
};

export default useNavRoute;
