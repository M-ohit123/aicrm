"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ActivityTimeline from "@/components/ActivityTimeline";
import AddActivityForm from "@/components/AddActivityForm";

import {
  useGetLeadByIdQuery,
} from "@/redux/services/leadApi";

import {
  useGenerateLeadInsightsMutation,
} from "@/redux/services/aiApi";

export default function LeadDetailsPage() {
  const params = useParams();

  const id = params?.id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [insights, setInsights] = useState(null);

  // =====================================
  // GET SINGLE LEAD
  // =====================================

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetLeadByIdQuery(id, {
    skip: !id,
  });

  // =====================================
  // AI
  // =====================================

  const [
    generateLeadInsights,
    {
      isLoading: isGenerating,
    },
  ] = useGenerateLeadInsightsMutation();

  const lead = data?.data;

  // =====================================
  // GENERATE AI INSIGHTS
  // =====================================

  const handleGenerateAI = async () => {
    if (!lead) return;

    try {
      const response =
        await generateLeadInsights(lead).unwrap();

      const generatedInsights =
        response?.data?.insights ||
        response?.insights ||
        null;

      setInsights(generatedInsights);
    } catch (error) {
      console.error("AI ERROR:", error);

      alert(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to generate AI insights"
      );
    }
  };

  // =====================================
  // NO ID
  // =====================================

  if (!id) {
    return (
      <PageLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Invalid Lead ID
          </h2>

          <p className="mt-2 text-sm text-red-600">
            Lead ID was not found in the URL.
          </p>

          <Link
            href="/leads"
            className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Leads
          </Link>
        </div>
      </PageLayout>
    );
  }

  // =====================================
  // INITIAL LOADING
  // =====================================

  if (isLoading) {
    return (
      <PageLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

          <p className="mt-4 text-sm text-gray-500">
            Loading lead details...
          </p>
        </div>
      </PageLayout>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (isError) {
    return (
      <PageLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Failed to load lead
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error?.data?.message ||
              "Unable to load lead details."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refetch}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>

            <Link
              href="/leads"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Back to Leads
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // =====================================
  // LEAD NOT FOUND
  // =====================================

  if (!lead) {
    return (
      <PageLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Lead not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The lead you are looking for does not exist.
          </p>

          <Link
            href="/leads"
            className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Leads
          </Link>
        </div>
      </PageLayout>
    );
  }

  // =====================================
  // MAIN PAGE
  // =====================================

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <main className="p-4 sm:p-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              href="/leads"
              prefetch={false}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              ← Back to Leads
            </Link>

            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {lead.name || "Unnamed Lead"}
              </h1>

              {isFetching && (
                <span className="text-xs text-gray-400">
                  Updating...
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Lead Details
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            {/* EDIT */}

            <Link
              href={`/leads/${lead._id}/edit`}
              prefetch={false}
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
            >
              Edit Lead
            </Link>

            {/* AI */}

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating
                ? "✨ Generating..."
                : "✨ Generate AI Insights"}
            </button>

          </div>
        </div>

        {/* =====================================
            LEAD INFORMATION
        ===================================== */}

        <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Lead Information
            </h2>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
              ID: {String(lead._id).slice(-6)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* NAME */}

            <InfoItem
              label="Name"
              value={lead.name}
            />

            {/* EMAIL */}

            <InfoItem
              label="Email"
              value={lead.email}
              breakAll
            />

            {/* PHONE */}

            <InfoItem
              label="Phone"
              value={lead.phone}
            />

            {/* COMPANY */}

            <InfoItem
              label="Company"
              value={lead.company}
            />

            {/* SOURCE */}

            <InfoItem
              label="Source"
              value={lead.source}
            />

            {/* STATUS */}

            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                Status
              </p>

              <span className="mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {lead.status || "N/A"}
              </span>
            </div>

            {/* PRIORITY */}

            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                Priority
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {lead.priority || "N/A"}
              </p>
            </div>

            {/* NOTES */}

            <div className="sm:col-span-2">

              <p className="text-xs font-medium uppercase text-gray-400">
                Notes
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {lead.notes || "No notes available"}
              </p>

            </div>

          </div>
        </div>

        {/* =====================================
            AI INSIGHTS
        ===================================== */}

        {insights && (
          <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-2">
              <span className="text-xl">
                ✨
              </span>

              <h2 className="text-lg font-semibold text-gray-900">
                AI Lead Insights
              </h2>
            </div>

            {/* SCORE */}

            <div className="mb-5 rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-medium uppercase text-gray-400">
                Lead Score
              </p>

              <div className="mt-2 flex items-center gap-3">

                <span className="text-3xl font-bold text-gray-900">
                  {insights.leadScore ?? 0}
                </span>

                <span className="text-sm text-gray-500">
                  / 100
                </span>

              </div>
            </div>

            {/* POTENTIAL */}

            <div className="mb-5">

              <p className="text-xs font-medium uppercase text-gray-400">
                Lead Potential
              </p>

              <span className="mt-2 inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                {insights.leadPotential || "N/A"}
              </span>

            </div>

            {/* ACTION */}

            <div className="mb-5">

              <p className="text-xs font-medium uppercase text-gray-400">
                Recommended Action
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-700">
                {insights.recommendedAction ||
                  "No recommendation available."}
              </p>

            </div>

            {/* REASON */}

            <div className="mb-5">

              <p className="text-xs font-medium uppercase text-gray-400">
                Reason
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {insights.reason ||
                  "No reason available."}
              </p>

            </div>

            {/* FOLLOW UP */}

            <div>

              <p className="text-xs font-medium uppercase text-gray-400">
                Follow-up Message
              </p>

              <div className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                {insights.followUpMessage ||
                  "No follow-up message available."}
              </div>

            </div>

          </div>
        )}

        {/* =====================================
            ADD ACTIVITY
        ===================================== */}

        <AddActivityForm
          leadId={lead._id}
        />

        {/* =====================================
            ACTIVITY TIMELINE
        ===================================== */}

        <ActivityTimeline
          leadId={lead._id}
        />

      </main>
    </PageLayout>
  );
}


// =====================================
// PAGE LAYOUT
// =====================================

function PageLayout({
  children,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <div className="min-h-screen bg-gray-50">

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="min-h-screen md:ml-64">

        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {children}

      </div>
    </div>
  );
}


// =====================================
// INFO ITEM
// =====================================

function InfoItem({
  label,
  value,
  breakAll = false,
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm text-gray-700 ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
}