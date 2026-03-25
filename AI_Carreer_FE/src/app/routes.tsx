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
import { MbtiTest } from "./pages/MbtiTest";
import { DiscTest } from "./pages/DiscTest";
import { TestRunner } from "./pages/TestRunner";
import { IntelTest } from "./pages/IntelTest";
import { HollandTest } from "./pages/HollandTest";
import { MbtiResult } from "./pages/MbtiResult";

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
      { path: "mbti-test", Component: MbtiTest },
      { path: "disc-test", Component: DiscTest },
      { path: "intel-test", Component: IntelTest },
      { path: "holland-test", Component: HollandTest },
      { path: "test/:testType", Component: TestRunner },
      { path: "mbti-result", Component: MbtiResult },
      { path: "*", Component: NotFound },
    ],
  },
]);
