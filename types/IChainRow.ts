export interface IChainRow {
  voteMethod: string;
  proposal: string;
  solution?: string | null;
  choice: string | number;
  executed: string;
  reason?: string | null;
  voteId?: string | null;
  finished?: boolean | null;
  trackId?: number | null;
}
