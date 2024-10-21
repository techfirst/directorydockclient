# DirectoryDock API Client library

DirectoryDockClient is a powerful API client for seamless interaction with the DirectoryDock service. It provides an easy-to-use interface for managing and retrieving directory entries.

## Features

- Fetch paginated entries
- Retrieve specific entries by slug
- Filter entries based on custom criteria
- Get available filterable fields
- Built-in error handling for robust integration
- Strong TypeScript support with detailed type definitions

## Installation

To install the directorydockclient npm package, run:

```sh

npm install directorydockclient

```

## Usage

### TypeScript

```typescript
import DirectoryDockClient from "directorydockclient";
import { TransformedEntry, FilterableField } from "directorydockclient";

const client = new DirectoryDockClient("your_directorydock_api_key_here");

// Fetching Entries
async function fetchEntries() {
  const {
    entries,
    totalEntries,
  }: { entries: TransformedEntry[]; totalEntries: number } =
    await client.getEntries(1, 10);

  console.log(`Fetched ${entries.length} entries out of ${totalEntries}`);
}

// Getting a Single Entry
async function getSingleEntry() {
  try {
    const entry: TransformedEntry = await client.getEntry("example-entry-slug");

    console.log("Entry:", entry);
  } catch (error) {
    console.error("Entry not found:", error.message);
  }
}

// Filtering Entries
async function filterEntries() {
  const filter = { Name: "Example Entry Name" };

  const filteredEntries: TransformedEntry[] = await client.getEntriesByFilter(
    filter
  );

  console.log("Filtered entries:", filteredEntries);
}

// Getting Filterable Fields
async function getFilterableFields() {
  const filterableFields: FilterableField[] = await client.getFilters();

  console.log("Filterable fields:", filterableFields);
}

// Getting Filters
async function getFilters() {
  const filters: Filter[] = await client.getFilters();
  console.log("Available filters:", filters);
}
```

### JavaScript

```javascript
const DirectoryDockClient = require("directorydockclient").default;
const client = new DirectoryDockClient("your_directorydock_api_key_here");

// Fetching Entries
async function fetchEntries() {
  const { entries, totalEntries } = await client.getEntries(1, 10);

  console.log(`Fetched ${entries.length} entries out of ${totalEntries}`);
}

// Getting a Single Entry
async function getSingleEntry() {
  try {
    const entry = await client.getEntry("example-entry-slug");

    console.log("Entry:", entry);
  } catch (error) {
    console.error("Entry not found:", error.message);
  }
}

// Filtering Entries
async function filterEntries() {
  const filter = { Name: "Example Entry Name" };

  const filteredEntries = await client.getEntriesByFilter(filter);

  console.log("Filtered entries:", filteredEntries);
}

// Getting Filterable Fields
async function getFilterableFields() {
  const filterableFields = await client.getFilters();

  console.log("Filterable fields:", filterableFields);
}

// Getting Filters
async function getFilters() {
  const filters: Filter[] = await client.getFilters();
  console.log("Available filters:", filters);
}
```

## Type Definitions

The library includes several TypeScript interfaces and types to provide strong typing support:

- `EntryData`: Represents the structure of each field in an entry.
- `BaseEntry`: Defines the basic structure of an entry.
- `TransformedEntry`: An enhanced version of BaseEntry with direct access to entry properties.
- `GetEntriesResponse`: The structure of the response when fetching entries.
- `FilterableField`: Represents a field that can be used for filtering.
- `BaseData`: The structure of the raw data returned by the API.

These types are exported and can be imported from the library for use in your TypeScript projects.

## Project Structure

The project uses a modular structure with separate files for each type definition:

```

src/
├── DirectoryDockClient.ts
└── types/
    ├── BaseData.ts
    ├── BaseEntry.ts
    ├── EntryData.ts
    ├── FilterableField.ts
    ├── GetEntriesResponse.ts
    └── TransformedEntry.ts

```

This structure makes it easier to maintain and extend the library.

## Error Handling

The client includes built-in error handling for common issues:

- Invalid API key
- Entry not found
- Network errors

Always wrap your API calls in try-catch blocks to handle potential errors gracefully.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, features, or improvements. When contributing, please maintain the current file structure, with separate files for each type definition in the `src/types` directory.

## License

This project is licensed under the MIT License.

## Support

For additional assistance or information, please open an issue on the GitHub repository or reach out directly on X (formerly Twitter) [@Stellan79](https://x.com/Stellan79).

Streamline your directory management with DirectoryDockClient. Get started today!
