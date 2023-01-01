import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface ProductSliceState {

}

const initialState: ProductSliceState = {
    
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProductSlice: () => initialState,
  },
  extraReducers : (builder) => {
  },
})


export const {resetProductSlice} = productSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectAllVendors = (state: RootState) => state.vendor.allVendors

export default productSlice.reducer