const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

interface Entry {
  id: string;
  directoryId: string;
  schemaId: string;
  data: {
    [key: string]: {
      type: string;
      value: string | boolean;
      required: boolean;
      filterable: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BaseData {
  entries: Entry[];
}

interface GetEntriesResponse {
  totalEntries: number;
  entries: Entry[];
}

interface FilterableField {
  name: string;
  type: string;
}

class DirectoryDockClient {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, options: { baseURL?: string } = {}) {
    this.apiKey = apiKey;
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
        throw new Error("Invalid API key");
      }
      throw new Error("Network response was not ok");
    }
    return await response.json();
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
    return {
      totalEntries: baseData.entries.length,
      entries: baseData.entries,
    };
  }

  public async getEntry(slug: string): Promise<Entry> {
    const params = { slug };
    const baseData: BaseData = await this.fetchFromAPI(
      "system/base.json",
      params
    );
    const entry = baseData.entries.find((e) => e.data.Slug.value === slug);
    if (!entry) {
      throw new Error("Entry with the specified slug not found");
    }
    return entry;
  }

  public async getEntriesByFilter(
    filters: Record<string, any>
  ): Promise<Entry[]> {
    const baseData: BaseData = await this.fetchFromAPI("system/base.json");
    return baseData.entries.filter((entry) => {
      return Object.keys(filters).every((filterKey) => {
        const field = entry.data[filterKey];
        return field && field.value === filters[filterKey];
      });
    });
  }

  public async getFilters(): Promise<FilterableField[]> {
    const baseData: BaseData = await this.fetchFromAPI("system/base.json");

    const filterableFields: FilterableField[] = [];

    for (const entry of baseData.entries) {
      for (const [fieldName, fieldData] of Object.entries(entry.data)) {
        if (
          fieldData.filterable &&
          !filterableFields.some((f) => f.name === fieldName)
        ) {
          filterableFields.push({
            name: fieldName,
            type: fieldData.type,
          });
        }
      }
    }

    return filterableFields;
  }
}

export default DirectoryDockClient;

// Usage example
// const client = new DirectoryDockClient('your-api-key');
// client.getEntries().then(entries => console.log(entries));

// Usage example for getEntries method
// const client = new DirectoryDockClient('your-api-key');
// client.getEntries(1, 10).then(entries => console.log(entries)).catch(error => console.error('Error fetching entries:', error));

// Usage example for getEntry method
// client.getEntry('example-entry-slug').then(entry => console.log(entry)).catch(error => console.error('Error fetching entry:', error));

// Usage example for getEntriesByFilter method
// client.getEntriesByFilter({ Name: 'Stellan är bäst och det var allt' }).then(entries => console.log(entries)).catch(error => console.error('Error fetching filtered entries:', error));

// Usage example for getFilters method
// const client = new DirectoryDockClient('your-api-key');
// client.getFilters().then(filters => console.log(filters)).catch(error => console.error('Error fetching filters:', error));
