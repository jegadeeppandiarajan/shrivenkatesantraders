import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchProducts = createAsyncThunk(
  "products/list",
  async (params = {}, thunkAPI) => {
    try {
      const { data } = await api.get("/products", { params });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to load products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/get",
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Product not found"
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/featured",
  async () => {
    const { data } = await api.get("/products/featured");
    return data.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    featured: [],
    selected: null,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      });
  },
});

export default productSlice.reducer;

