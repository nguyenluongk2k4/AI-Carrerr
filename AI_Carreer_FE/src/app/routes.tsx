import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Assessment } from "./pages/Assessment";
import { Results } from "./pages/Results";
import { Universities } from "./pages/Universities";
import { Roadmap } from "./pages/Roadmap";
import { Premium } from "./pages/Premium";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "assessment", Component: Assessment },
      { path: "results", Component: Results },
      { path: "premium", Component: Premium },
      { path: "universities", Component: Universities },
      { path: "roadmap", Component: Roadmap },
      { path: "*", Component: NotFound },
    ],
  },
]);
