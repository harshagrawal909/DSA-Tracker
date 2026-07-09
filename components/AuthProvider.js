"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function SessionSyncInner() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      window.localStorage.setItem("dsa_login_token", JSON.stringify({
        user: session.user,
        expires: session.expires
      }));
    } else {
      window.localStorage.removeItem("dsa_login_token");
    }
  }, [session]);

  return null;
}

export function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <SessionSyncInner />
      {children}
    </SessionProvider>
  );
}
