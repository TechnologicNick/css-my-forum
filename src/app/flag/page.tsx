import { getUserBySession } from "@/database";
import { cookies } from "next/headers";

function Flag() {
  const session = cookies().get("session");
  if (!session) {
    return <h1 className="text-4xl font-bold">Unauthenticated</h1>;
  }

  const user = getUserBySession(session.value);
  if (!user) {
    return <h1 className="text-4xl font-bold">Invalid session</h1>;
  }

  if (!user.isAdmin) {
    return <h1 className="text-4xl font-bold">Unauthorized</h1>;
  }

  return <h1 className="text-4xl font-bold">{process.env.FLAG}</h1>;
}

export default function FlagPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] p-12 gap-10">
      <Flag />
    </main>
  );
}
