import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter, BrowserRouterProps } from 'react-router-dom';

interface FSRouterProps {
  routes: Record<string, () => Promise<unknown>>;
}

/**
 * Transforms a file path from the format './pages/users/[id].tsx'
 * to the format '/users/:id' for react-router-dom.
 * @param filePath The file path to transform.
 * @returns The transformed route path.
 */
function transformFilePathToRoutePath(filePath: string): string {
  // Remove everything up to and including /pages/
  let path = filePath.replace(/.*\/pages\//, '/');

  // Remove .js, .jsx, .ts, .tsx extension
  path = path.replace(/\.[jt]sx?$/, '');

  // Handle index routes
  if (path.endsWith('/index')) {
    path = path.slice(0, -6); // Remove /index
  }

  // Handle root route
  if (path === '') {
    path = '/';
  }

  // Convert [param] to :param for dynamic routes
  path = path.replace(/\[(.*?)\]/g, ':$1');

  return path;
}

export function FSRouter({ routes }: FSRouterProps) {
  return (
    <Routes>
      {Object.entries(routes).map(([filePath, importFn]) => {
        const path = transformFilePathToRoutePath(filePath);

        const Component = React.lazy(async () => {
          const module = await importFn();
          return { default: (module as { default: React.ComponentType<any> }).default };
        });
        return (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Component />
              </Suspense>
            }
          />
        );
      })}
      {/* Optional: Add a catch-all route for 404 */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
}

interface FullFSRouterProps extends FSRouterProps, Omit<BrowserRouterProps, 'children'> { }

export function FullFSRouter({ routes, ...browserProps }: FullFSRouterProps) {
  return (
    <BrowserRouter {...browserProps}>
      <FSRouter routes={routes} />
    </BrowserRouter>
  );
}
