"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = ({ onMenuClick }) => {
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // =========================
  // MY PROFILE
  // =========================
  const handleProfile = () => {
    setShowProfile(false);
    setShowNotifications(false);

    router.push("/profile");
  };

  // =========================
  // SETTINGS
  // =========================
  const handleSettings = () => {
    setShowProfile(false);
    setShowNotifications(false);

    router.push("/settings");
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    setShowProfile(false);
    setShowNotifications(false);

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("crmUser");
    } catch (error) {
      console.error("Logout error:", error);
    }

    router.push("/login");
  };

  // =========================
  // NOTIFICATION
  // =========================
  const handleNotification = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  // =========================
  // MOBILE SEARCH
  // =========================
  const handleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setShowNotifications(false);
    setShowProfile(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-white">

      {/* ==============================
          MAIN NAVBAR
      =============================== */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        {/* ==============================
            LEFT
        =============================== */}
        <div className="flex items-center gap-3">

          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-600 hover:bg-gray-100 md:hidden"
          >
            ☰
          </button>

          {/* DESKTOP SEARCH */}
          <div className="hidden sm:block">
            <input
              type="text"
              placeholder="Search leads..."
              className="w-56 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none transition focus:border-gray-400 focus:bg-white lg:w-80"
            />
          </div>

        </div>

        {/* ==============================
            RIGHT
        =============================== */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* ============================
              MOBILE SEARCH
          ============================= */}
          <button
            type="button"
            onClick={handleMobileSearch}
            aria-label="Search"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:hidden"
          >
            🔍
          </button>

          {/* ============================
              NOTIFICATION
          ============================= */}
          <div className="relative">

            <button
              type="button"
              onClick={handleNotification}
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              🔔

              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b px-4 py-3">

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>

                    <p className="text-xs text-gray-500">
                      Your latest CRM notifications
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>

                </div>

                {/* NOTIFICATION */}
                <div className="p-4">

                  <div className="flex gap-3 rounded-lg bg-gray-50 p-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-white">
                      🔔
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Welcome to AI CRM
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Your CRM dashboard is ready to use.
                      </p>
                    </div>

                  </div>

                </div>

                {/* FOOTER */}
                <div className="border-t px-4 py-3">

                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Close
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* ============================
              USER
          ============================= */}
          <div className="relative">

            {/* USER BUTTON */}
            <button
              type="button"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              aria-label="User menu"
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 sm:gap-3"
            >

              {/* AVATAR */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                M
              </div>

              {/* USER INFO */}
              <div className="hidden text-left sm:block">

                <p className="text-sm font-semibold text-gray-900">
                  Admin
                </p>

                <p className="text-xs text-gray-500">
                  Administrator
                </p>

              </div>

              {/* ARROW */}
              <span className="hidden text-xs text-gray-400 sm:block">
                ▼
              </span>

            </button>

            {/* ============================
                PROFILE DROPDOWN
            ============================= */}
            {showProfile && (
              <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                {/* HEADER */}
                <div className="border-b bg-gray-50 px-4 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                      M
                    </div>

                    <div>

                      <p className="font-semibold text-gray-900">
                        Admin
                      </p>

                      <p className="text-xs text-gray-500">
                        Administrator
                      </p>

                    </div>

                  </div>

                </div>

                {/* =========================
                    MY PROFILE
                ========================== */}
                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <span className="text-lg">
                    👤
                  </span>

                  <div>
                    <p className="font-medium">
                      My Profile
                    </p>

                    <p className="text-xs text-gray-400">
                      View your profile
                    </p>
                  </div>
                </button>

                {/* =========================
                    SETTINGS
                ========================== */}
                <button
                  type="button"
                  onClick={handleSettings}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <span className="text-lg">
                    ⚙️
                  </span>

                  <div>
                    <p className="font-medium">
                      Settings
                    </p>

                    <p className="text-xs text-gray-400">
                      Manage CRM preferences
                    </p>
                  </div>
                </button>

                {/* =========================
                    LOGOUT
                ========================== */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 border-t px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <span className="text-lg">
                    🚪
                  </span>

                  <div>
                    <p className="font-medium">
                      Logout
                    </p>

                    <p className="text-xs text-red-400">
                      Sign out of your account
                    </p>
                  </div>
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ==============================
          MOBILE SEARCH
      =============================== */}
      {showMobileSearch && (
        <div className="border-t bg-white px-4 py-3 sm:hidden">

          <input
            autoFocus
            type="text"
            placeholder="Search leads..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
          />

        </div>
      )}

    </header>
  );
};

export default Navbar;