import React, { useState } from 'react';

import { useSelector, useDispatch } from '../../redux/hooks';
import {
  deposit,
  withdraw,
  depositToSavings,
  withdrawFromSavingsA,
  receiveLoanB,
  payLoan,
  selectBalance,
  selectSavings,
  selectLoans,
  selectQueueStatus
} from '../../redux/slices/accountSlice';
import styles from './Account.module.css';

export function Account() {
  const balance = useSelector(selectBalance);
  const savings = useSelector(selectSavings);
  const loans = useSelector(selectLoans);
  const queueStatus = useSelector(selectQueueStatus);
  const dispatch = useDispatch();
  const [balanceOpAmount, setBalanceOpAmount] = useState('10000');
  const [savingsOpAmount, setSavingsOpAmount] = useState('1000');
  const [loansOpAmount, setLoansOpAmount] = useState('100');

  const balanceOpValue = Number(balanceOpAmount) || 0;
  const savingsOpValue = Number(savingsOpAmount) || 0;
  const loansOpValue = Number(loansOpAmount) || 0;

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.statContainer}>
          <p className={styles.balanceLabel}>Balance</p>
          <span className={styles.balance}>{balance}</span>
        </div>
        <div className={styles.statContainer}>
          <p className={styles.savingsLabel}>Savings</p>
          <span className={styles.savings}>{savings}</span>
        </div>
        <div className={styles.statContainer}>
          <p className={styles.loansLabel}>Loans</p>
          <span className={styles.loans}>{loans}</span>
        </div>
      </div>
      <div className={styles.row}>
        <span className={styles.asyncStatus}>Async Status: {queueStatus}</span>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set balance operation amount"
          value={balanceOpAmount}
          onChange={(e) => setBalanceOpAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(deposit(balanceOpValue))}
        >
          Deposit
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(withdraw(balanceOpValue))}
        >
          Withdraw
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set savings operation amount"
          value={savingsOpAmount}
          onChange={(e) => setSavingsOpAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(depositToSavings(savingsOpValue))}
        >
          Deposit to Savings
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(withdrawFromSavingsA(savingsOpValue))}
        >
          Withdraw from Savings
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set loans operation amount"
          value={loansOpAmount}
          onChange={(e) => setLoansOpAmount(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(payLoan(loansOpValue))}
        >
          Pay Loan
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(receiveLoanB(loansOpValue))}
        >
          Receive Loan
        </button>
      </div>
    </div>
  );
}
