export interface IDelegation {
  delegatee: string;
  network?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccessFunction?: () => any;
}
