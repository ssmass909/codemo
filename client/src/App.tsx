import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPageRouteObject } from "./pages/LandingPage/LandingPage";
import { GuideDetailsPageRouteObject } from "./pages/GuideDetailsPage/GuideDetailsPage";
import { GuideListPageRouteObject } from "./pages/GuidesListPage/GuideListPage";
import GlobalLayout from "./components/GlobalLayout/GlobalLayout";
import "./global/colors.css";
import "./global/globals.css";

const App = () => {
  const router = createBrowserRouter([
    {
      Component: GlobalLayout,
      children: [LandingPageRouteObject, GuideDetailsPageRouteObject, GuideListPageRouteObject],
    },
  ]);
  return <RouterProvider router={router} />;
};
export default App;
