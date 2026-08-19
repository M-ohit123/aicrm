
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import LeadTable from "@/components/LeadTable";

import { useGetLeadsQuery } from "@/redux/services/leadApi";

const LeadsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // FILTER STATES
  // =========================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // =========================
  // GET LEADS
  // =========================

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetLeadsQuery();

  const leads = data?.data || [];

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredLeads = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !searchText ||
        lead.name
          ?.toLowerCase()
          .includes(searchText) ||
        lead.email
          ?.toLowerCase()
          .includes(searchText) ||
        lead.company
          ?.toLowerCase()
          .includes(searchText) ||
        lead.phone
          ?.toString()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        lead.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        lead.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    leads,
    search,
    statusFilter,
    priorityFilter,
  ]);

  // =========================
  // STATS
  // =========================

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  // =========================
  // CLEAR FILTERS
  // =========================

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    priorityFilter !== "All";

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <div className="min-h-screen md:ml-64">
          <Navbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="p-4 sm:p-6">
            <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

              <p className="mt-4 text-sm text-gray-500">
                Loading leads...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <div className="min-h-screen md:ml-64">
          <Navbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="p-4 sm:p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-semibold text-red-700">
                Failed to load leads
              </h2>

              <p className="mt-2 text-sm text-red-600">
                {error?.data?.message ||
                  error?.error ||
                  "Unable to fetch leads from server."}
              </p>

              <button
                type="button"
                onClick={refetch}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* =========================
          MAIN AREA
      ========================= */}

      <div className="min-h-screen md:ml-64">

        {/* =========================
            NAVBAR
        ========================= */}

        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="p-4 sm:p-6">

          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Leads
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage and organize your customer leads.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <Link
                href="/leads/import"
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Import CSV
              </Link>

              <Link
                href="/leads/new"
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800"
              >
                + Add Lead
              </Link>

            </div>
          </div>

          {/* =========================
              STATISTICS
          ========================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total Leads
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalLeads}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                All leads
              </p>
            </div>

            {/* NEW */}

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                New Leads
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {newLeads}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                New opportunities
              </p>
            </div>

            {/* QUALIFIED */}

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Qualified
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {qualifiedLeads}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Qualified opportunities
              </p>
            </div>

            {/* CONVERTED */}

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Converted
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {convertedLeads}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Successfully converted
              </p>
            </div>

          </div>

          {/* =========================
              SEARCH + FILTERS
          ========================= */}

          <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-3 lg:flex-row">

              {/* SEARCH */}

              <div className="relative flex-1">

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by name, email, company or phone..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                />

              </div>

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
              >
                <option value="All">
                  All Status
                </option>

                <option value="New">
                  New
                </option>

                <option value="Contacted">
                  Contacted
                </option>

                <option value="Qualified">
                  Qualified
                </option>

                <option value="Converted">
                  Converted
                </option>

                <option value="Lost">
                  Lost
                </option>
              </select>

              {/* PRIORITY */}

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
              >
                <option value="All">
                  All Priority
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

              {/* CLEAR */}

              {hasFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Clear
                </button>
              )}

              {/* REFRESH */}

              <button
                type="button"
                onClick={refetch}
                disabled={isFetching}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetching
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

            </div>

          </div>

          {/* =========================
              RESULT COUNT
          ========================= */}

          <div className="mb-3 flex items-center justify-between">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredLeads.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {totalLeads}
              </span>{" "}
              leads
            </p>

            {hasFilters && (
              <p className="text-xs text-gray-400">
                Filters applied
              </p>
            )}

          </div>

          {/* =========================
              NO SEARCH RESULT
          ========================= */}

          {filteredLeads.length === 0 ? (

            <div className="rounded-xl border bg-white p-12 text-center shadow-sm">

              <div className="text-4xl">
                🔍
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                No leads found
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Clear Filters
                </button>
              )}

            </div>

          ) : (

            /* =========================
               LEAD TABLE
            ========================= */

            <LeadTable
              leads={filteredLeads}
            />

          )}

        </main>
      </div>
    </div>
  );
};

export default LeadsPage;
