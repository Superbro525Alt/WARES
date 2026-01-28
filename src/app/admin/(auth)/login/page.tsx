import { Suspense } from "react";
import AdminLoginClient from "@/app/admin/(auth)/login/login-client";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginClient />
    </Suspense>
  );
}
