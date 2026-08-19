"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import {
  useGetLeadsQuery,
  useSaveAIInsightsMutation,
} from "@/redux/services/leadApi";

import {
  useGenerateLeadInsightsMutation,
} from "@/redux/services/aiApi";

export default function AIPage() {
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    status: "New",
    priority: "Medium",
    notes: "",
  });

  const [insights, setInsights] = useState(null);

  // =========================
  // GET LEADS
  // =========================

  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    isError: isLeadsError,
  } = useGetLeadsQuery();

  const leads = Array.isArray(leadsData?.data)
    ? leadsData.data
    : [];

  // =========================
  // AI MUTATION
  // =========================

  const [
    generateLeadInsights,
    {
      isLoading: isGenerating,
    },
  ] = useGenerateLeadInsightsMutation();

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE LEAD SELECT
  // =========================

  const handleLeadSelect = (e) => {
    const id = e.target.value;

    setSelectedLeadId(id);

    // Clear previous AI result
    setInsights(null);

    // If no lead selected
    if (!id) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "Website",
        status: "New",
        priority: "Medium",
        notes: "",
      });

      return;
    }

    const selectedLead = leads.find(
      (lead) => String(lead._id) === String(id)
    );

    if (!selectedLead) {
      return;
    }

    setFormData({
      name: selectedLead.name || "",
      email: selectedLead.email || "",
      phone: selectedLead.phone || "",
      company: selectedLead.company || "",
      source: selectedLead.source || "Website",
      status: selectedLead.status || "New",
      priority: selectedLead.priority || "Medium",
      notes: selectedLead.notes || "",
    });
  };

  // =========================
  // GENERATE AI INSIGHTS
  // =========================

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please select a lead first.");
      return;
    }

    setInsights(null);

    try {
      console.log(
        "SENDING LEAD TO AI:",
        formData
      );

      const response =
        await generateLeadInsights(
          formData
        ).unwrap();

      console.log(
        "COMPLETE AI RESPONSE:",
        response
      );

      // =========================
      // IMPORTANT RESPONSE FIX
      // =========================

      const aiInsights =
        response?.data?.insights;

      console.log(
        "AI INSIGHTS:",
        aiInsights
      );

      // Make sure AI response is an object
      if (
        !aiInsights ||
        typeof aiInsights !== "object" ||
        Array.isArray(aiInsights)
      ) {
        console.error(
          "Invalid AI insights:",
          aiInsights
        );

        alert(
          "AI returned an invalid response."
        );

        return;
      }

      // Store ONLY the insights object
      setInsights({
        leadScore:
          Number(aiInsights.leadScore) || 0,

        leadPotential:
          ["High", "Medium", "Low"].includes(
            aiInsights.leadPotential
          )
            ? aiInsights.leadPotential
            : "Low",

        recommendedAction:
          typeof aiInsights.recommendedAction ===
          "string"
            ? aiInsights.recommendedAction
            : "Follow up with the lead.",

        reason:
          typeof aiInsights.reason === "string"
            ? aiInsights.reason
            : "More information is required to qualify this lead.",

        followUpMessage:
          typeof aiInsights.followUpMessage ===
          "string"
            ? aiInsights.followUpMessage
            : `Hi ${formData.name}, thank you for your interest. Please let us know how we can assist you.`,
      });
    } catch (error) {
      console.error(
        "AI ERROR:",
        error
      );

      alert(
        error?.data?.message ||
        error?.message ||
        "Failed to generate AI insights"
      );
    }
  };

  // =========================
  // POTENTIAL STYLE
  // =========================

  const getPotentialStyle = (
    potential
  ) => {
    if (potential === "High") {
      return "bg-green-100 text-green-700";
    }

    if (potential === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  // =========================
  // SCORE STYLE
  // =========================

  const getScoreStyle = (score) => {
    const numericScore =
      Number(score) || 0;

    if (numericScore >= 70) {
      return "text-green-600";
    }

    if (numericScore >= 40) {
      return "text-yellow-600";
    }

    return "text-red-600";
  };

  // =========================
  // SCORE
  // =========================

  const score =
    Math.min(
      Math.max(
        Number(insights?.leadScore) || 0,
        0
      ),
      100
    );

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar />

      <div className="min-h-screen md:ml-64">

        {/* NAVBAR */}
        <Navbar />

        <main className="p-4 sm:p-6">

          {/* =========================
              HEADER
          ========================== */}

          <div className="mb-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-xl">
                ✨
              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  AI Assistant
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Analyze your existing leads with AI.
                </p>

              </div>

            </div>

          </div>

          {/* =========================
              MAIN GRID
          ========================== */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* ==================================================
                LEFT SIDE
            ================================================== */}

            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6">

                <h2 className="text-lg font-semibold text-gray-900">
                  Select Lead
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select an existing lead to analyze.
                </p>

              </div>

              {/* =========================
                  LEAD DROPDOWN
              ========================== */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Existing Lead
                </label>

                <select
                  value={selectedLeadId}
                  onChange={handleLeadSelect}
                  disabled={isLoadingLeads}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:bg-white"
                >

                  <option value="">
                    {isLoadingLeads
                      ? "Loading leads..."
                      : "Select a lead"}
                  </option>

                  {leads.map((lead) => (
                    <option
                      key={lead._id}
                      value={lead._id}
                    >
                      {lead.name} —{" "}
                      {lead.company ||
                        "No Company"}
                    </option>
                  ))}

                </select>

                {isLeadsError && (
                  <p className="mt-2 text-xs text-red-500">
                    Failed to load existing leads.
                  </p>
                )}

              </div>

              {/* =========================
                  FORM
              ========================== */}

              <form
                onSubmit={handleGenerate}
                className="space-y-5"
              >

                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                    required
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                  />

                </div>

                {/* COMPANY */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                  />

                </div>

                {/* SOURCE + STATUS */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Source
                    </label>

                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none"
                    >

                      <option value="Website">
                        Website
                      </option>

                      <option value="Referral">
                        Referral
                      </option>

                      <option value="Social Media">
                        Social Media
                      </option>

                      <option value="Advertisement">
                        Advertisement
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none"
                    >

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

                  </div>

                </div>

                {/* PRIORITY */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none"
                  >

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

                </div>

                {/* NOTES */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                  />

                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={
                    isGenerating ||
                    !formData.name
                  }
                  className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {isGenerating
                    ? "✨ Analyzing Lead..."
                    : "✨ Analyze This Lead"}

                </button>

              </form>

            </div>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">

              {/* RESULT HEADER */}

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-lg">
                  ✨
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    AI Insights
                  </h2>

                  <p className="text-sm text-gray-500">
                    AI-powered lead analysis
                  </p>

                </div>

              </div>

              {/* =========================
                  EMPTY STATE
              ========================== */}

              {!insights &&
                !isGenerating && (

                  <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">

                    <div>

                      <div className="text-4xl">
                        ✨
                      </div>

                      <h3 className="mt-4 font-semibold text-gray-800">
                        Select a lead
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                        Select an existing lead and click
                        Analyze This Lead to get AI recommendations.
                      </p>

                    </div>

                  </div>

                )}

              {/* =========================
                  LOADING
              ========================== */}

              {isGenerating && (

                <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-gray-50">

                  <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                    <p className="mt-4 text-sm font-medium text-gray-600">
                      AI is analyzing the lead...
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Please wait a moment
                    </p>

                  </div>

                </div>

              )}

              {/* =========================
                  AI RESULT
              ========================== */}

              {insights &&
                !isGenerating && (

                  <div className="space-y-4">

                    {/* SCORE + POTENTIAL */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      {/* SCORE */}

                      <div className="rounded-xl border bg-white p-5 shadow-sm">

                        <p className="text-sm font-medium text-gray-500">
                          Lead Score
                        </p>

                        <div className="mt-3 flex items-end gap-2">

                          <span
                            className={`text-4xl font-bold ${getScoreStyle(
                              score
                            )}`}
                          >
                            {score}
                          </span>

                          <span className="mb-1 text-sm text-gray-400">
                            / 100
                          </span>

                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">

                          <div
                            className="h-full rounded-full bg-gray-900 transition-all duration-500"
                            style={{
                              width: `${score}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* POTENTIAL */}

                      <div className="rounded-xl border bg-white p-5 shadow-sm">

                        <p className="text-sm font-medium text-gray-500">
                          Lead Potential
                        </p>

                        <div className="mt-4">

                          <span
                            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getPotentialStyle(
                              insights.leadPotential
                            )}`}
                          >
                            {insights.leadPotential}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* RECOMMENDED ACTION */}

                    <div className="rounded-xl border bg-white p-5 shadow-sm">

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                          📌
                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Recommended Next Action
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {String(
                              insights.recommendedAction ||
                              ""
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* REASON */}

                    <div className="rounded-xl border bg-white p-5 shadow-sm">

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-lg">
                          💡
                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Reason
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-700">
                            {String(
                              insights.reason || ""
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* FOLLOW UP */}

                    <div className="rounded-xl border bg-gray-900 p-5 shadow-sm">

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg">
                          💬
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Best Follow-up Message
                          </p>

                          <p className="mt-3 text-sm leading-7 text-gray-100">
                            {String(
                              insights.followUpMessage ||
                              ""
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* AI BADGE */}

                    <div className="flex items-center justify-center pt-2">

                      <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-medium text-green-600">
                        ✨ AI Generated
                      </span>

                    </div>

                  </div>

                )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}