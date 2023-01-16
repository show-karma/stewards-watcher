export interface IDelegation {
  delegatee: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccessFunction?: () => any;
}
