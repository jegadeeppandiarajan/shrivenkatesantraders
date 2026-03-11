import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Helper function to deduplicate items by product ID
const deduplicateItems = (items) => {
  if (!items || !Array.isArray(items)) return [];

  const seen = new Map();
  items.forEach((item) => {
    // Handle both populated and unpopulated product references
    const productId = item.product?._id || item.product;
    if (productId && item.product) {
      const existingItem = seen.get(productId.toString());
      if (existingItem) {
        // Merge quantities if duplicate found
        existingItem.quantity += item.quantity;
      } else {
        seen.set(productId.toString(), { ...item });
      }
    }
  });
  return Array.from(seen.values());
};

export const fetchCart = createAsyncThunk("cart/fetch", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/cart");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to load cart"
    );
  }
});

export const addCartItem = createAsyncThunk(
  "cart/add",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/cart", payload);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add item"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.put("/cart", payload);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (productId, thunkAPI) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCart = createAsyncThunk("cart/clear", async (_, thunkAPI) => {
  try {
    const { data } = await api.delete("/cart");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to clear cart"
    );
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Reset cart state (useful for logout)
    resetCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        // Deduplicate items when fetching cart
        state.items = deduplicateItems(action.payload.items || []);
        state.totalItems = action.payload.totalItems || 0;
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") &&
          action.type.endsWith("/fulfilled") &&
          action.type !== "cart/fetch/fulfilled",
        (state, action) => {
          // Deduplicate items for all cart operations
          state.items = deduplicateItems(action.payload.items || []);
          state.totalItems = action.payload.totalItems || 0;
          state.totalPrice = action.payload.totalPrice || 0;
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;

