"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "",
    role: "Administrator",
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("crmUser");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        setProfile({
          name: user.name || "Admin",
          email: user.email || "",
          role: user.role || "Administrator",
        });
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="min-h-screen md:ml-64">

        {/* NAVBAR */}
        <Navbar />

        <main className="p-4 sm:p-6">

          {/* HEADER */}
          <div className="mb-7">

            <h1 className="text-3xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View your AI CRM account information.
            </p>

          </div>

          {/* PROFILE CARD */}
          <div className="max-w-3xl">

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              {/* PROFILE HEADER */}
              <div className="border-b bg-gray-50 p-6">

                <div className="flex flex-col items-center gap-4 sm:flex-row">

                  {/* AVATAR */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">

                    {profile.name
                      ? profile.name.charAt(0).toUpperCase()
                      : "A"}

                  </div>

                  {/* USER */}
                  <div className="text-center sm:text-left">

                    <h2 className="text-xl font-bold text-gray-900">
                      {profile.name || "Admin"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {profile.role}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {profile.email || "No email available"}
                    </p>

                  </div>

                </div>

              </div>

              {/* PROFILE INFORMATION */}
              <div className="p-6">

                <h3 className="mb-5 text-lg font-semibold text-gray-900">
                  Profile Information
                </h3>

                <div className="space-y-5">

                  {/* NAME */}
                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      {profile.name || "Admin"}
                    </div>

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email
                    </label>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      {profile.email || "No email available"}
                    </div>

                  </div>

                  {/* ROLE */}
                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Role
                    </label>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      {profile.role}
                    </div>

                  </div>

                  {/* ACCOUNT STATUS */}
                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Account Status
                    </label>

                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">

                      <span className="h-2 w-2 rounded-full bg-green-500" />

                      Active

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}