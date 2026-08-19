
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    lead: true,
    ai: false,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("crmUser");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        setProfile({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
        });
      }

      const storedNotifications =
        localStorage.getItem("crmNotifications");

      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);

        setNotifications({
          email: parsed.email ?? true,
          lead: parsed.lead ?? true,
          ai: parsed.ai ?? false,
        });
      }
    } catch (error) {
      console.error("Settings load error:", error);
    }
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleNotificationChange = (type) => {
    setNotifications((previous) => ({
      ...previous,
      [type]: !previous[type],
    }));
  };

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleSaveProfile = () => {
    try {
      const oldUser = JSON.parse(
        localStorage.getItem("crmUser") || "{}"
      );

      const updatedUser = {
        ...oldUser,
        name: profile.name,
        email: profile.email,
      };

      localStorage.setItem(
        "crmUser",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      showMessage("Profile saved successfully.");
    } catch (error) {
      console.error("Profile save error:", error);

      showMessage("Profile save failed.");
    }
  };

  const handleSaveNotifications = () => {
    try {
      localStorage.setItem(
        "crmNotifications",
        JSON.stringify(notifications)
      );

      showMessage(
        "Notification settings saved successfully."
      );
    } catch (error) {
      console.error(
        "Notification save error:",
        error
      );

      showMessage("Notification save failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="min-h-screen md:ml-64">
        <Navbar />

        <main className="p-4 sm:p-6">

          {/* HEADER */}

          <div className="mb-7">
            <h1 className="text-3xl font-bold text-gray-900">
              Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your CRM account and preferences.
            </p>
          </div>

          {/* MESSAGE */}

          {message && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="font-medium text-green-700">
                ✓ {message}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* PROFILE */}

            <div className="xl:col-span-2">
              <div className="rounded-2xl border bg-white shadow-sm">

                <div className="border-b p-5">
                  <h2 className="text-lg font-semibold">
                    Profile Settings
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Update your account information.
                  </p>
                </div>

                <div className="p-5">

                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                      {profile.name
                        ? profile.name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {profile.name || "Admin"}
                      </p>

                      <p className="text-sm text-gray-500">
                        CRM Administrator
                      </p>
                    </div>
                  </div>

                  {/* NAME */}

                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
                    />
                  </div>

                  {/* EMAIL */}

                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
                    />
                  </div>

                  {/* ROLE */}

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium">
                      Role
                    </label>

                    <input
                      type="text"
                      value={user?.role || "Administrator"}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Save Profile
                  </button>

                </div>
              </div>
            </div>

            {/* ACCOUNT */}

            <div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <h2 className="text-lg font-semibold">
                  Account
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your CRM account information.
                </p>

                <div className="mt-6 space-y-4">

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Account Status
                    </p>

                    <p className="mt-1 font-semibold text-green-600">
                      Active
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      Account Type
                    </p>

                    <p className="mt-1 font-semibold">
                      Administrator
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">
                      CRM Version
                    </p>

                    <p className="mt-1 font-semibold">
                      AI CRM
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* NOTIFICATIONS */}

            <div className="xl:col-span-2">
              <div className="rounded-2xl border bg-white shadow-sm">

                <div className="border-b p-5">
                  <h2 className="text-lg font-semibold">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Control which notifications you receive.
                  </p>
                </div>

                <div className="divide-y">

                  {/* EMAIL */}

                  <div className="flex items-center justify-between p-5">

                    <div>
                      <p className="font-medium">
                        Email Notifications
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Receive important CRM updates by email.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationChange("email")
                      }
                      className={
                        notifications.email
                          ? "h-6 w-11 rounded-full bg-gray-900 p-1"
                          : "h-6 w-11 rounded-full bg-gray-300 p-1"
                      }
                    >
                      <span
                        className={
                          notifications.email
                            ? "block h-4 w-4 translate-x-5 rounded-full bg-white"
                            : "block h-4 w-4 translate-x-0 rounded-full bg-white"
                        }
                      />
                    </button>

                  </div>

                  {/* LEAD */}

                  <div className="flex items-center justify-between p-5">

                    <div>
                      <p className="font-medium">
                        New Lead Alerts
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Get notified when a new lead is added.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationChange("lead")
                      }
                      className={
                        notifications.lead
                          ? "h-6 w-11 rounded-full bg-gray-900 p-1"
                          : "h-6 w-11 rounded-full bg-gray-300 p-1"
                      }
                    >
                      <span
                        className={
                          notifications.lead
                            ? "block h-4 w-4 translate-x-5 rounded-full bg-white"
                            : "block h-4 w-4 translate-x-0 rounded-full bg-white"
                        }
                      />
                    </button>

                  </div>

                  {/* AI */}

                  <div className="flex items-center justify-between p-5">

                    <div>
                      <p className="font-medium">
                        AI Insights
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Receive AI-generated lead recommendations.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationChange("ai")
                      }
                      className={
                        notifications.ai
                          ? "h-6 w-11 rounded-full bg-gray-900 p-1"
                          : "h-6 w-11 rounded-full bg-gray-300 p-1"
                      }
                    >
                      <span
                        className={
                          notifications.ai
                            ? "block h-4 w-4 translate-x-5 rounded-full bg-white"
                            : "block h-4 w-4 translate-x-0 rounded-full bg-white"
                        }
                      />
                    </button>

                  </div>

                </div>

                {/* SAVE */}

                <div className="border-t p-5">

                  <button
                    type="button"
                    onClick={handleSaveNotifications}
                    className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Save Notifications
                  </button>

                </div>

              </div>
            </div>

            {/* SECURITY */}

            <div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <h2 className="text-lg font-semibold">
                  Security
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Account security information.
                </p>

                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">

                  <p className="font-medium text-green-700">
                    🔒 Authentication Active
                  </p>

                  <p className="mt-1 text-xs text-green-600">
                    Your CRM account is protected with authentication.
                  </p>

                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
