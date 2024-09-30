"use client";
import { FormEvent, useRef, useState, useEffect } from "react";
import { submitLogin, submitChangePassword } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { ScanEye } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [session, setSession] = useState<string | null>(null);
  const [verificationRequired, setVerificationRequired] =
    useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");

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
      const response = await submitLogin(JSON.stringify(formData));

      console.log(response);
      alert(response.message);

      if (response.message === "Login successful") {
        localStorage.setItem("access_token", response.access_token);

        const tokenExpiryTime = new Date().getTime() + 24 * 60 * 60 * 10000;
        localStorage.setItem("token_expiry_time", tokenExpiryTime.toString());

        router.push("/sendEmail");
      } else if (response.message === "Password reset required for the user") {
        setVerificationRequired(true);
      } else if (response.challengeName === "NEW_PASSWORD_REQUIRED") {
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

    let payload;

    if (session) {
      // If session is available (NEW_PASSWORD_REQUIRED)
      payload = {
        account: account,
        new_password: newPassword,
        session: session,
      };
    } else if (verificationRequired) {
      // If verification code is required (Password reset)
      payload = {
        account: account,
        new_password: newPassword,
        verification_code: verificationCode,
      };
    }

    try {
      const response = await submitChangePassword(JSON.stringify(payload));

      // console.log(response);
      if (
        response.message === "Password changed successfully (First Login)" ||
        response.message === "Password reset successfully (Forgot Password)"
      ) {
        alert("Password changed successfully, please login again");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Password change failed", error);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center pb-12">
      <div className="flex flex-col items-center py-4">
        <p className="text-4xl font-bold pt-2">Let&apos;s sign in first!</p>
        <p className="text-gray-500 italic">Welcome to TPET</p>
      </div>
      <form
        onSubmit={
          session || verificationRequired ? onSubmitNewPassword : onSubmit
        }
        ref={ref}
        className="min-w-80 "
      >
        <div className="flex flex-col gap-3">
          <div className="">
            <label className="mb-2 block text-sm font-medium">Username</label>
            <input
              id="account"
              name="account"
              type="text"
              placeholder="Enter the account"
              className="block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
            />
          </div>

          {!session && !verificationRequired && (
            <div className="relative">
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
                className="absolute right-2 top-12 transform -translate-y-1/2 bg-gray-200 rounded-md p-1 hover:bg-gray-300"
              >
                <ScanEye size={16} />
              </button>
            </div>
          )}

          {(session || verificationRequired) && (
            <>
              {verificationRequired && (
                <div className="relative">
                  <label className="mb-2 block text-sm font-medium">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter verification code again"
                    className="block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
              )}

              <div className="relative">
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
                  className="absolute right-2 top-12 transform -translate-y-1/2 bg-gray-200 rounded-md p-1 hover:bg-gray-300"
                >
                  <ScanEye size={16} />
                </button>
              </div>

              <div className="relative">
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
                  className="absolute right-2 top-12 transform -translate-y-1/2 bg-gray-200 rounded-md p-1 hover:bg-gray-300"
                >
                  <ScanEye size={16} />
                </button>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
            </>
          )}
        </div>
        <div className="flex flex-col my-5">
          <button
            type="submit"
            className="h-10 items-center rounded-lg bg-sky-950 hover:bg-sky-800 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950"
          >
            {session || verificationRequired ? "Change Password" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
