import React, { Suspense, ComponentType } from "react";
import {
  Routes,
  Route,
  Outlet,
  BrowserRouter,
  BrowserRouterProps,
} from "react-router-dom";
import { buildRouteTree, RouteNode } from "./utils/build-route-tree";

interface FSRouterProps {
  routes: Record<string, () => Promise<{ default: ComponentType }>>;
}

export function FSRouter({ routes }: FSRouterProps) {
  const routeTree = buildRouteTree(routes);

  function renderNode(node: RouteNode): JSX.Element {
    const Component = node.component ? React.lazy(node.component) : null;

    const element =
      node.isLayout && Component ? (
        <Suspense fallback={<div>Loading...</div>}>
          {React.createElement(Component, null, <Outlet />)}
        </Suspense>
      ) : Component ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Component />
        </Suspense>
      ) : node.children.length > 0 ? (
        <Outlet />
      ) : null; // Fallback for groups

    return (
      <Route path={node.segment} element={element}>
        {node.children.map((child) => renderNode(child))}
      </Route>
    );
  }
  const rootComponent = routeTree.component
    ? React.lazy(routeTree.component)
    : null;

  return (
    <Routes>
      {rootComponent && (
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              {React.createElement(rootComponent)}
            </Suspense>
          }
        />
      )}
      {routeTree.children.map((child) => renderNode(child))}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
}

interface FullFSRouterProps
  extends FSRouterProps, Omit<BrowserRouterProps, "children"> {}

export function FullFSRouter({ routes, ...browserProps }: FullFSRouterProps) {
  return (
    <BrowserRouter {...browserProps}>
      <FSRouter routes={routes} />
    </BrowserRouter>
  );
}
