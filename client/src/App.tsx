import { createBrowserRouter, RouterProvider } from "react-router";
import GlobalLayout from "./components/GlobalLayout/GlobalLayout";
import "./global/colors.css";
import "./global/globals.css";
import { useEffect } from "react";
import { AuthStoreProvider } from "./providers/AuthStoreProvider";
import { RootStoreProvider } from "./providers/RootStoreProvider";
import { observer } from "mobx-react";
import { HeaderStoreProvider } from "./providers/HeaderStoreProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import CreateGuidePage from "./pages/CreateGuidePage/CreateGuidePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import GuideDetailsPage from "./pages/GuideDetailsPage/GuideDetailsPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import UserPage from "./pages/UserPage/UserPage";

const App = () => {
  useEffect(() => {
    document.body.classList.add("font-loading");
    document.fonts.ready.then(() => {
      document.body.classList.remove("font-loading");
    });
  }, []);

  const router = createBrowserRouter([
    {
      Component: GlobalLayout,
      children: [
        { Component: LandingPage, path: "/" },
        {
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
          path: "/dashboard",
        },
        { path: "/guide/:id", Component: GuideDetailsPage },
        { Component: UserPage, path: "/user/:id" },
        {
          element: (
            <ProtectedRoute>
              <CreateGuidePage />
            </ProtectedRoute>
          ),
          path: "/create-guide",
        },
        {
          element: (
            <ProtectedRoute>
              <GuideDetailsPage />
            </ProtectedRoute>
          ),
          path: "/guide/:id",
        },
      ],
    },
  ]);
  return (
    <RootStoreProvider>
      <AuthStoreProvider>
        <HeaderStoreProvider>
          <RouterProvider router={router} />
        </HeaderStoreProvider>
      </AuthStoreProvider>
    </RootStoreProvider>
  );
};
export default observer(App);
