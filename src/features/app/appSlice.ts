import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface AppSliceState {
    isLoading : boolean
}

const initialState: AppSliceState = {
    isLoading: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetAppSlice: () => initialState,
    setIsLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload
      },
  },
})


export const {setIsLoading, resetAppSlice} = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoading = (state: RootState) => state.app.isLoading

export default appSlice.reducer