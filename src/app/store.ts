import { configureStore } from '@reduxjs/toolkit'
import UserReducer from '../features/user/userSlice'
import VendorReducer from '../features/vendor/vendorSlice'
import ProductReducer from '../features/product/productSlice'
import CategoryReducer from '../features/category/categorySlice'
import AppReducer from '../features/app/appSlice'
import NotificationReducer from '../features/notification/notificationSlice'
import ProgramReducer from '../features/program/programSlice'
import { combineReducers } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  user: UserReducer,
  vendor: VendorReducer,
  product: ProductReducer,
  category: CategoryReducer,
  app: AppReducer,
  notification: NotificationReducer,
  program: ProgramReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch