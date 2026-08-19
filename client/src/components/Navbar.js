"use client";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">

      {/* LEFT */}
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

        {/* SEARCH */}
        <div className="hidden sm:block">
          <input
            type="text"
            placeholder="Search leads..."
            className="w-56 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none transition focus:border-gray-400 focus:bg-white lg:w-80"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* MOBILE SEARCH */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:hidden"
        >
          🔍
        </button>

        {/* NOTIFICATION */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          🔔

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* USER */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            M
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;