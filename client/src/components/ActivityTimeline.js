"use client";

import { useState } from "react";

import {
  useGetLeadActivitiesQuery,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} from "@/redux/services/activityApi";

const ActivityTimeline = ({ leadId }) => {
  // =====================================
  // GET ACTIVITIES
  // =====================================

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetLeadActivitiesQuery(leadId, {
    skip: !leadId,
  });

  // =====================================
  // UPDATE
  // =====================================

  const [
    updateActivity,
    { isLoading: isUpdating },
  ] = useUpdateActivityMutation();

  // =====================================
  // DELETE
  // =====================================

  const [
    deleteActivity,
    { isLoading: isDeleting },
  ] = useDeleteActivityMutation();

  // =====================================
  // EDIT STATE
  // =====================================

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    type: "Call",
    title: "",
    description: "",
    activityDate: "",
    createdBy: "Admin",
  });

  // =====================================
  // ACTIVITIES
  // =====================================

  const activities = Array.isArray(data?.data)
    ? data.data
    : [];

  // =====================================
  // START EDIT
  // =====================================

  const handleEdit = (activity) => {
    setEditingId(activity._id);

    setEditForm({
      type: activity.type || "Call",
      title: activity.title || "",
      description: activity.description || "",
      activityDate: activity.activityDate
        ? new Date(activity.activityDate)
            .toISOString()
            .slice(0, 16)
        : "",
      createdBy: activity.createdBy || "Admin",
    });
  };

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // CANCEL EDIT
  // =====================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditForm({
      type: "Call",
      title: "",
      description: "",
      activityDate: "",
      createdBy: "Admin",
    });
  };

  // =====================================
  // UPDATE ACTIVITY
  // =====================================

  const handleUpdate = async (activity) => {
    if (!editForm.title.trim()) {
      alert("Please enter activity title.");
      return;
    }

    try {
      const response = await updateActivity({
        id: activity._id,

        // Important:
        // API ko lead chahiye tag invalidation ke liye
        lead:
          typeof activity.lead === "object"
            ? activity.lead?._id
            : activity.lead || leadId,

        type: editForm.type,

        title: editForm.title.trim(),

        description:
          editForm.description.trim(),

        activityDate: editForm.activityDate
          ? new Date(
              editForm.activityDate
            ).toISOString()
          : new Date().toISOString(),

        createdBy:
          editForm.createdBy.trim() ||
          "Admin",
      }).unwrap();

      console.log(
        "ACTIVITY UPDATED:",
        response
      );

      alert(
        "Activity updated successfully!"
      );

      handleCancelEdit();

      await refetch();
    } catch (error) {
      console.error(
        "UPDATE ACTIVITY ERROR:",
        error
      );

      alert(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to update activity"
      );
    }
  };

  // =====================================
  // DELETE ACTIVITY
  // =====================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) return;

    try {
      await deleteActivity(id).unwrap();

      alert(
        "Activity deleted successfully!"
      );

      await refetch();
    } catch (error) {
      console.error(
        "DELETE ACTIVITY ERROR:",
        error
      );

      alert(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to delete activity"
      );
    }
  };

  // =====================================
  // ICON
  // =====================================

  const getActivityIcon = (type) => {
    switch (type) {
      case "Call":
        return "📞";

      case "Email":
        return "📧";

      case "Meeting":
        return "📅";

      case "Note":
        return "📝";

      case "Follow Up":
        return "🔄";

      case "Status Change":
        return "🔔";

      default:
        return "📌";
    }
  };

  // =====================================
  // COLOR
  // =====================================

  const getActivityColor = (type) => {
    switch (type) {
      case "Call":
        return "bg-blue-50 text-blue-600";

      case "Email":
        return "bg-purple-50 text-purple-600";

      case "Meeting":
        return "bg-green-50 text-green-600";

      case "Note":
        return "bg-yellow-50 text-yellow-600";

      case "Follow Up":
        return "bg-orange-50 text-orange-600";

      case "Status Change":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Invalid date";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================
  // NO LEAD ID
  // =====================================

  if (!leadId) {
    return (
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-red-600">
          Lead ID is missing.
        </p>
      </div>
    );
  }

  // =====================================
  // LOADING
  // =====================================

  if (isLoading) {
    return (
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900">
          Activity Timeline
        </h2>

        <div className="flex items-center justify-center py-10">

          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

          <span className="ml-3 text-sm text-gray-500">
            Loading activities...
          </span>

        </div>

      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (isError) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="font-semibold text-red-700">
          Failed to load activities
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error?.data?.message ||
            "Unable to fetch activities."}
        </p>

        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>

      </div>
    );
  }

  // =====================================
  // MAIN
  // =====================================

  return (
    <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm sm:p-6">

      {/* HEADER */}

      <div className="mb-6 flex items-start justify-between gap-4">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Activity Timeline
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track all activities related to this lead.
          </p>

        </div>

        {isFetching && !isLoading && (
          <span className="text-xs text-gray-400">
            Updating...
          </span>
        )}

      </div>

      {/* EMPTY */}

      {activities.length === 0 ? (

        <div className="rounded-xl border border-dashed bg-gray-50 p-10 text-center">

          <div className="text-4xl">
            📋
          </div>

          <p className="mt-3 text-sm font-medium text-gray-700">
            No activities yet
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Activities for this lead will appear here.
          </p>

        </div>

      ) : (

        <div className="relative">

          {/* VERTICAL LINE */}

          <div className="absolute bottom-0 left-5 top-0 w-px bg-gray-200" />

          <div className="space-y-6">

            {activities.map((activity) => (

              <div
                key={activity._id}
                className="relative flex gap-4"
              >

                {/* ICON */}

                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(
                    activity.type
                  )}
                </div>

                {/* CONTENT */}

                <div className="min-w-0 flex-1 rounded-xl border bg-gray-50 p-4">

                  {/* EDIT MODE */}

                  {editingId === activity._id ? (

                    <div className="space-y-4">

                      {/* TYPE */}

                      <div>

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Activity Type
                        </label>

                        <select
                          name="type"
                          value={editForm.type}
                          onChange={
                            handleEditChange
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
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

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Title
                        </label>

                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={
                            handleEditChange
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                        />

                      </div>

                      {/* DESCRIPTION */}

                      <div>

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Description
                        </label>

                        <textarea
                          name="description"
                          value={
                            editForm.description
                          }
                          onChange={
                            handleEditChange
                          }
                          rows={4}
                          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                        />

                      </div>

                      {/* DATE */}

                      <div>

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Activity Date
                        </label>

                        <input
                          type="datetime-local"
                          name="activityDate"
                          value={
                            editForm.activityDate
                          }
                          onChange={
                            handleEditChange
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                        />

                      </div>

                      {/* CREATED BY */}

                      <div>

                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Created By
                        </label>

                        <input
                          type="text"
                          name="createdBy"
                          value={
                            editForm.createdBy
                          }
                          onChange={
                            handleEditChange
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                        />

                      </div>

                      {/* BUTTONS */}

                      <div className="flex flex-wrap justify-end gap-2">

                        <button
                          type="button"
                          onClick={
                            handleCancelEdit
                          }
                          disabled={isUpdating}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(
                              activity
                            )
                          }
                          disabled={isUpdating}
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdating
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                      </div>

                    </div>

                  ) : (

                    /* NORMAL MODE */

                    <>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold text-gray-900">
                              {activity.title ||
                                "Untitled Activity"}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getActivityColor(
                                activity.type
                              )}`}
                            >
                              {activity.type ||
                                "Activity"}
                            </span>

                          </div>

                          <p className="mt-1 text-xs text-gray-400">
                            {formatDate(
                              activity.activityDate
                            )}
                          </p>

                        </div>

                        {/* BUTTONS */}

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                activity
                              )
                            }
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() =>
                              handleDelete(
                                activity._id
                              )
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </div>

                      {/* DESCRIPTION */}

                      {activity.description && (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                          {activity.description}
                        </p>
                      )}

                      {/* CREATED BY */}

                      {activity.createdBy && (
                        <p className="mt-3 text-xs text-gray-400">

                          Created by:{" "}

                          <span className="font-medium text-gray-500">
                            {activity.createdBy}
                          </span>

                        </p>
                      )}

                    </>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
};

// =====================================
// DEFAULT EXPORT
// =====================================

export default ActivityTimeline;