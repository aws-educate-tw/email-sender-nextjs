"use client";
import { FormEvent, useRef, useState, useEffect } from "react";
import { submitLogin, submitChangePassword } from "@/lib/actions";

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
  const [session, setSession] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // for the pw of login and the pw of new password
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false); //for the confirm pw
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  }, [newPassword, confirmPassword]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;
    setShowPassword(false);

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
        console.log(response);
        setSession(response.session);
      }
    } catch (error: any) {
      console.error("Login failed", error);
    }
  };

  const onSubmitNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!ref.current) return;

    const account = (
      ref.current.querySelector("[id='account']") as HTMLInputElement
    ).value;

    const payload = {
      account: account,
      new_password: newPassword,
      session: session,
    };

    try {
      const response = await submitChangePassword(JSON.stringify(payload));
      alert("Password changed successfully");
    } catch (error: any) {
      console.error("Password change failed", error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form
        onSubmit={session ? onSubmitNewPassword : onSubmit}
        ref={ref}
        className="max-w-80"
      >
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

          {!session && (
            <div className="m-3 relative">
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter the password"
                className="block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-12 transform -translate-y-1/2 bg-gray-200 rounded-md px-2 py-1 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          )}

          {session && (
            <>
              <div className="m-3 relative">
                <label className="mb-2 block text-sm font-medium">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-12 transform -translate-y-1/2 bg-gray-200 rounded-md px-2 py-1 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="m-3 relative">
                <label className="mb-2 block text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-12 transform -translate-y-1/2 bg-gray-200 rounded-md px-2 py-1 text-sm"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
            </>
          )}
        </div>
        <div className="w-full flex justify-end my-3 gap-3">
          <button
            type="submit"
            className="flex h-10 items-center rounded-lg bg-sky-950 hover:bg-sky-800 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950"
          >
            {session ? "Change Password" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
