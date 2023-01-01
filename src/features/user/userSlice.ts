import {userAPIs} from './../../api/user/index';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {RootState, store} from '../../app/store';
import authAPIs from '../../api/auth';
import {
  IGiftOfLoyalty,
  ILoyaltyProgram,
  IUser,
  IUserAppSetting,
  IUserLoyalty,
  IVendorOfUser,
} from '../../types/interface';
import i18n from '../../i18n/config';
import {ProgramTypes} from '../../constants/constants';
import _ from 'lodash';

interface UserSliceState {
  user: IUser;
  giftsFromSelectedVendor: ILoyaltyProgram[];
  appSetting: IUserAppSetting;
  fcmToken: string;
  vendorOverview: IVendorOfUser[];
  loyalty: IUserLoyalty;
}

const initialState: UserSliceState = {
  user: {
    identity: '',
    displayName: '',
    phoneNumber: undefined,
    email: '',
    birthday: '',
    gender: undefined,
    image: '',
    status: undefined,
  },
  giftsFromSelectedVendor: [],
  vendorOverview: [],
  loyalty: {},
  appSetting: {
    isFingerprintLogin: false,
    isGetNotifications: false,
    langId: 'vi',
    vendorId: undefined,
  },
  fcmToken: '',
};

export const getUser = createAsyncThunk('user/getUser', async (thunkAPI) => {
  const res = await authAPIs.getUserInfo();
  return res;
});

export const getGiftsFromSelectedVendor = createAsyncThunk(
  'user/getGiftsFromSelectedVendor',
  async (agrs, thunkAPI) => {
    const res = await userAPIs.getLoyaltyProgram();
    return res;
  }
);

export const getUserAppSetting = createAsyncThunk('user/getUserAppSetting', async (agrs, thunkAPI) => {
  const res = await userAPIs.getUserAppSetting();
  if (res?.langId) await i18n.changeLanguage(res.langId.toLowerCase());
  return res;
});

export const getVendorOverview = createAsyncThunk('user/getVendorOverview', async (agrs, thunkAPI) => {
  const res = await userAPIs.getVendorOverview();
  return res;
});

export const getUserLoyalty = createAsyncThunk('user/getUserLoyalty', async (thunkAPI) => {
  const res = await userAPIs.getTotalPointAndGift();
  return res;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserSlice: () => initialState,
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setFcmToken: (state, action: PayloadAction<string>) => {
      state.fcmToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get User Info
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      console.log('Error getUser: ', action.error);
    });

    //Get Gifts from selected vendor:
    builder.addCase(getGiftsFromSelectedVendor.fulfilled, (state, action) => {
      // let listGift: IGiftOfLoyalty[] = [];
      // const listProgram: ILoyaltyProgram[] = action.payload.data || [];
      // listProgram?.map((item) => {
      //   item.giftOfLoyalty?.map((gift) => {
      //     listGift.push(gift);
      //   });
      // });
      state.giftsFromSelectedVendor = action.payload.data;
    });
    builder.addCase(getGiftsFromSelectedVendor.rejected, (state, action) => {
      console.log('Error getLoyaltyProgram: ', action.error);
    });

    //Get User App Setting:
    builder.addCase(getUserAppSetting.fulfilled, (state, action) => {
      state.appSetting = action.payload;
    });
    builder.addCase(getUserAppSetting.rejected, (state, action) => {
      console.log('Error getUserAppSetting: ', action.error);
    });

    //Get Vendor Overview:
    builder.addCase(getVendorOverview.fulfilled, (state, action) => {
      state.vendorOverview = action.payload;
    });
    builder.addCase(getVendorOverview.rejected, (state, action) => {
      console.log('Error getVendorOverview: ', action.error);
    });

    //Get User Loyalty:
    builder.addCase(getUserLoyalty.fulfilled, (state, action) => {
      state.loyalty = action.payload;
    });
    builder.addCase(getUserLoyalty.rejected, (state, action) => {
      console.log('Error getUserLoyalty: ', action.error);
    });
  },
});

export const {setUser, resetUserSlice, setFcmToken} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user;
export const selectGiftsFromSelectedVendor = (state: RootState) => state.user.giftsFromSelectedVendor;
export const selectUserAppSetting = (state: RootState) => state.user.appSetting;

//* Get user's loyalty information
export const selectUserLoyalty = (state: RootState) => {
  return state.user.loyalty;
};

const getSelectedVendor = (state: RootState) => {
  // Id of selected vendor:
  const idVendor = state.user.appSetting.vendorId;
  // Selected vendor:
  const vendorOfUser = state.user.vendorOverview.find((item) => item.id === idVendor);
  return vendorOfUser;
};

//* Get current selected vendor
export const selectCurrentVendor = (state: RootState) => {
  return state.vendor.allVendors.find((item) => item.id === state.user.appSetting.vendorId);
};

//* Get all points of user
export const selectAllPointsOfUser = (state: RootState) => {
  const listTotalPointsOfUser = state.user.vendorOverview.map((item) => {
    const {totalPoint, aboutToExpire, name, logo} = item;
    return {
      totalPoint,
      aboutToExpire,
      vendor: {
        name,
        logo,
      },
    };
  });
  return listTotalPointsOfUser;
};

//* Get all gift count of user by vendor
export const selectAllGiftCountOfUser = (state: RootState) => {
  const listGiftsOfUser = state.user.vendorOverview.map((item) => {
    const {totalGift, name, logo} = item;
    return {
      totalGift,
      vendor: {
        name,
        logo,
      },
    };
  });
  return listGiftsOfUser;
};

// Select Programs:

export const selectProgramsByVendor = (state: RootState) => state.user.vendorOverview;

export const selectGiftExchangeProgramsByVendor = (state: RootState) => {
  let res = _.cloneDeep(state.user.vendorOverview);
  for (let i = 0; i < res?.length; i++) {
    res[i].loyaltyProgram = res[i]?.loyaltyProgram?.filter((p) => {
      return p?.type == ProgramTypes.LoyaltyGiftExchangeProgram.type;
    });
  }
  return res;
};

export const selectAccumulatePointProgramsByVendor = (state: RootState) => {
  let res = _.cloneDeep(state.user.vendorOverview);
  for (let i = 0; i < res?.length; i++) {
    res[i].loyaltyProgram = res[i]?.loyaltyProgram?.filter((p) => {
      return p?.type == ProgramTypes.LoyaltyPurchaseProgram.type || p?.type == ProgramTypes.LoyaltyQrCodeProgram.type;
    });
  }
  return res;
};

export default userSlice.reducer;
