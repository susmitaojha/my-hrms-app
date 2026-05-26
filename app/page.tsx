"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // If user is logged in, redirect to dashboard
    if (token) {
      router.push("/dashboard");
    } else {
      // If not logged in, redirect to login page
      router.push("/login");
    }
  }, [router]);

  // Return null while redirecting to prevent rendering
  return null;
}
