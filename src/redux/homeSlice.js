import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchProfile = createAsyncThunk('home/fetchProfile', async (_, thunkAPI) => {
  try {
    const response = await api.get('/profile');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProfile = createAsyncThunk('home/updateProfile', async (profileData, thunkAPI) => {
  try {
    const response = await api.put('/profile/update', profileData);
    return response.data; // { status, message, data: { ... } }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProfileImage = createAsyncThunk('home/updateProfileImage', async (formData, thunkAPI) => {
  try {
    const response = await api.put('/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchBalance = createAsyncThunk('home/fetchBalance', async (_, thunkAPI) => {
  try {
    const response = await api.get('/balance');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchServices = createAsyncThunk('home/fetchServices', async (_, thunkAPI) => {
  try {
    const response = await api.get('/services');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchBanners = createAsyncThunk('home/fetchBanners', async (_, thunkAPI) => {
  try {
    const response = await api.get('/banner');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const postTopUp = createAsyncThunk('home/postTopUp', async (amount, thunkAPI) => {
  try {
    const response = await api.post('/topup', { top_up_amount: amount });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const postTransaction = createAsyncThunk('home/postTransaction', async (service_code, thunkAPI) => {
  try {
    const response = await api.post('/transaction', { service_code });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchHistory = createAsyncThunk('home/fetchHistory', async ({ offset, limit }, thunkAPI) => {
  try {
    const response = await api.get(`/transaction/history?offset=${offset}&limit=${limit}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    profile: null,
    balance: 0,
    services: [],
    banners: [],
    loadingProfile: false,
    loadingBalance: false,
    loadingServices: false,
    loadingBanners: false,
    loadingTopUp: false,
    loadingTransaction: false,
    loadingHistory: false,
    history: [],
    historyOffset: 0,
    hasMoreHistory: true,
    error: null,
  },
  reducers: {
    resetHistory: (state) => {
      state.history = [];
      state.historyOffset = 0;
      state.hasMoreHistory = true;
    }
  },
  extraReducers: (builder) => {
    // Profile
    builder.addCase(fetchProfile.pending, (state) => { state.loadingProfile = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => { state.loadingProfile = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.error = action.payload;
      })
      .addCase(updateProfileImage.pending, (state) => { state.loadingProfile = true; })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload.data;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loadingProfile = false;
        state.error = action.payload;
      });

    // Balance
    builder.addCase(fetchBalance.pending, (state) => { state.loadingBalance = true; })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loadingBalance = false;
        state.balance = action.payload.balance;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loadingBalance = false;
        state.error = action.payload;
      });

    // Services
    builder.addCase(fetchServices.pending, (state) => { state.loadingServices = true; })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loadingServices = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loadingServices = false;
        state.error = action.payload;
      });

    // Banners
    builder.addCase(fetchBanners.pending, (state) => { state.loadingBanners = true; })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loadingBanners = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loadingBanners = false;
        state.error = action.payload;
      });

    // TopUp
    builder.addCase(postTopUp.pending, (state) => { state.loadingTopUp = true; })
      .addCase(postTopUp.fulfilled, (state, action) => {
        state.loadingTopUp = false;
        state.balance = action.payload.balance;
      })
      .addCase(postTopUp.rejected, (state, action) => {
        state.loadingTopUp = false;
        state.error = action.payload;
      });

    // Transaction
    builder.addCase(postTransaction.pending, (state) => { state.loadingTransaction = true; })
      .addCase(postTransaction.fulfilled, (state) => {
        state.loadingTransaction = false;
      })
      .addCase(postTransaction.rejected, (state, action) => {
        state.loadingTransaction = false;
        state.error = action.payload;
      });

    // History
    builder.addCase(fetchHistory.pending, (state) => { state.loadingHistory = true; })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        const newRecords = action.payload.records || [];
        // Append new records
        state.history = [...state.history, ...newRecords];
        // If we received fewer records than the limit we requested (or no records), there are no more
        if (newRecords.length === 0) {
          state.hasMoreHistory = false;
        }
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload;
      });
  }
});

export const { resetHistory } = homeSlice.actions;

export default homeSlice.reducer;
