import { DirectoryDockClient } from "../src/DirectoryDockClient";
import { EntryData } from "../src/types/EntryData";

const VALID_API_KEY = "dd_c4dcc0da-c363-4d22-9d91-2e0bab854c8a";

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

  it("should fetch categories successfully", async () => {
    const categories = await client.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);

    categories.forEach((category) => {
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("slug");
    });
  });

  it("should fetch submit fields successfully", async () => {
    const submitFields = await client.getSubmitFields();

    expect(Array.isArray(submitFields)).toBe(true);
    expect(submitFields.length).toBeGreaterThan(0);

    submitFields.forEach((field) => {
      expect(field).toHaveProperty("FieldName");
      expect(field).toHaveProperty("FieldLabel");
      expect(field).toHaveProperty("FieldType");
    });
  });
});
