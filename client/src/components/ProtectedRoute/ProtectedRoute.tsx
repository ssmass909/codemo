import { useAuthStore } from "../../providers/AuthStoreProvider";
import { Navigate } from "react-router";
import { observer } from "mobx-react";
import { useEffect, useState, type ReactNode } from "react";
import { useRootStore } from "../../providers/RootStoreProvider";

interface ProtectedRouteProps {
  redirectPath?: string;
  children: ReactNode;
}

const ProtectedRoute = ({ redirectPath = "/", children }: ProtectedRouteProps) => {
  const authStore = useAuthStore();
  const rootStore = useRootStore();

  useEffect(() => {
    if (!authStore.loggedIn) {
      rootStore.headerStore?.setLoginModalOpen(true);
    }
  }, [authStore.loggedIn, rootStore.headerStore]);

  if (!authStore.loggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
export default ProtectedRoute;
