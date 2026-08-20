
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
    },
    {
      name: "Leads",
      href: "/leads",
      icon: "👥",
    },
    {
      name: "Import Leads",
      href: "/leads/import",
      icon: "📥",
    },
    {
      name: "AI Assistant",
      href: "/ai",
      icon: "✨",
    },
  ];

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("crmToken");
    localStorage.removeItem("crmUser");

    // Close mobile sidebar
    setIsOpen(false);

    // Go to login
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-white transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >

        {/* Logo */}

        <div className="flex items-center justify-between border-b px-5 py-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI CRM
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Lead Management
            </p>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            ✕
          </button>

        </div>

        {/* Menu */}

        <nav className="flex-1 p-4">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Menu
          </p>

          <div className="space-y-2">

            {menuItems.map((item) => {

              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >

                  <span className="text-lg">
                    {item.icon}
                  </span>

                  {item.name}

                </Link>
              );
            })}

          </div>

        </nav>

        {/* Bottom */}

        <div className="border-t p-4">

          {/* Settings */}

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push("/settings");
            }}
            className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            ⚙️ Settings
          </button>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50"
          >
            🚪 Logout
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;
