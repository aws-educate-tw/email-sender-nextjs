"use client";
import { FormEvent, useRef } from "react";
import { submitLogin } from "@/lib/actions";

interface SubmitResponse {
  message: string;
  challengeName: string;
  session: string;
  challengeParameters: {
    USER_ID_FOR_SRP: string;
    requiredAttributes: string;
    userAttributes: string;
  };
}

export default function Page() {
  const ref = useRef<HTMLFormElement>(null);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;

    const formData = {
      account: (ref.current.querySelector("[id='account']") as HTMLInputElement)
        .value,
      password: (
        ref.current.querySelector("[id='password']") as HTMLInputElement
      ).value,
    };

    try {
      const response = (await submitLogin(JSON.stringify(formData))) as
        | SubmitResponse
        | undefined;

      if (response === undefined) {
        console.error("Login failed: No response");
        return;
      }
      console.log("response", response);
      alert(response.message);

      if (response.challengeName == "NEW_PASSWORD_REQUIRED") {
        console.log("New password required");
      }
    } catch (error: any) {
      console.error("Login failed", error);
    }
  };
  return (
    <div className="flex h-screen justify-center items-center">
      <form onSubmit={onSubmit} ref={ref} className="max-w-80">
        <div className="rounded-md bg-neutral-100 p-4">
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">Username</label>
            <input
              id="account"
              name="account"
              type="text"
              placeholder="Enter the account"
              className="block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
            />
          </div>

          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="text"
              placeholder="Enter the password"
              className="block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
            />
          </div>
        </div>
        <div className="w-full flex justify-end my-3 gap-3">
          <button
            type="submit"
            className="flex h-10 items-center rounded-lg bg-sky-950 hover:bg-sky-800 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950"
          >
            login
          </button>
        </div>
      </form>
    </div>
  );
}
