# DirectoryDockClient

DirectoryDockClient is an API client for interacting with the DirectoryDock service.

## Installation

```sh
npm install directory-dock-client
```

## Usage
```sh
import DirectoryDockClient from 'directory-dock-client';

const client = new DirectoryDockClient('your-api-key');

// Fetch entries
client.getEntries(1, 10).then(entries => console.log(entries));

// Fetch specific entry by slug
client.getEntry('example-entry-slug').then(entry => console.log(entry));

// Filter entries
client.getEntriesByFilter({ Name: 'Example Entry Name' }).then(entries => console.log(entries));
```