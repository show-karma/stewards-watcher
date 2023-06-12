export async function fetchBlockTimestamp(provider: any, blockNumber: number) {
  const block = await provider.getBlock(blockNumber);
  return block.timestamp;
}
