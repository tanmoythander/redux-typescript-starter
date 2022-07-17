import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import counterReducer from './slices/counterSlice';
import accountReducer from './slices/accountSlice';

const persistConfig = {
  key: 'root',
  storage
};

export const store = configureStore({
  reducer: {
    counter: persistReducer(persistConfig, counterReducer),
    account: persistReducer(persistConfig, accountReducer)
  },
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
