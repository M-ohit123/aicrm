import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const activityApi = createApi({
  reducerPath: "activityApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://aicrm-jj5n.onrender.com/api",

    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("crmToken");

        if (token) {
          headers.set(
            "Authorization",
            `Bearer ${token}`
          );
        }
      }

      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),

  tagTypes: ["Activity"],

  endpoints: (builder) => ({
    // GET ALL ACTIVITIES OF LEAD
    getLeadActivities: builder.query({
      query: (leadId) =>
        `/activities/lead/${leadId}`,

      providesTags: (result, error, leadId) => [
        {
          type: "Activity",
          id: leadId,
        },
      ],
    }),

    // GET SINGLE ACTIVITY
    getActivityById: builder.query({
      query: (id) =>
        `/activities/${id}`,

      providesTags: (result, error, id) => [
        {
          type: "Activity",
          id,
        },
      ],
    }),

    // CREATE ACTIVITY
    createActivity: builder.mutation({
      query: (activity) => ({
        url: "/activities",
        method: "POST",
        body: activity,
      }),

      invalidatesTags: (result, error, activity) => [
        {
          type: "Activity",
          id: activity?.lead,
        },
      ],
    }),

    // UPDATE ACTIVITY
    updateActivity: builder.mutation({
      query: ({ id, ...activity }) => ({
        url: `/activities/${id}`,
        method: "PUT",
        body: activity,
      }),

      invalidatesTags: (result, error, activity) => [
        {
          type: "Activity",
          id: activity?.lead,
        },
      ],
    }),

    // DELETE ACTIVITY
    deleteActivity: builder.mutation({
      query: (id) => ({
        url: `/activities/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetLeadActivitiesQuery,
  useGetActivityByIdQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} = activityApi;