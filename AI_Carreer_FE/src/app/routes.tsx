import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Landing } from "./pages/Landing";
import { Assessment } from "./pages/Assessment";
import { Results } from "./pages/Results";
import { Universities } from "./pages/Universities";
import { Roadmap } from "./pages/Roadmap";
import { Premium } from "./pages/Premium";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Landing },
      { path: "assessment", Component: Assessment },
      { path: "results", Component: Results },
      { path: "premium", Component: Premium },
      { path: "universities", Component: Universities },
      { path: "roadmap", Component: Roadmap },
      { path: "*", Component: NotFound },
    ],
  },
]);
