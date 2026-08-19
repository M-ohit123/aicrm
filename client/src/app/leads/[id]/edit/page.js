"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  useGetLeadByIdQuery,
  useUpdateLeadMutation,
} from "@/redux/services/leadApi";

const EditLead = () => {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const {
    data,
    isLoading: isFetching,
    isError,
  } = useGetLeadByIdQuery(id, {
    skip: !id,
  });

  const [updateLead, { isLoading: isUpdating }] =
    useUpdateLeadMutation();

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

  const [error, setError] = useState("");

  // Existing lead ko form me fill karo
  useEffect(() => {
    if (data?.data) {
      const lead = data.data;

      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        source: lead.source || "Website",
        status: lead.status || "New",
        priority: lead.priority || "Medium",
        notes: lead.notes || "",
      });
    }
  }, [data]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await updateLead({
        id,
        ...formData,
      }).unwrap();

      alert("Lead updated successfully!");

      router.push(`/leads/${id}`);
    } catch (error) {
      console.error("Update Lead Error:", error);

      setError(
        error?.data?.message ||
          "Failed to update lead."
      );
    }
  };

  // Loading
  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

          <p className="mt-4 text-sm text-gray-500">
            Loading lead...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">
            Lead not found
          </h2>

          <Link
            href="/leads"
            className="mt-5 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white"
          >
            Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6">

          <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/leads"
              className="hover:text-gray-900"
            >
              Leads
            </Link>

            <span>/</span>

            <Link
              href={`/leads/${id}`}
              className="hover:text-gray-900"
            >
              View Lead
            </Link>

            <span>/</span>

            <span className="text-gray-900">
              Edit
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Edit Lead
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update lead information.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border bg-white shadow-sm"
        >

          {/* Basic Information */}
          <div className="border-b p-5 sm:p-6">

            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

              {/* Company */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Company *
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
              </div>

            </div>
          </div>

          {/* Lead Information */}
          <div className="border-b p-5 sm:p-6">

            <h2 className="text-lg font-semibold text-gray-900">
              Lead Information
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* Source */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Source
                </label>

                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
                >
                  <option value="Website">Website</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                  <option value="Import">Import</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

            </div>
          </div>

          {/* Notes */}
          <div className="p-5 sm:p-6">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="5"
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:bg-white"
            />

          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 p-5 sm:flex-row sm:justify-end sm:p-6">

            <Link
              href={`/leads/${id}`}
              className="rounded-lg border bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : "Update Lead"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditLead;