# fs-router-dom

Lightweight file-based router for Vite + React Router DOM, like Next.js.

## Installation
```
npm install fs-router-dom
```

## Usage

### `<FSRouter />`

The `FSRouter` component dynamically creates `react-router-dom` routes from a list of file-based modules. It requires being a child of a `BrowserRouter` (or another `react-router` router).

```jsx
// App.tsx
import { BrowserRouter } from 'react-router-dom';
import { FSRouter } from 'fs-router-dom';

const routes = import.meta.glob('./pages/**/*.tsx');

function App() {
  return (
    <BrowserRouter basename="/app">
      <FSRouter routes={routes} />
    </BrowserRouter>
  );
}

export default App;
```

### `<FullFSRouter />`

The `FullFSRouter` component is a "batteries-included" component for users who want to quickly set up file-based routing without configuring `react-router-dom`'s `BrowserRouter` separately. It instantiates a `BrowserRouter` and places the `FSRouter` inside it, handling the setup in one step.

`FullFSRouter` accepts two types of props:
- `routes`: The same `routes` object required by `FSRouter`.
- All props accepted by `react-router-dom`'s `BrowserRouter` (e.g., `basename`, `window`).

```jsx
// App.tsx
import { FullFSRouter } from 'fs-router-dom';

const routes = import.meta.glob('./pages/**/*.tsx');

function App() {
  return <FullFSRouter routes={routes} basename="/app" />;
}

export default App;
```
