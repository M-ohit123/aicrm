"use client";

import Link from "next/link";
import { useState } from "react";

import { useDeleteLeadMutation } from "@/redux/services/leadApi";

const LeadTable = ({ leads = [] }) => {
  const [deleteLead, { isLoading: isDeleting }] =
    useDeleteLeadMutation();

  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // STATUS STYLE
  // =====================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-600";

      case "Contacted":
        return "bg-yellow-50 text-yellow-600";

      case "Qualified":
        return "bg-purple-50 text-purple-600";

      case "Converted":
        return "bg-green-50 text-green-600";

      case "Lost":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =====================================
  // PRIORITY STYLE
  // =====================================

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

  // =====================================
  // DELETE LEAD
  // =====================================

  const handleDelete = async (id) => {
    if (!id) {
      alert("Lead ID is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteLead(id).unwrap();

      alert("Lead deleted successfully!");
    } catch (error) {
      console.error("DELETE LEAD ERROR:", error);

      alert(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to delete lead"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // EMPTY STATE
  // =====================================

  if (!leads.length) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="px-6 py-14 text-center">
          <div className="text-4xl">📋</div>

          <h3 className="mt-3 text-sm font-semibold text-gray-900">
            No leads found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            There are no leads matching your search or filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      {/* =====================================
          TABLE WRAPPER
      ===================================== */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[950px] text-left">

          {/* =====================================
              TABLE HEADER
          ===================================== */}

          <thead className="bg-gray-50">

            <tr>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Lead
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Company
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Priority
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>

            </tr>

          </thead>

          {/* =====================================
              TABLE BODY
          ===================================== */}

          <tbody className="divide-y divide-gray-100">

            {leads.map((lead) => {

              const leadId = lead?._id;

              return (
                <tr
                  key={leadId}
                  className="transition hover:bg-gray-50"
                >

                  {/* =================================
                      LEAD
                  ================================= */}

                  <td className="px-5 py-4">

                    <div className="min-w-0">

                      <p className="truncate font-medium text-gray-900">
                        {lead?.name || "Unnamed Lead"}
                      </p>

                      <p className="mt-1 max-w-[220px] truncate text-xs text-gray-500">
                        {lead?.email || "No email"}
                      </p>

                    </div>

                  </td>

                  {/* =================================
                      COMPANY
                  ================================= */}

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {lead?.company || "N/A"}
                  </td>

                  {/* =================================
                      PHONE
                  ================================= */}

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {lead?.phone || "N/A"}
                  </td>

                  {/* =================================
                      STATUS
                  ================================= */}

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        lead?.status
                      )}`}
                    >
                      {lead?.status || "N/A"}
                    </span>

                  </td>

                  {/* =================================
                      PRIORITY
                  ================================= */}

                  <td className="px-5 py-4">

                    <span
                      className={`text-sm font-semibold ${getPriorityStyle(
                        lead?.priority
                      )}`}
                    >
                      {lead?.priority || "N/A"}
                    </span>

                  </td>

                  {/* =================================
                      ACTIONS
                  ================================= */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      {/* VIEW */}

                      {leadId ? (
                        <Link
                          href={`/leads/${leadId}`}
                          prefetch={false}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          View
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="cursor-not-allowed rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400"
                        >
                          View
                        </button>
                      )}

                      {/* EDIT */}

                      {leadId ? (
                        <Link
                          href={`/leads/${leadId}/edit`}
                          prefetch={false}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="cursor-not-allowed rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-300"
                        >
                          Edit
                        </button>
                      )}

                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={
                          isDeleting ||
                          deletingId === leadId
                        }
                        onClick={() =>
                          handleDelete(leadId)
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === leadId
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* =====================================
          MOBILE MESSAGE
      ===================================== */}

      <div className="border-t px-4 py-3 text-center text-xs text-gray-400 sm:hidden">
        ← Swipe horizontally to see all columns →
      </div>

    </div>
  );
};

export default LeadTable;