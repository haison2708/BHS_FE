import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState, store } from "../../app/store";
import vendorAPIs from "../../api/vendor";
import { IVendor } from "../../types/interface";

interface VendorSliceState {
    allVendors: IVendor[];
    followingVendors: IVendor[];
}

const initialState: VendorSliceState = {
    allVendors: [],
    followingVendors: [],
};

export const getAllVendors = createAsyncThunk(
    "vendor/getAllVendor",
    async (args, thunkAPI) => {
        const res = await vendorAPIs.getAll();
        return res;
    }
);

export const getFollowingVendors = createAsyncThunk(
    "vendor/getFollowingVendor",
    async (args, thunkAPI) => {
        const res = await vendorAPIs.getFollowingVendors();
        return res;
    }
);

export const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {
        resetVendorSlice: () => initialState,
        setAllVendors: (state, action: PayloadAction<IVendor[]>) => {
            state.allVendors = action.payload;
        },
        setFollowingVendors: (state, action: PayloadAction<IVendor[]>) => {
            state.followingVendors = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getAllVendors:
        builder.addCase(getAllVendors.fulfilled, (state, action) => {
            state.allVendors = action.payload;
        });
        builder.addCase(getAllVendors.rejected, (state, action) => {
            console.log("Error getAllVendor: ", action.error);
        });
        // getFollowingVendors:
        builder.addCase(getFollowingVendors.fulfilled, (state, action) => {
            state.followingVendors = action.payload;
        });
        builder.addCase(getFollowingVendors.rejected, (state, action) => {
            console.log("Error getFollowingVendor: ", action.error);
        });
    },
});

export const { setAllVendors, setFollowingVendors, resetVendorSlice } = vendorSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllVendors = (state: RootState) => state.vendor.allVendors;
export const selectFollowingVendors = (state: RootState) =>
    state.vendor.followingVendors;
export const selectSelectedVendor = (state: RootState) =>
    state.vendor.allVendors.find((item) => {
        return item.id == state.user.appSetting.vendorId;
    });

export default vendorSlice.reducer;
