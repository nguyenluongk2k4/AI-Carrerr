import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { AIChatAssistantSimple } from "../components/AIChatAssistantSimple";

export function Root() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <Outlet />
      <AIChatAssistantSimple />
    </div>
  );
}
