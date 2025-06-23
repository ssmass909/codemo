import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPageRouteObject } from "./pages/LandingPage/LandingPage";
import { GuideDetailsPageRouteObject } from "./pages/GuideDetailsPage/GuideDetailsPage";
import { GuideListPageRouteObject } from "./pages/GuidesListPage/GuideListPage";
import GlobalLayout from "./components/GlobalLayout/GlobalLayout";
import "./global/colors.css";
import "./global/globals.css";
import { useEffect } from "react";
import { AuthStoreProvider } from "./providers/AuthStoreProvider";
import { RootStoreProvider } from "./providers/RootStoreProvider";
import { userPageRouteObject } from "./pages/UserPage/UserPage";
import { DashboardPageRouteObject } from "./pages/DashboardPage/DashboardPage";

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
        LandingPageRouteObject,
        DashboardPageRouteObject,
        GuideDetailsPageRouteObject,
        GuideListPageRouteObject,
        userPageRouteObject,
      ],
    },
  ]);
  return (
    <RootStoreProvider>
      <AuthStoreProvider>
        <RouterProvider router={router} />
      </AuthStoreProvider>
    </RootStoreProvider>
  );
};
export default App;
