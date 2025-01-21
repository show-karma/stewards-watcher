export interface IDelegation {
  delegatee: string;
  network?: number;
  chosenContract?: `0x${string}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccessFunction?: () => any;
}
