"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login"); // Jika tidak ada session, redirect ke login
    }
  }, [status]);

  if (session) {
    console.log(session);
  }

  // console.log("Ini log function useSession ", useSession());

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome in dashboard page</h1>
      <p>Status kamu : {status}</p>
    </div>
  );
};

export default DashboardPage;
