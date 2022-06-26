import { TypedUseSelectorHook, useDispatch as useDispatchCore, useSelector as useSelectorCore } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => useDispatchCore<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorCore;
