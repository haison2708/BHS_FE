import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import categoryAPIs from "../../api/category";
import { ICategory } from "../../types/interface";

interface CategorySliceState {
    categories?: ICategory[];
}

const initialState: CategorySliceState = {
    categories: undefined,
};

export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async (args, thunkAPI) => {
        const res = await categoryAPIs.getAll();
        return res;
    }
);

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        resetCategorySlice: () => initialState,
        setCategory: (state, action: PayloadAction<ICategory[]>) => {
            state.categories = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getAllCategory:
        builder.addCase(getAllCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data;
        });
        builder.addCase(getAllCategories.rejected, (state, action) => {
            console.log("Error getAllCategories: ", action.error);
        });
    },
});

export const { setCategory, resetCategorySlice } = categorySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCategories = (state: RootState) => state.category.categories;

export default categorySlice.reducer;
