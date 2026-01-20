import { cookies } from "next/headers";
import LoginPage from "@/components/login-form";
import VMDashboard from "@/components/vm-dashboard";

export default async function HomePage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("auth")?.value === "true";

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return <VMDashboard />;
}
