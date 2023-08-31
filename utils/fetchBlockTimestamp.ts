// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchBlockTimestamp(provider: any, blockNumber: number) {
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}
