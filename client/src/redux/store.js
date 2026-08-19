import { configureStore } from "@reduxjs/toolkit";

import { leadApi } from "./services/leadApi";
import { aiApi } from "./services/aiApi";
import { activityApi } from "./services/activityApi";

export const store = configureStore({
  reducer: {
    [leadApi.reducerPath]: leadApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      leadApi.middleware,
      aiApi.middleware,
      activityApi.middleware
    ),
});