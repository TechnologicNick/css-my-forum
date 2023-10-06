"use client";

import { Forum } from "@/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-between p-12 gap-10">
      <section className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">CSS-my-forum</h1>
        <h2 className="text-xl font-semibold text-neutral-500 dark:text-gray-200 text-center [text-wrap:balance]">
          Create your own forum with custom CSS
        </h2>
      </section>
      <section>
        <CreateForumCard />
      </section>
      <section className="flex flex-col items-center">
        <p className="text-neutral-500 dark:text-gray-200 italic">
          * Custom styles are moderated by the website admins
        </p>
      </section>
    </main>
  );
}

function CreateForumCard() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <form
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        try {
          const res = await fetch("/api/forum/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          console.log(res);

          if (!res.ok) {
            try {
              const json = await res.json();
              if (json.error) {
                throw new Error(json.error);
              }
            } catch (e) {
              throw new Error(res.statusText);
            }
          }

          setError(null);
          const { forum } = (await res.json()) as { forum: Forum };
          console.log(forum);
          router.push(`/forum/${forum.id}`);
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
      <label htmlFor="name" className="block">
        Forum name
      </label>
      <input
        type="text"
        name="title"
        id="name"
        className="border border-gray-300 rounded-md p-2 bg-transparent mb-4 w-full dark:border-neutral-700"
      />
      <label htmlFor="css" className="block">
        Custom CSS
      </label>
      <textarea
        name="customCss"
        id="css"
        className="border border-gray-300 rounded-md p-2 bg-transparent w-full dark:border-neutral-700"
      />
      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        Create forum
      </button>
    </form>
  );
}
