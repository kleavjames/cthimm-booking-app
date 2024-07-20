import useAuthStore from "@/store/authStore";
import { FC, ReactNode, Suspense, useMemo } from "react";
import { Navigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

type ProtectedProps = {
  children: ReactNode;
};

const Protected: FC<ProtectedProps> = ({ children }) => {
  const [token, expiresAt] = useAuthStore(
    useShallow((state) => [state.token, state.expiresAt, state.expiresIn])
  );

  const isAuthenticated = useMemo(() => {
    if (!expiresAt) return false;
    return !!token && expiresAt < Date.now();
  }, [expiresAt, token]);

  if (isAuthenticated) {
    return <Suspense>{children}</Suspense>;
  }

  return <Navigate to="/" />;
};

export default Protected;
