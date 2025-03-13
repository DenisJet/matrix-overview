import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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

export interface Currency {
  askPrice: string;
  askQty: string;
  bidPrice: string;
  bidQty: string;
  closeTime: number;
  count: number;
  firstId: number;
  highPrice: string;
  lastId: number;
  lastPrice: string;
  lastQty: string;
  lowPrice: string;
  openPrice: string;
  openTime: number;
  prevClosePrice: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  volume: string;
  weightedAvgPrice: string;
}

interface PortfolioState {
  assets: Asset[];
  availableCurrencies: Currency[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  totalValue: number;
}

const initialState: PortfolioState = {
  assets: JSON.parse(localStorage.getItem("assets") || "[]"),
  availableCurrencies: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
  totalValue: 0,
};

export const fetchAvailableCurrencies = createAsyncThunk(
  "portfolio/fetchAvailableCurrencies",
  async () => {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/24hr",
    );
    return response.data.filter((item: Currency) =>
      item.symbol.endsWith("USDT"),
    );
  },
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addAsset: (state, action) => {
      const existingAsset = state.assets.find(
        (asset) => asset.symbol === action.payload.symbol,
      );

      if (existingAsset) {
        existingAsset.quantity += action.payload.quantity;
        existingAsset.purchasePrice +=
          action.payload.currentPrice * action.payload.quantity;
        existingAsset.percentageOfPortfolio =
          (existingAsset.purchasePrice / state.totalValue) * 100;
      } else {
        const newAsset = {
          ...action.payload,
          purchasePrice: action.payload.currentPrice * action.payload.quantity,
          percentageOfPortfolio:
            ((action.payload.currentPrice * action.payload.quantity) /
              state.totalValue) *
            100,
        };
        state.assets.push(newAsset);
      }

      state.totalValue += action.payload.currentPrice * action.payload.quantity;

      state.assets.forEach((asset) => {
        asset.percentageOfPortfolio =
          (asset.purchasePrice / state.totalValue) * 100;
      });

      localStorage.setItem("assets", JSON.stringify(state.assets));
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(
        (asset) => asset.id !== action.payload,
      );
      localStorage.setItem("assets", JSON.stringify(state.assets));
    },
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
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

export const { addAsset, removeAsset, setIsModalOpen } = portfolioSlice.actions;
export default portfolioSlice.reducer;
