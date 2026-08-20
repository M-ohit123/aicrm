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

export const aiApi = createApi({
  reducerPath: "aiApi",

  baseQuery,

  tagTypes: ["AI"],

  endpoints: (builder) => ({
    generateLeadInsights: builder.mutation({
      query: (leadData) => ({
        url: "/ai/lead-insights",
        method: "POST",
        body: leadData,
      }),

      invalidatesTags: ["AI"],
    }),
  }),
});

export const {
  useGenerateLeadInsightsMutation,
} = aiApi;