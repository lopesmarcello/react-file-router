import React, { Suspense } from 'react';
import { Routes, Route, BrowserRouter, BrowserRouterProps } from 'react-router-dom';

interface FileRouterProps {
  routes: Record<string, () => Promise<unknown>>;
}

export function FileRouter({ routes }: FileRouterProps) {
  return (
    <Routes>
      {Object.entries(routes).map(([filePath, importFn]) => {
        let path = filePath
          .replace(/.*\/pages\//, '/')  // Remove everything up to and including /pages/
          .replace(/\.[jt]sx?$/, '')  // Remove .js, .jsx, .ts, .tsx extension
          .replace(/\/index$/, '') || '/'  // Handle index as '' -> '/', or /foo/index -> /foo
            .replace(/\[(.*?)\]/g, ':$1');  // Convert [param] to :param

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

interface FullFileRouterProps extends FileRouterProps, Omit<BrowserRouterProps, 'children'> { }

export function FullFileRouter({ routes, ...browserProps }: FullFileRouterProps) {
  return (
    <BrowserRouter {...browserProps}>
      <FileRouter routes={routes} />
    </BrowserRouter>
  );
}
