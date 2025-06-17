import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPageRouteObject } from "./pages/LandingPage/LandingPage";
import { GuideDetailsPageRouteObject } from "./pages/GuideDetailsPage/GuideDetailsPage";
import { GuideListPageRouteObject } from "./pages/GuidesListPage/GuideListPage";

const App = () => {
  const router = createBrowserRouter([LandingPageRouteObject, GuideDetailsPageRouteObject, GuideListPageRouteObject]);
  return <RouterProvider router={router} />;
};
export default App;
