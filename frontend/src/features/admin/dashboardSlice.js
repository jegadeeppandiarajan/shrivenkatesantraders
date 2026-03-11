import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  async (days = 30, thunkAPI) => {
    try {
      const { data } = await api.get(`/admin/dashboard?days=${days}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to load dashboard",
      );
    }
  },
);

export const fetchPayments = createAsyncThunk(
  "dashboard/payments",
  async () => {
    const { data } = await api.get("/admin/payments");
    return data.data;
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    metrics: null,
    orderStatusCounts: null,
    revenueSeries: [],
    bestSellers: [],
    lowStock: [],
    recentOrders: [],
    topCustomers: [],
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateRealtimeStats: (state, action) => {
      if (!state.metrics) return;
      if (action.payload?.type === "orders") {
        state.metrics.totalOrders += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics;
        state.orderStatusCounts = action.payload.orderStatusCounts;
        state.revenueSeries = action.payload.revenueSeries;
        state.bestSellers = action.payload.bestSellers;
        state.lowStock = action.payload.lowStock;
        state.recentOrders = action.payload.recentOrders || [];
        state.topCustomers = action.payload.topCustomers || [];
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
      });
  },
});

export const { updateRealtimeStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;

