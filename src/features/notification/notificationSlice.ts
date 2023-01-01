import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { INotificationData, INotificationMessage } from "../../types/interface";
import notificationAPIs from "../../api/notification";

interface NotificationSliceState {
  all?: INotificationData;
  promotion?: INotificationData;
  system?: INotificationData;
  other?: INotificationData;
}

const initialState: NotificationSliceState = {
  all: {},
  promotion: {},
  system: {},
  other: {},
};

export const getAllNotifications = createAsyncThunk(
  "notification/getAllNotifications",
  async (agrs, thunkAPI) => {
    const res = await notificationAPIs.getAllNotifications();
    return res;
  }
);

export const getPromotionNotificaitons = createAsyncThunk(
  "notification/getPromotionNotificaitons",
  async (agrs, thunkAPI) => {
    const res = await notificationAPIs.getPromotionNotifications();
    return res;
  }
);

export const getSystemNotificaitons = createAsyncThunk(
  "notification/getSystemNotificaitons",
  async (agrs, thunkAPI) => {
    const res = await notificationAPIs.getSystemNotifications();
    return res;
  }
);

export const getOtherNotificaitons = createAsyncThunk(
  "notification/getOtherNotificaitons",
  async (agrs, thunkAPI) => {
    const res = await notificationAPIs.getOtherNotifications();
    return res;
  }
);

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (agrs, thunkAPI) => {
    thunkAPI.dispatch(getAllNotifications())
    thunkAPI.dispatch(getPromotionNotificaitons())
    thunkAPI.dispatch(getSystemNotificaitons())
    thunkAPI.dispatch(getOtherNotificaitons())
  }
);

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    resetNotificationSlice: () => initialState,
  },
  extraReducers: (builder) => {
    // getAllNotifications:
    builder.addCase(getAllNotifications.fulfilled, (state, action) => {
      state.all = action.payload.data?.[0];
    });
    builder.addCase(getAllNotifications.rejected, (state, action) => {
      console.log("Error getAllNotifications: ", action.error);
    });

    // getPromotionNotificaitons:
    builder.addCase(getPromotionNotificaitons.fulfilled, (state, action) => {
      state.promotion = action.payload.data?.[0];
    });
    builder.addCase(getPromotionNotificaitons.rejected, (state, action) => {
      console.log("Error getPromotionNotificaitons: ", action.error);
    });

    // getSystemNotificaitons:
    builder.addCase(getSystemNotificaitons.fulfilled, (state, action) => {
      state.system = action.payload.data?.[0];
    });
    builder.addCase(getSystemNotificaitons.rejected, (state, action) => {
      console.log("Error getSystemNotificaitons: ", action.error);
    });

    // getOtherNotificaitons:
    builder.addCase(getOtherNotificaitons.fulfilled, (state, action) => {
      state.other = action.payload.data?.[0];
    });
    builder.addCase(getOtherNotificaitons.rejected, (state, action) => {
      console.log("Error getOtherNotificaitons: ", action.error);
    });
  },
});

export const { resetNotificationSlice } = notificationSlice.actions;

export const selectAllNotificationsData = (state: RootState) => {
  return state.notification.all;
};

export const selectPromotionNotificationsData = (state: RootState) => {
  return state.notification.promotion;
};

export const selectSystemNotificationsData = (state: RootState) => {
  return state.notification.system;
};

export const selectOtherNotificationsData = (state: RootState) => {
  return state.notification.other;
};

export default notificationSlice.reducer;
