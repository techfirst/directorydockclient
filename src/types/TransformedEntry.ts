import { BaseEntry } from "./BaseEntry";
import { EntryData } from "./EntryData";

type EntryDataKeys<T> = {
  [K in keyof T]: T[K] extends EntryData ? K : never;
}[keyof T];

export type TransformedEntry = {
  [K in keyof BaseEntry]: K extends "data"
    ? { [P in EntryDataKeys<BaseEntry["data"]>]: EntryData }
    : BaseEntry[K];
} & {
  [K in EntryDataKeys<BaseEntry["data"]>]: EntryData;
};
