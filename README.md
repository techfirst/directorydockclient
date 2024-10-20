# DirectoryDockClient

DirectoryDockClient is a powerful API client for seamless interaction with the DirectoryDock service. It provides an easy-to-use interface for managing and retrieving directory entries.

## Features

- Fetch paginated entries
- Retrieve specific entries by slug
- Filter entries based on custom criteria
- Get available filterable fields
- Built-in error handling for robust integration

## Installation

To install the directory-dock-client npm package, run:

```sh
npm install directory-dock-client
```

## Usage

```typescript
import DirectoryDockClient from "directory-dock-client";

const client = new DirectoryDockClient("your_directorydock_api_key_here");
```

### Fetching Entries

```typescript
const { entries, totalCount } = await client.getEntries(page, limit);
console.log(`Fetched ${entries.length} entries out of ${totalCount}`);
```

### Getting a Single Entry

```typescript
try {
  const entry = await client.getEntry("example-entry-slug");
  console.log("Entry:", entry);
} catch (error) {
  console.error("Entry not found:", error.message);
}
```

### Filtering Entries

```typescript
const filter = { Name: "Example Entry Name" };
const filteredEntries = await client.getEntriesByFilter(filter);
console.log("Filtered entries:", filteredEntries);
```

### Getting Filterable Fields

```typescript
const filterableFields = await client.getFilters();
console.log("Filterable fields:", filterableFields);
```

## Error Handling

The client includes built-in error handling for common issues:

- Invalid API key
- Entry not found
- Network errors

Always wrap your API calls in try-catch blocks to handle potential errors gracefully.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, features, or improvements.

## License

This project is licensed under the MIT License.

## Support

For additional assistance or information, please contact our support team or open an issue on our GitHub repository.

Streamline your directory management with DirectoryDockClient. Get started today!
