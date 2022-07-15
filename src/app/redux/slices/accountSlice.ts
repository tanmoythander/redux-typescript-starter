import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { fetchAmount } from './amountAPIDummy';

type QueueState = 'idle' | 'loading' | 'failed';

export interface AccountState {
	balance: number;
	savings: number;
	loans: number;
	queueStatus: QueueState;
}

const initialState: AccountState = {
	balance: 100,
	savings: 0,
	loans: 0,
	queueStatus: 'idle'
}

// Thunk Action: Option A
// Supports only Async action
// Returns `pending`, `fulfilled` and `rejected` actions
// which requires to be registered using "builder callback"
// under the extra reducers inside the slice later.
export const withdrawFromSavingsA = createAsyncThunk(
	'account/withdrawFromSavingsA',
	async (amount: number) => {
		const res = await fetchAmount(amount);
		return res.amount;
	}
);
export const receiveLoanA = createAsyncThunk(
	'account/receiveLoanA',
	async (amount: number) => {
		const res = await fetchAmount(amount);
		return res.amount;
	}
);

export const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		deposit: (state, action: PayloadAction<number>) => {
			state.balance += action.payload;
		},
		withdraw: (state, action: PayloadAction<number>) => {
			if (action.payload <= state.balance) {
				// fund is available for withdrawal
				state.balance -= action.payload;
			}
		},
		depositToSavings: (state, action: PayloadAction<number>) => {
			if (action.payload <= state.balance) {
				// fund is available for deposit to savings
				state.balance -= action.payload;
				state.savings += action.payload;
			}
		},
		// private action
		withdrawFromSavings: (state, action: PayloadAction<number>) => {
			if (action.payload <= state.savings) {
				// fund is available for withdrawal from savings
				state.savings -= action.payload;
				state.balance += action.payload;
			}
		},
		// private action
		receiveLoan: (state, action: PayloadAction<number>) => {
			state.loans += action.payload;
			state.balance += action.payload;
		},
		payLoan: (state, action: PayloadAction<number>) => {
			if (action.payload <= state.loans
				&& action.payload <= state.balance) {
				state.loans -= action.payload;
				state.balance -= action.payload;
			}
		},
		// private action
		setQueueStatus: (state, action: PayloadAction<QueueState>) => {
			state.queueStatus = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(withdrawFromSavingsA.pending, (state) => {
				state.queueStatus = 'loading';
			})
			.addCase(withdrawFromSavingsA.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.queueStatus = 'idle';
					if (action.payload <= state.savings) {
						// fund is available for withdrawal from savings
						state.savings -= action.payload;
						state.balance += action.payload;
					}
				})
			.addCase(withdrawFromSavingsA.rejected, (state) => {
				state.queueStatus = 'failed';
			})
			.addCase(receiveLoanA.pending, (state) => {
				state.queueStatus = 'loading';
			})
			.addCase(receiveLoanA.fulfilled,
				(state, action: PayloadAction<number>) => {
					state.queueStatus = 'idle';
					state.loans += action.payload;
					state.balance += action.payload;
				})
			.addCase(receiveLoanA.rejected, (state) => {
				state.queueStatus = 'failed';
			});
	}
});

// action creators
export const {
	deposit,
	withdraw,
	depositToSavings,
	payLoan
} = accountSlice.actions;

// selectors
export const selectBalance = (state: RootState) => state.account.balance;
export const selectSavings = (state: RootState) => state.account.savings;
export const selectLoans = (state: RootState) => state.account.loans;
export const selectQueueStatus = (state: RootState) => state.account.queueStatus;

// Thunk Action: Option B
// Supports both Async and Sync action
// Uses basic `dispatch` and `getState` method
// to communicate with reducers and states
export const withdrawFromSavingsB =
	(amount: number): AppThunk =>
		async (dispatch, getState) => {
			// demo usage of getState()
			const cLoans = selectLoans(getState());
			console.log(cLoans);
			dispatch(accountSlice.actions.setQueueStatus('loading'));
			try {
				const res = await fetchAmount(amount);
				dispatch(accountSlice.actions.withdrawFromSavings(res.amount));
				dispatch(accountSlice.actions.setQueueStatus('idle'));
			} catch (err) {
				dispatch(accountSlice.actions.setQueueStatus('failed'));
			}
		};
export const receiveLoanB =
	(amount: number): AppThunk =>
		async (dispatch) => {
			dispatch(accountSlice.actions.setQueueStatus('loading'));
			try {
				const res = await fetchAmount(amount);
				dispatch(accountSlice.actions.receiveLoan(res.amount));
				dispatch(accountSlice.actions.setQueueStatus('idle'));
			} catch (err) {
				dispatch(accountSlice.actions.setQueueStatus('failed'));
			}
		}

// reducer
export default accountSlice.reducer; // to be consumed by the store configuration
