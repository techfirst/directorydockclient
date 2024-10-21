import DirectoryDockClient from "../src/DirectoryDockClient";

import { EntryData } from "../src/types/EntryData";

import { BaseData } from "../src/types/BaseData";

// Mock fetch

global.fetch = jest.fn();

// Global API key

const VALID_API_KEY = "dd_4c15f0f4-6653-49b7-8960-3f9428db7fbe";

describe("DirectoryDockClient", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("should fetch entries successfully", async () => {
    const client = new DirectoryDockClient(VALID_API_KEY);

    const entries = await client.getEntries(1, 5);

    expect(entries.entries.length).toBeLessThanOrEqual(5);
  });

  it("should throw error if entry is not found by slug", async () => {
    const client = new DirectoryDockClient(VALID_API_KEY);

    await expect(client.getEntry("non-existent-slug")).rejects.toThrow(
      "Entry with the specified slug not found"
    );
  });

  it("should find entry in base by slug", async () => {
    const client = new DirectoryDockClient(VALID_API_KEY);

    const knownValidSlug = "stellan-ar-bast-och-det-var-allt";

    const entry = await client.getEntry(knownValidSlug);

    expect(entry).toBeDefined();
  });

  it("should throw error when using an incorrect API key", async () => {
    const client = new DirectoryDockClient("invalid_api_key");

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,

      status: 404,
    });

    await expect(client.getEntries(1, 5)).rejects.toThrow("Invalid API key");
  });

  it("should filter entries correctly", async () => {
    const client = new DirectoryDockClient(VALID_API_KEY);

    const mockEntries = [
      {
        data: {
          Name: {
            value: "Stellan är bäst och det var allt",

            filterable: true,

            type: "text",

            required: false,
          },
        },
      },

      {
        data: {
          Name: {
            value: "Another entry",

            filterable: true,

            type: "text",

            required: false,
          },
        },
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,

      json: () => Promise.resolve({ entries: mockEntries }),
    });

    const filter = { Name: "Stellan är bäst och det var allt" };

    const filteredEntries = await client.getEntriesByFilter(filter);

    expect(filteredEntries.length).toBeGreaterThan(0);

    filteredEntries.forEach((entry) => {
      expect((entry.Name as EntryData).value).toBe(filter.Name);
    });
  });

  it("should return filterable fields", async () => {
    const client = new DirectoryDockClient(VALID_API_KEY);

    const filters = await client.getFilters();

    expect(Array.isArray(filters)).toBe(true);

    expect(filters.length).toBe(0);
  });

  it("should return an empty array when there are no entries", async () => {
    const client = new DirectoryDockClient(VALID_API_KEY);

    // Mock the fetchFromAPI method to return an empty entries array

    jest

      .spyOn(client as any, "fetchFromAPI")

      .mockResolvedValue({ entries: [] });

    const filters = await client.getFilters();

    expect(Array.isArray(filters)).toBe(true);

    expect(filters.length).toBe(0);
  });

  describe("getFilters", () => {
    it("should return an empty array when no filterable fields are present", async () => {
      const client = new DirectoryDockClient(VALID_API_KEY);

      const filters = await client.getFilters();

      expect(Array.isArray(filters)).toBe(true);

      expect(filters.length).toBe(0);
    });

    it("should return filterable fields if they were present", async () => {
      const client = new DirectoryDockClient(VALID_API_KEY);

      // Mock the fetchFromAPI method to return data with a filterable field

      jest.spyOn(client as any, "fetchFromAPI").mockResolvedValueOnce({
        entries: [
          {
            data: {
              Description: { type: "text", filterable: true },

              Name: { type: "text", filterable: false },
            },
          },
        ],
      });

      const filters = await client.getFilters();

      expect(Array.isArray(filters)).toBe(true);

      expect(filters.length).toBe(1);

      expect(filters[0]).toEqual({ name: "Description", type: "text" });
    });
  });

  it("should return correct filterable fields from actual API", async () => {
    const client = new DirectoryDockClient(VALID_API_KEY);

    const filters = await client.getFilters();

    expect(Array.isArray(filters)).toBe(true);

    expect(filters.length).toBe(0);
  });

  it("should allow direct access to entry properties", async () => {
    const client = new DirectoryDockClient(VALID_API_KEY);

    const mockEntries = [
      {
        id: "1",

        directoryId: "dir1",

        schemaId: "schema1",

        data: {
          Name: {
            value: "DirectoryDock rocks",

            type: "text",

            filterable: true,

            required: false,
          },

          Description: {
            value: "Description of DirectoryDock",

            type: "text",

            filterable: false,

            required: false,
          },
        },

        createdAt: "2023-01-01",

        updatedAt: "2023-01-01",

        __v: 0,
      },
    ];

    // Mock the fetchFromAPI method

    jest

      .spyOn(client as any, "fetchFromAPI")

      .mockResolvedValueOnce({ entries: mockEntries });

    const entries = await client.getEntries();

    const entry = entries.entries[0];

    expect(entry.Name.value).toBe("DirectoryDock rocks");

    expect(entry.Name.type).toBe("text");

    expect(entry.Description.value).toBe("Description of DirectoryDock");

    expect(entry.Description.type).toBe("text");
  });
});
