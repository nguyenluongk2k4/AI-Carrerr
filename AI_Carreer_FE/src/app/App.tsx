import { RouterProvider } from "react-router";
import { router } from "./routes";
import { PremiumProvider } from "./utils/usePremium";
import { AuthProvider } from "./utils/useAuth";

export default function App() {
  return (
    <AuthProvider>
      <PremiumProvider>
        <RouterProvider router={router} />
      </PremiumProvider>
    </AuthProvider>
  );
}
