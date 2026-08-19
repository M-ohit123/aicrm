"use client";

import { useState } from "react";

import {
  useGetLeadActivitiesQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} from "@/redux/services/activityApi";

import { useGetLeadsQuery } from "@/redux/services/leadApi";

export default function ActivitiesPage() {
  const [selectedLead, setSelectedLead] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    lead: "",
    type: "Call",
    title: "",
    description: "",
    activityDate: "",
    createdBy: "",
  });

  const {
    data: leadsData,
    isLoading: leadsLoading,
  } = useGetLeadsQuery();

  const leads = leadsData?.data || [];

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    isError,
    error,
  } = useGetLeadActivitiesQuery(selectedLead, {
    skip: !selectedLead,
  });

  const activities = activitiesData?.data || [];

  const [createActivity, { isLoading: creating }] =
    useCreateActivityMutation();

  const [updateActivity, { isLoading: updating }] =
    useUpdateActivityMutation();

  const [deleteActivity] =
    useDeleteActivityMutation();

  // ===============================
  // FORM CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // SELECT LEAD
  // ===============================

  const handleLeadChange = (e) => {
    const leadId = e.target.value;

    setSelectedLead(leadId);

    setForm((prev) => ({
      ...prev,
      lead: leadId,
    }));
  };

  // ===============================
  // CREATE / UPDATE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.lead) {
      alert("Please select a lead");
      return;
    }

    if (!form.title.trim()) {
      alert("Please enter activity title");
      return;
    }

    try {
      if (editingId) {
        await updateActivity({
          id: editingId,
          type: form.type,
          title: form.title,
          description: form.description,
          activityDate: form.activityDate,
          createdBy: form.createdBy,
          lead: form.lead,
        }).unwrap();

        alert("Activity updated successfully");
      } else {
        await createActivity({
          lead: form.lead,
          type: form.type,
          title: form.title,
          description: form.description,
          activityDate: form.activityDate,
          createdBy: form.createdBy,
        }).unwrap();

        alert("Activity created successfully");
      }

      resetForm();
    } catch (err) {
      console.error("Activity save error:", err);

      alert(
        err?.data?.message ||
          "Failed to save activity"
      );
    }
  };

  // ===============================
  // EDIT
  // ===============================

  const handleEdit = (activity) => {
    setEditingId(activity._id);

    setForm({
      lead:
        activity.lead?._id ||
        activity.lead ||
        "",
      type: activity.type || "Call",
      title: activity.title || "",
      description: activity.description || "",
      activityDate: activity.activityDate
        ? activity.activityDate.slice(0, 16)
        : "",
      createdBy: activity.createdBy || "",
    });

    setSelectedLead(
      activity.lead?._id ||
        activity.lead ||
        ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmDelete) return;

    try {
      await deleteActivity(id).unwrap();

      alert("Activity deleted successfully");
    } catch (err) {
      console.error(
        "Delete activity error:",
        err
      );

      alert(
        err?.data?.message ||
          "Failed to delete activity"
      );
    }
  };

  // ===============================
  // RESET
  // ===============================

  const resetForm = () => {
    setEditingId(null);

    setForm({
      lead: selectedLead,
      type: "Call",
      title: "",
      description: "",
      activityDate: "",
      createdBy: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Activities
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage calls, meetings, tasks and other
            lead activities.
          </p>
        </div>

        {/* ============================= */}
        {/* CREATE / UPDATE FORM */}
        {/* ============================= */}

        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId
                ? "Edit Activity"
                : "Create Activity"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add an activity for a lead.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >

            {/* LEAD */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Lead
              </label>

              <select
                value={form.lead}
                onChange={handleLeadChange}
                disabled={leadsLoading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              >
                <option value="">
                  Select Lead
                </option>

                {leads.map((lead) => (
                  <option
                    key={lead._id}
                    value={lead._id}
                  >
                    {lead.name}
                    {lead.company
                      ? ` - ${lead.company}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* TYPE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Activity Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              >
                <option value="Call">
                  Call
                </option>

                <option value="Meeting">
                  Meeting
                </option>

                <option value="Email">
                  Email
                </option>

                <option value="Task">
                  Task
                </option>

                <option value="Note">
                  Note
                </option>

                <option value="Follow-up">
                  Follow-up
                </option>
              </select>
            </div>

            {/* TITLE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter activity title"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            {/* DATE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Activity Date
              </label>

              <input
                type="datetime-local"
                name="activityDate"
                value={form.activityDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            {/* CREATED BY */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Created By
              </label>

              <input
                type="text"
                name="createdBy"
                value={form.createdBy}
                onChange={handleChange}
                placeholder="Admin"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={creating || updating}
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating || updating
                  ? "Saving..."
                  : editingId
                  ? "Update Activity"
                  : "Create Activity"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>
        </div>

        {/* ============================= */}
        {/* LEAD FILTER */}
        {/* ============================= */}

        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            View Activities For Lead
          </label>

          <select
            value={selectedLead}
            onChange={handleLeadChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 md:max-w-md"
          >
            <option value="">
              Select a lead
            </option>

            {leads.map((lead) => (
              <option
                key={lead._id}
                value={lead._id}
              >
                {lead.name}
              </option>
            ))}
          </select>
        </div>

        {/* ============================= */}
        {/* ACTIVITIES LIST */}
        {/* ============================= */}

        <div className="rounded-2xl border bg-white shadow-sm">

          <div className="border-b p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Activity History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {selectedLead
                ? "Activities for the selected lead."
                : "Select a lead to view activities."}
            </p>
          </div>

          {!selectedLead && (
            <div className="p-10 text-center">
              <p className="text-gray-500">
                Please select a lead.
              </p>
            </div>
          )}

          {selectedLead &&
            activitiesLoading && (
              <div className="p-10 text-center">
                <p className="text-sm text-gray-500">
                  Loading activities...
                </p>
              </div>
            )}

          {selectedLead &&
            !activitiesLoading &&
            isError && (
              <div className="p-10 text-center">
                <p className="text-sm text-red-600">
                  Failed to load activities.
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {error?.data?.message ||
                    "Please try again."}
                </p>
              </div>
            )}

          {selectedLead &&
            !activitiesLoading &&
            !isError &&
            activities.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-gray-500">
                  No activities found.
                </p>
              </div>
            )}

          {activities.length > 0 && (
            <div className="divide-y">

              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="p-5 transition hover:bg-gray-50"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {activity.type}
                        </span>

                        <h3 className="font-semibold text-gray-900">
                          {activity.title}
                        </h3>

                      </div>

                      {activity.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {activity.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">

                        {activity.activityDate && (
                          <span>
                            📅{" "}
                            {new Date(
                              activity.activityDate
                            ).toLocaleString()}
                          </span>
                        )}

                        {activity.createdBy && (
                          <span>
                            👤 {activity.createdBy}
                          </span>
                        )}

                      </div>
                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(activity)
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            activity._id
                          )
                        }
                        className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}