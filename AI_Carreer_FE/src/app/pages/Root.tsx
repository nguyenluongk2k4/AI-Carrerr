import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { AIChatAssistant } from "../components/AIChatAssistant";

export function Root() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <Outlet />
      <AIChatAssistant />
    </div>
  );
}
