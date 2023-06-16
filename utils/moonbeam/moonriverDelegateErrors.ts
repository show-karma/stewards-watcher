export const moonriverDelegateErrors: { [key: string]: string } = {
  /** The account is already delegating. */
  AlreadyDelegating: 'You have already delegated tokens for this track id.',
  /** Delegation to oneself makes no sense. */
  Nonsense: `You can not delegate to yourself.`,
  InsufficientFunds: `You don't have enough funds.`,
};
