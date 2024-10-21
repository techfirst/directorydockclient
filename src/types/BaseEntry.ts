import { EntryData } from "./EntryData";

export interface BaseEntry {
  id: string;
  directoryId: string;
  schemaId: string;
  data: {
    [key: string]: EntryData;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
