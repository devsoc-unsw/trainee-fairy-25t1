"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Optional: if you're using shadcn/ui or similar

export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth");
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button onClick={handleRedirect}>
        Go to Auth
      </Button>
    </main>
  );
}