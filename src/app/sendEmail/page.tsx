"use client";
import SendEmailForm from "@/app/ui/send-email-form";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

export default function Page() {
  // const router = useRouter();

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const checkLoginStatus = async () => {
  //   const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
  //   const url = new URL(`${base_url}/auth/is-logged-in`);
  //   const accessToken = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("accessToken="))
  //     ?.split("=")[1];

  //   try {
  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         credentials: "include",
  //       },
  //     });

  //     const result = await response.json();
  //     console.log("Log in or not:", result);
  //     return result.loggedIn;
  //   } catch (error) {
  //     console.error("Failed to check login status:", error);
  //     return false;
  //   }
  // };
  // useEffect(() => {
  //   console.log("checkLoginStatus function called");
  //   const verifyLoginStatus = async () => {
  //     const loggedIn = await checkLoginStatus();
  //     if (!loggedIn) {
  //       // router.push("/login");
  //       console.log("not logged in");
  //     } else {
  //       setIsLoggedIn(true);
  //     }
  //   };
  //   console.log("isLoggedIn", isLoggedIn);
  //   verifyLoginStatus();
  //   console.log("isLoggedInAfter", isLoggedIn);
  // }, [router]);
  return (
    <div>
      <SendEmailForm />
    </div>
  );
}
