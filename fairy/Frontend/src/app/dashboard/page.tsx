"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:3000/protected/dashboard", {
          credentials: "include", // Important to send cookies
        });

        if (res.status === 401) {
          console.log(res)
          // Not authenticated, redirect to login page
          router.push("/auth");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await res.json();
        const userEmail = data.user?.email;
        const userDisplayName = data.user?.user_metadata?.display_name || userEmail;
        setDisplayName(userDisplayName);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        credentials: "include",
      });

      if (res.ok) {
        router.push("/auth");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">Dashboard</h1>
        {displayName ? (
          <div className="text-center text-xl text-gray-700">
            <p>Welcome, <span className="font-semibold">{displayName}</span>!</p>
            <p className="mt-4 text-gray-500">This is your dashboard.</p>
            <button
              onClick={handleSignOut}
              className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center text-xl text-gray-700">
            <p>User not found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
