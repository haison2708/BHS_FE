import {RootState} from './../../app/store';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {IVendorOfUser} from '../../types/interface';
import loyaltyProgramAPIs from '../../api/loyaltyProgram';
import { ProgramTypes } from '../../constants/constants';
import _ from 'lodash';

interface ProgramSliceState {
  programsPerVendor: IVendorOfUser[];
}

const initialState: ProgramSliceState = {
  programsPerVendor: [],
};

export const getAllProgram = createAsyncThunk('user/getAllProgram', async (thunkAPI) => {
  const res = await loyaltyProgramAPIs.getAllLoyaltyPrograms();
  return res;
});

export const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    resetProgramSlice: () => initialState,
  },
  extraReducers: (builder) => {
    //Get all program:
    builder.addCase(getAllProgram.fulfilled, (state, action) => {
      state.programsPerVendor = action.payload.data;
    });
    builder.addCase(getAllProgram.rejected, (state, action) => {
      console.log('Error getAllProgram: ', action.error);
    });
  },
});

export const {resetProgramSlice} = programSlice.actions;

// Select Programs:
export const selectFlatListAllPrograms = (state: RootState) =>
  state.program.programsPerVendor?.map((item) => item.loyaltyProgram).flat();

export const selectListProgramsPerVendor = (state: RootState) => state.program.programsPerVendor;

export const selectListGiftExchangeProgramsPerVendor = (state: RootState) => {
    let res = _.cloneDeep(state.program.programsPerVendor);
    for (let i = 0; i < res?.length; i++) {
      res[i].loyaltyProgram = res[i]?.loyaltyProgram?.filter((p) => {
        return p?.type == ProgramTypes.LoyaltyGiftExchangeProgram.type;
      });
    }
    return res;
  };

  export const selectListAccumulatePointProgramsPerVendor = (state: RootState) => {
    let res = _.cloneDeep(state.program.programsPerVendor);
    for (let i = 0; i < res?.length; i++) {
      res[i].loyaltyProgram = res[i]?.loyaltyProgram?.filter((p) => {
        return p?.type == ProgramTypes.LoyaltyPurchaseProgram.type || p?.type == ProgramTypes.LoyaltyQrCodeProgram.type;
      });
    }
    return res;
  };

export default programSlice.reducer;
