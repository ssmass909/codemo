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

import { observer } from "mobx-react";
import { HeaderStoreProvider } from "./providers/HeaderStoreProvider";

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
        <HeaderStoreProvider>
          <RouterProvider router={router} />
        </HeaderStoreProvider>
      </AuthStoreProvider>
    </RootStoreProvider>
  );
};
export default observer(App);
