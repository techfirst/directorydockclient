import { DirectoryDockClient } from "../src/DirectoryDockClient";
import { EntryData } from "../src/types/EntryData";

const VALID_API_KEY = "dd_4c15f0f4-6653-49b7-8960-3f9428db7fbe";

describe("DirectoryDockClient", () => {
  let client: DirectoryDockClient;

  beforeEach(() => {
    client = new DirectoryDockClient(VALID_API_KEY);
  });

  it("should fetch entries successfully", async () => {
    const entries = await client.getEntries(1, 5);

    expect(entries.entries.length).toBeLessThanOrEqual(5);

    expect(entries.totalEntries).toBeGreaterThan(0);
  });

  it("should throw error if entry is not found by slug", async () => {
    await expect(client.getEntry("non-existent-slug")).rejects.toThrow(
      "Entry with the specified slug not found"
    );
  });

  it("should find entry in base by slug", async () => {
    const knownValidSlug = "stellan-ar-bast-och-det-var-allt";

    const entry = await client.getEntry(knownValidSlug);

    expect(entry).toBeDefined();

    expect(entry.data.Slug.value).toBe(knownValidSlug);
  });

  it("should throw error when using an incorrect API key", async () => {
    const invalidClient = new DirectoryDockClient("invalid_api_key");

    await expect(invalidClient.getEntries(1, 5)).rejects.toThrow(
      "Invalid API key"
    );
  });

  it("should filter entries correctly", async () => {
    const filter = { Name: "Stellan är bäst och det var allt" };

    const filteredEntries = await client.getEntriesByFilter(filter);

    expect(filteredEntries.length).toBeGreaterThan(0);

    filteredEntries.forEach((entry) => {
      expect((entry.Name as EntryData).value).toBe(filter.Name);
    });
  });

  it("should fetch filters successfully", async () => {
    const filters = await client.getFilters();

    expect(Array.isArray(filters)).toBe(true);
    expect(filters.length).toBeGreaterThan(0);

    filters.forEach((filter) => {
      expect(filter).toHaveProperty("fieldName");
      expect(filter).toHaveProperty("fieldType");
      expect(filter).toHaveProperty("options");
    });
  });

  it("should allow direct access to entry properties", async () => {
    const entries = await client.getEntries(1, 1);

    const entry = entries.entries[0];

    expect(entry.Name).toBeDefined();

    expect(entry.Name.value).toBeDefined();

    expect(entry.Name.type).toBe("text");
  });
});
