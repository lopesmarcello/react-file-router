# react-file-router

Lightweight file-based router for Vite + React Router DOM, like Next.js.

## Installation
npm install react-file-router

## Usage

### `<FileRouter />`

The `FileRouter` component dynamically creates `react-router-dom` routes from a list of file-based modules. It requires being a child of a `BrowserRouter` (or another `react-router` router).

```jsx
// App.tsx
import { BrowserRouter } from 'react-router-dom';
import { FileRouter } from 'react-file-router';

const routes = import.meta.glob('./pages/**/*.tsx');

function App() {
  return (
    <BrowserRouter basename="/app">
      <FileRouter routes={routes} />
    </BrowserRouter>
  );
}

export default App;
```

### `<FullFileRouter />`

The `FullFileRouter` component is a "batteries-included" component for users who want to quickly set up file-based routing without configuring `react-router-dom`'s `BrowserRouter` separately. It instantiates a `BrowserRouter` and places the `FileRouter` inside it, handling the setup in one step.

`FullFileRouter` accepts two types of props:
- `routes`: The same `routes` object required by `FileRouter`.
- All props accepted by `react-router-dom`'s `BrowserRouter` (e.g., `basename`, `window`).

```jsx
// App.tsx
import { FullFileRouter } from 'react-file-router';

const routes = import.meta.glob('./pages/**/*.tsx');

function App() {
  return <FullFileRouter routes={routes} basename="/app" />;
}

export default App;
```
