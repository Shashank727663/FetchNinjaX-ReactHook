````markdown
# fetchninjax

A simple and smart React hook for data fetching using the native `fetch` API.  
Say goodbye to Axios and heavy dependencies — fetchninjax is lightweight, easy to use, and gets the job done.

---

## Features

- Lightweight and dependency-free
- Supports GET and customizable HTTP methods via fetch options
- Handles loading, error, and data states
- Supports automatic fetching on mount and manual re-fetching
- Clean and minimal API

---

## Installation

```bash
npm install fetchninjax
````

or

```bash
yarn add fetchninjax
```

---

## Usage

```jsx
import useFetch from 'fetchninjax';

function App() {
  const { data, loading, error, refetch } = useFetch('https://api.example.com/items');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

---

## POST / Other HTTP methods

You can customize your request by passing the second `options` argument like this:

```jsx
const { data, loading, error, refetch } = useFetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'fetchninjax' }),
});
```

Note: For POST and other non-GET requests, consider calling `refetch` manually to avoid automatic calls on component mount.

---

## API

### `useFetch(url, options)`

* `url` (string): The URL to fetch data from.
* `options` (object, optional): Native fetch options to customize the request (method, headers, body, etc).

Returns an object with:

* `data`: The response data (parsed JSON).
* `loading`: Boolean indicating loading state.
* `error`: Error object if the request failed.
* `refetch`: Function to manually re-trigger the fetch.

---



Made with 🥷 by fetchninjax


