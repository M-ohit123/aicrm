import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
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

    headers.set(
      "Content-Type",
      "application/json"
    );

    return headers;
  },
});

export const leadApi = createApi({
  reducerPath: "leadApi",

  baseQuery,

  tagTypes: ["Lead"],

  endpoints: (builder) => ({
    // =========================
    // GET ALL LEADS
    // =========================
    getLeads: builder.query({
      query: () => "/leads",

      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Lead",
                id: _id,
              })),
              {
                type: "Lead",
                id: "LIST",
              },
            ]
          : [
              {
                type: "Lead",
                id: "LIST",
              },
            ],
    }),

    // =========================
    // GET SINGLE LEAD
    // =========================
    getLeadById: builder.query({
      query: (id) => `/leads/${id}`,

      providesTags: (result, error, id) => [
        {
          type: "Lead",
          id,
        },
      ],

      keepUnusedDataFor: 60,
    }),

    // =========================
    // CREATE LEAD
    // =========================
    createLead: builder.mutation({
      query: (lead) => ({
        url: "/leads",
        method: "POST",
        body: lead,
      }),

      invalidatesTags: [
        {
          type: "Lead",
          id: "LIST",
        },
      ],
    }),

    // =========================
    // UPDATE LEAD
    // =========================
    updateLead: builder.mutation({
      query: ({ id, ...lead }) => ({
        url: `/leads/${id}`,
        method: "PUT",
        body: lead,
      }),

      invalidatesTags: (result, error, { id }) => [
        {
          type: "Lead",
          id,
        },
        {
          type: "Lead",
          id: "LIST",
        },
      ],
    }),

    // =========================
    // SAVE AI INSIGHTS
    // =========================
    saveAIInsights: builder.mutation({
      query: ({ id, insights }) => ({
        url: `/leads/${id}/ai-insights`,
        method: "PUT",
        body: insights,
      }),

      invalidatesTags: (result, error, { id }) => [
        {
          type: "Lead",
          id,
        },
      ],
    }),

    // =========================
    // DELETE LEAD
    // =========================
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Lead",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useSaveAIInsightsMutation,
  useDeleteLeadMutation,
} = leadApi;