import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Helper function to deduplicate orders by ID
const deduplicateOrders = (orders) => {
  const seen = new Map();
  orders.forEach((order) => {
    if (order._id && !seen.has(order._id)) {
      seen.set(order._id, order);
    }
  });
  return Array.from(seen.values());
};

// Helper function to deduplicate timeline entries
const deduplicateTimeline = (timeline) => {
  const seen = new Map();
  timeline.forEach((entry) => {
    if (entry._id && !seen.has(entry._id)) {
      seen.set(entry._id, entry);
    }
  });
  return Array.from(seen.values());
};

export const createOrder = createAsyncThunk(
  "orders/create",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/orders", payload);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          "Unable to place order"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/list",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/orders");
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch orders"
      );
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "orders/detail",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to fetch order"
      );
    }
  }
);

export const trackOrder = createAsyncThunk(
  "orders/track",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await api.get(`/orders/${orderId}/timeline`);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to track order"
      );
    }
  }
);

export const createCheckoutSession = createAsyncThunk(
  "orders/checkout",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await api.post("/payments/create-checkout-session", {
        orderId,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to start checkout"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    current: null,
    timeline: [],
    loading: false,
    error: null,
    checkoutSession: null,
  },
  reducers: {
    clearCheckoutSession: (state) => {
      state.checkoutSession = null;
    },
    resetOrders: (state) => {
      state.list = [];
      state.current = null;
      state.timeline = [];
      state.loading = false;
      state.error = null;
      state.checkoutSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Deduplicate orders when fetching
        state.list = deduplicateOrders(action.payload || []);
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.current = action.payload;
        // Add new order and deduplicate
        state.list = deduplicateOrders([action.payload, ...state.list]);
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        // Deduplicate timeline entries
        state.timeline = deduplicateTimeline(action.payload || []);
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.checkoutSession = action.payload;
      });
  },
});

export const { clearCheckoutSession, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
