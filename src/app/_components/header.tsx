"use client";

import { digestMessage } from "@/util";
import { RefObject, useRef, useState } from "react";
import type { LoginResponse } from "../api/user/login/route";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Header with dark and light mode, and a login button
export const Header = () => {
  const loginModalRef = useRef<HTMLDialogElement>(null);

  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/" className="text-2xl font-bold">CSS-my-forum</Link>
      <div className="flex items-center gap-4">
        <button
          id="login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          onClick={() => loginModalRef.current?.showModal()}
        >
          Login
        </button>
      </div>
      <LoginModal dialogRef={loginModalRef} />
    </header>
  );
};

const LoginModal = ({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement> }) => {
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState("");
  const router = useRouter();

  return (
    <dialog ref={dialogRef} className="bg-transparent">
      <form
        method="dialog"
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const data = Object.fromEntries(formData.entries());

          try {
            const res = await fetch("/api/user/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            let json: LoginResponse | null = null;

            if (!res.ok) {
              try {
                json = (await res.json()) as LoginResponse;
                console.log(json)
              } catch (e) {
                throw new Error(res.statusText);
              }
            }

            json ??= (await res.json()) as LoginResponse;
            if ("error" in json) {
              throw new Error(`${json.error}`);
            }

            setError(null);
            console.log("Received session", json.session);
            document.cookie = `session=${json.session};path=/`;

            (e.target as HTMLFormElement).reset();
            dialogRef.current?.close();
            
            router.push(`/flag`);
          } catch (e) {
            console.error(e);
            if (e instanceof Error) {
              setError(`${e.message}`);
            } else {
              setError(`${e}`);
            }
          }
        }}
      >
        {error && <p className="text-red-500 mb-2">Error: {error}</p>}
        <label htmlFor="username" className="block">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          autoFocus
          className="border border-gray-300 rounded-md p-2 bg-transparent mb-4 w-full dark:border-neutral-700"
        />
        <label htmlFor="password" className="block">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="border border-gray-300 rounded-md p-2 bg-transparent mb-4 w-full dark:border-neutral-700"
          onChange={async (e) => {
            const hash = await digestMessage(e.target.value);
            setHash(hash);
          }}
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Login
        </button>
        <input type="hidden" name="hash" value={hash} />
      </form>
    </dialog>
  );
};
