// A mock function to mimic making an async request for data
export function fetchAmount(amount = 1) {
  return new Promise<{ amount: number }>((resolve) =>
    setTimeout(() => resolve({ amount }), 1000)
  );
}
