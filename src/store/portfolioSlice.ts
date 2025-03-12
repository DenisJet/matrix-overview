import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 } from "uuid";

interface Asset {
  id: string;
  name: string;
  quantity: number;
  currentPrice: number;
  purchasePrice: number;
  change24h: number;
  percentageOfPortfolio: number;
  symbol: string;
}

interface AssetState {
  assets: Asset[];
  availableCurrencies: Asset[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AssetState = {
  assets: JSON.parse(localStorage.getItem("Asset") || "[]"),
  availableCurrencies: [],
  isLoading: false,
  error: null,
};

export const fetchAvailableCurrencies = createAsyncThunk(
  "portfolio/fetchAvailableCurrencies",
  async () => {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/24hr",
    );
    return response.data;
  },
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Omit<Asset, "id">>) => {
      const newAsset = { ...action.payload, id: v4() };
      state.assets.push(newAsset);
      localStorage.setItem("assets", JSON.stringify(state.assets));
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(
        (asset) => asset.id !== action.payload,
      );
      localStorage.setItem("assets", JSON.stringify(state.assets));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableCurrencies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableCurrencies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableCurrencies = action.payload;
      })
      .addCase(fetchAvailableCurrencies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { addAsset, removeAsset } = portfolioSlice.actions;
export default portfolioSlice.reducer;
