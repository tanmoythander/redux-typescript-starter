import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './reducers/counterSlice';
import accountReducer from './reducers/accountSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    account: accountReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
