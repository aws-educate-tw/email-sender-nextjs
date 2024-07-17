"use client";
import { FormEvent, useRef } from "react";

export default function Page() {
  const ref = useRef<HTMLFormElement>(null);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;

    console.log(
      (ref.current.querySelector("[id='subject']") as HTMLInputElement).value
    );
    console.log(
      (ref.current.querySelector("[id='display_name']") as HTMLInputElement)
        .value
    );
  };
  return (
    <div className="flex h-screen justify-center items-center">
      <form onSubmit={onSubmit} ref={ref} className="max-w-80">
        <div className="rounded-md bg-neutral-100 p-4">
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter the username"
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
