import { TransformedEntry } from "./TransformedEntry";

export interface GetEntriesResponse {
  totalEntries: number;
  entries: TransformedEntry[];
}
