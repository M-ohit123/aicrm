"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import LeadCharts from "@/components/dashboard/LeadCharts";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useGetLeadsQuery } from "@/redux/services/leadApi";

export default function DashboardPage() {
  // =========================
  // MOBILE SIDEBAR STATE
  // =========================

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    data: leadsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLeadsQuery();

  const leads = Array.isArray(leadsData?.data)
    ? leadsData.data
    : [];

  // =========================
  // STATISTICS
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

  const lostLeads = leads.filter(
    (lead) => lead.status === "Lost"
  ).length;

  const highPriorityLeads = leads.filter(
    (lead) => lead.priority === "High"
  ).length;

  const mediumPriorityLeads = leads.filter(
    (lead) => lead.priority === "Medium"
  ).length;

  const lowPriorityLeads = leads.filter(
    (lead) => lead.priority === "Low"
  ).length;

  // =========================
  // CONVERSION RATE
  // =========================

  const conversionRate =
    totalLeads > 0
      ? ((convertedLeads / totalLeads) * 100).toFixed(1)
      : "0.0";

  // =========================
  // SOURCE COUNT
  // =========================

  const sourceCount = {};

  leads.forEach((lead) => {
    const source = lead.source || "Other";

    sourceCount[source] =
      (sourceCount[source] || 0) + 1;
  });

  // =========================
  // RECENT LEADS
  // =========================

  const recentLeads = [...leads]
    .sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, 5);

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";

      case "Contacted":
        return "bg-yellow-100 text-yellow-700";

      case "Qualified":
        return "bg-purple-100 text-purple-700";

      case "Converted":
        return "bg-green-100 text-green-700";

      case "Lost":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // PRIORITY STYLE
  // =========================

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";

      case "Medium":
        return "text-yellow-600";

      case "Low":
        return "text-green-600";

      default:
        return "text-gray-600";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">

        {/* =========================
            SIDEBAR
        ========================= */}

        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* =========================
            MAIN
        ========================= */}

        <div className="min-h-screen md:ml-64">

          {/* =========================
              NAVBAR
          ========================= */}

          <Navbar
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          {/* =========================
              MAIN CONTENT
          ========================= */}

          <main className="p-4 sm:p-6">

            {/* HEADER */}

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Overview of your CRM leads and performance.
              </p>
            </div>

            {/* LOADING */}

            {isLoading && (
              <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                  <p className="mt-4 text-sm text-gray-500">
                    Loading dashboard...
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}

            {isError && !isLoading && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h2 className="font-semibold text-red-700">
                  Failed to load dashboard
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
            )}

            {/* DASHBOARD */}

            {!isLoading && !isError && (
              <>

                {/* =========================
                    TOP STAT CARDS
                ========================= */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  {/* TOTAL */}

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Leads
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                          {totalLeads}
                        </h2>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-xl">
                        👥
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-400">
                      All leads in CRM
                    </p>
                  </div>

                  {/* NEW */}

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          New Leads
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-blue-600">
                          {newLeads}
                        </h2>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                        🆕
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-400">
                      Recently added leads
                    </p>
                  </div>

                  {/* QUALIFIED */}

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Qualified
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-purple-600">
                          {qualifiedLeads}
                        </h2>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl">
                        ⭐
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-400">
                      Qualified opportunities
                    </p>
                  </div>

                  {/* CONVERTED */}

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Converted
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-green-600">
                          {convertedLeads}
                        </h2>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
                        ✅
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-400">
                      Successfully converted
                    </p>
                  </div>
                </div>

                {/* =========================
                    SECOND ROW
                ========================= */}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Contacted
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                      {contactedLeads}
                    </h2>
                  </div>

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Lost Leads
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-red-600">
                      {lostLeads}
                    </h2>
                  </div>

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      High Priority
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-red-600">
                      {highPriorityLeads}
                    </h2>
                  </div>

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Conversion Rate
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-600">
                      {conversionRate}%
                    </h2>
                  </div>
                </div>

                {/* =========================
                    CHARTS
                ========================= */}

                <div className="mt-6">
                  <LeadCharts leads={leads} />
                </div>

                {/* =========================
                    STATUS + PRIORITY
                ========================= */}

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

                  {/* STATUS */}

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Lead Status
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Current distribution of leads.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          name: "New",
                          count: newLeads,
                          color: "bg-blue-500",
                        },
                        {
                          name: "Contacted",
                          count: contactedLeads,
                          color: "bg-yellow-500",
                        },
                        {
                          name: "Qualified",
                          count: qualifiedLeads,
                          color: "bg-purple-500",
                        },
                        {
                          name: "Converted",
                          count: convertedLeads,
                          color: "bg-green-500",
                        },
                        {
                          name: "Lost",
                          count: lostLeads,
                          color: "bg-red-500",
                        },
                      ].map((item) => {
                        const percentage =
                          totalLeads > 0
                            ? (item.count / totalLeads) * 100
                            : 0;

                        return (
                          <div key={item.name}>
                            <div className="mb-2 flex justify-between text-sm">
                              <span className="text-gray-600">
                                {item.name}
                              </span>

                              <span className="font-medium text-gray-900">
                                {item.count}
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PRIORITY */}

                  <div className="rounded-2xl border bg-white p-5 shadow-sm">
                    <div className="mb-5">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Lead Priority
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Priority distribution of your leads.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">

                      <div className="rounded-xl bg-red-50 p-5 text-center">
                        <div className="text-2xl">
                          🔥
                        </div>

                        <p className="mt-2 text-sm font-medium text-red-600">
                          High
                        </p>

                        <p className="mt-1 text-2xl font-bold text-red-700">
                          {highPriorityLeads}
                        </p>
                      </div>

                      <div className="rounded-xl bg-yellow-50 p-5 text-center">
                        <div className="text-2xl">
                          ⚡
                        </div>

                        <p className="mt-2 text-sm font-medium text-yellow-600">
                          Medium
                        </p>

                        <p className="mt-1 text-2xl font-bold text-yellow-700">
                          {mediumPriorityLeads}
                        </p>
                      </div>

                      <div className="rounded-xl bg-green-50 p-5 text-center">
                        <div className="text-2xl">
                          🌱
                        </div>

                        <p className="mt-2 text-sm font-medium text-green-600">
                          Low
                        </p>

                        <p className="mt-1 text-2xl font-bold text-green-700">
                          {lowPriorityLeads}
                        </p>
                      </div>
                    </div>

                    {/* CONVERSION */}

                    <div className="mt-6 rounded-xl bg-gray-50 p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Overall Conversion
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Converted leads compared to total leads
                          </p>
                        </div>

                        <span className="text-2xl font-bold text-green-600">
                          {conversionRate}%
                        </span>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${Math.min(
                              Number(conversionRate),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* =========================
                    LEAD SOURCES
                ========================= */}

                <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Lead Sources
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Where your leads are coming from.
                    </p>
                  </div>

                  {Object.keys(sourceCount).length === 0 ? (
                    <p className="text-sm text-gray-400">
                      No lead source data available.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                      {Object.entries(sourceCount).map(
                        ([source, count]) => (
                          <div
                            key={source}
                            className="rounded-xl border bg-gray-50 p-4"
                          >
                            <p className="truncate text-sm font-medium text-gray-600">
                              {source}
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                              {count}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              leads
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* =========================
                    RECENT LEADS
                ========================= */}

                <div className="mt-6 rounded-2xl border bg-white shadow-sm">
                  <div className="border-b p-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Leads
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Latest leads added to your CRM.
                    </p>
                  </div>

                  {recentLeads.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl">
                        👥
                      </div>

                      <p className="mt-3 text-sm text-gray-500">
                        No leads available.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Lead
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Company
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Status
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Priority
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Source
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y">
                          {recentLeads.map((lead) => (
                            <tr
                              key={lead._id}
                              className="transition hover:bg-gray-50"
                            >
                              <td className="px-5 py-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {lead.name || "Unnamed Lead"}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-400">
                                    {lead.email || "No email"}
                                  </p>
                                </div>
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-600">
                                {lead.company || "—"}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                    lead.status
                                  )}`}
                                >
                                  {lead.status || "Unknown"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`text-sm font-semibold ${getPriorityStyle(
                                    lead.priority
                                  )}`}
                                >
                                  {lead.priority || "—"}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-600">
                                {lead.source || "Other"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}