const dotenv = require("dotenv");

import { BaseEntry } from "./types/BaseEntry";

import { TransformedEntry } from "./types/TransformedEntry";

import { GetEntriesResponse } from "./types/GetEntriesResponse";

import { BaseData } from "./types/BaseData";

import { Filter } from "./types/Filter";

import { Category } from "./types/Category";

dotenv.config();

export class DirectoryDockClient {
  private baseURL: string;

  constructor(
    apiKey: string,

    options: { baseURL?: string } = {}
  ) {
    this.baseURL =
      options.baseURL ||
      `https://directorydock.blob.core.windows.net/files/${apiKey}`;
  }

  private async fetchFromAPI(
    endpoint: string,

    params: Record<string, any> = {}
  ): Promise<any> {
    const url = new URL(`${this.baseURL}/${endpoint}`);

    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const response = await fetch(url.toString());

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Invalid API key or file not found");
      }

      throw new Error("Network response was not ok");
    }

    return await response.json();
  }

  private transformEntry(entry: BaseEntry): TransformedEntry {
    const transformedEntry = { ...entry } as TransformedEntry;

    Object.keys(entry.data || {}).forEach((key) => {
      Object.defineProperty(transformedEntry, key, {
        get: function () {
          return this.data?.[key];
        },

        enumerable: true,
      });
    });

    return transformedEntry;
  }

  public async getEntries(
    page: number = 1,

    limit: number = 10
  ): Promise<GetEntriesResponse> {
    const params = { page, limit };

    const baseData: BaseData = await this.fetchFromAPI(
      "system/base.json",

      params
    );

    const transformedEntries = baseData.entries.map((entry) =>
      this.transformEntry(entry)
    );

    return {
      totalEntries: transformedEntries.length,

      entries: transformedEntries,
    };
  }

  public async getEntry(slug: string): Promise<TransformedEntry> {
    const params = { slug };

    const baseData: BaseData = await this.fetchFromAPI(
      "system/base.json",

      params
    );

    const entry = baseData.entries.find((e) => e.data?.Slug?.value === slug);

    if (!entry) {
      throw new Error("Entry with the specified slug not found");
    }

    return this.transformEntry(entry);
  }

  public async getEntriesByFilter(
    filters: Record<string, any>
  ): Promise<TransformedEntry[]> {
    const baseData: BaseData = await this.fetchFromAPI("system/base.json");

    const filteredEntries = baseData.entries.filter((entry) => {
      return Object.keys(filters).every((filterKey) => {
        const field = entry.data?.[filterKey];

        return field?.value === filters[filterKey];
      });
    });

    return filteredEntries.map((entry) => this.transformEntry(entry));
  }

  public async getFilters(): Promise<Filter[]> {
    const filters: Filter[] = await this.fetchFromAPI("system/filters.json");

    return filters;
  }

  public async getCategories(): Promise<Category[]> {
    const response = await this.fetchFromAPI("system/categories.json");

    return response.categories;
  }
}
