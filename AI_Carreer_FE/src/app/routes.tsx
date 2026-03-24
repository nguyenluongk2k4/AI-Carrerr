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
import { IntelResult } from "./pages/IntelResult";
import { HollandResult } from "./pages/HollandResult";
import { DiscResult } from "./pages/DiscResult";
import { AbilityTest } from "./pages/AbilityTest";
import { AbilityRunnerFixed } from "./pages/AbilityRunnerFixed";
import { Profile } from "./pages/Profile";
import { CareerProcess } from "./pages/CareerProcess";
import { UsageGuide } from "./pages/UsageGuide";
import { Faq } from "./pages/Faq";
import { Pricing } from "./pages/Pricing";

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
      { path: "process", Component: CareerProcess },
      { path: "guide", Component: UsageGuide },
      { path: "faq", Component: Faq },
      { path: "pricing", Component: Pricing },
      { path: "mbti-test", Component: MbtiTest },
      { path: "disc-test", Component: DiscTest },
      { path: "intel-test", Component: IntelTest },
      { path: "holland-test", Component: HollandTest },
      { path: "test/:testType", Component: TestRunner },
      { path: "ability", Component: AbilityTest },
      { path: "ability/test/:subject", Component: AbilityRunnerFixed },
      { path: "profile", Component: Profile },
      { path: "mbti-result", Component: MbtiResult },
      { path: "intel-result", Component: IntelResult },
      { path: "holland-result", Component: HollandResult },
      { path: "disc-result", Component: DiscResult },
      { path: "*", Component: NotFound },
    ],
  },
]);
