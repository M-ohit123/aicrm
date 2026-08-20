
"use client";

import { useState } from "react";

import {
  useCreateActivityMutation,
} from "@/redux/services/activityApi";

const AddActivityForm = ({ leadId }) => {
  const [
    createActivity,
    { isLoading },
  ] = useCreateActivityMutation();

  const [formData, setFormData] = useState({
    type: "Call",
    title: "",
    description: "",
    activityDate: "",
    createdBy: "Admin",
  });

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // RESET FORM
  // =====================================

  const resetForm = () => {
    setFormData({
      type: "Call",
      title: "",
      description: "",
      activityDate: "",
      createdBy: "Admin",
    });
  };

  // =====================================
  // HANDLE SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lead ID validation
    if (!leadId) {
      alert("Lead ID is missing.");
      return;
    }

    // Title validation
    if (!formData.title.trim()) {
      alert("Please enter activity title.");
      return;
    }

    try {
      const activityData = {
        lead: leadId,

        type: formData.type,

        title: formData.title.trim(),

        description: formData.description.trim(),

        activityDate: formData.activityDate
          ? new Date(
              formData.activityDate
            ).toISOString()
          : new Date().toISOString(),

        createdBy:
          formData.createdBy.trim() || "Admin",
      };

      console.log(
        "SENDING ACTIVITY:",
        activityData
      );

      const response =
        await createActivity(
          activityData
        ).unwrap();

      console.log(
        "ACTIVITY CREATED:",
        response
      );

      alert(
        "Activity added successfully!"
      );

      // Reset form
      resetForm();

      // ActivityTimeline automatically
      // refetches because activityApi
      // invalidates LEAD-${leadId} tag.

    } catch (error) {
      console.error(
        "CREATE ACTIVITY ERROR:",
        error
      );

      console.error(
        "ERROR DATA:",
        error?.data
      );

      console.error(
        "ERROR STATUS:",
        error?.status
      );

      alert(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to create activity"
      );
    }
  };

  // =====================================
  // LEAD ID MISSING
  // =====================================

  if (!leadId) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-medium text-red-600">
          Lead ID is missing. Cannot add activity.
        </p>
      </div>
    );
  }

  // =====================================
  // FORM
  // =====================================

  return (
    <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm sm:p-6">

      {/* HEADER */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Add Activity
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add a new activity for this lead.
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* ACTIVITY TYPE */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Activity Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
          >
            <option value="Call">
              📞 Call
            </option>

            <option value="Email">
              📧 Email
            </option>

            <option value="Meeting">
              📅 Meeting
            </option>

            <option value="Note">
              📝 Note
            </option>

            <option value="Follow Up">
              🔄 Follow Up
            </option>

            <option value="Status Change">
              🔔 Status Change
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
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g. Follow up call"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            rows={4}
            placeholder="Enter activity details..."
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
          />
        </div>

        {/* ACTIVITY DATE */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Activity Date
          </label>

          <input
            type="datetime-local"
            name="activityDate"
            value={formData.activityDate}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
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
            value={formData.createdBy}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Admin"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
          />
        </div>

        {/* SUBMIT */}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Adding..."
              : "Add Activity"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddActivityForm;
