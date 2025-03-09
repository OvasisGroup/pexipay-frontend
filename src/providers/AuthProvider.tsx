"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      checkAuth?.();
    }
  }, [isHydrated, isAuthenticated, checkAuth]);

  // Don't render anything until hydration is complete
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
