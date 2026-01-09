import React, { ComponentType, Suspense } from "react";
import {
  Routes,
  Route,
  Outlet,
  BrowserRouter,
  BrowserRouterProps,
} from "react-router-dom";
import { buildRouteTree, RouteNode } from "./utils/build-route-tree";

interface FSRouterProps {
  routes: Record<string, () => Promise<unknown>>;
  notFoundComponent?: React.ReactNode;
  suspenseFallback?: React.ReactNode;
}

type ComponentTypePromise = () => Promise<{ default: React.ComponentType<any> }>

export function FSRouter({
  routes,
  notFoundComponent = <div>404 - Not Found</div>,
  suspenseFallback = <div>Loading...</div>,
}: FSRouterProps) {
  const routeTree = buildRouteTree(routes);

  function renderNode(node: RouteNode): JSX.Element {
    const Component = node.component ? React.lazy(node.component as ComponentTypePromise) : null;

    let element;
    if (node.isLayout && Component) {
      element = (
        <Suspense fallback={suspenseFallback}>
          {React.createElement(Component, null, <Outlet />)}
        </Suspense>
      );
    } else if (Component) {
      element = (
        <Suspense fallback={suspenseFallback}>
          <Component />
        </Suspense>
      );
    } else if (node.children.length > 0) {
      element = <Outlet />;
    } else {
      element = null; // Fallback for groups
    }

    return (
      <Route path={node.segment} element={element}>
        {node.children.map((child) => renderNode(child))}
      </Route>
    );
  }
  const rootComponent = routeTree.component
    ? React.lazy(routeTree.component as ComponentTypePromise)
    : null;

  return (
    <Routes>
      {rootComponent && (
        <Route
          path="/"
          element={
            <Suspense fallback={suspenseFallback}>
              {React.createElement(rootComponent)}
            </Suspense>
          }
        />
      )}
      {routeTree.children.map((child) => renderNode(child))}
      <Route path="*" element={notFoundComponent} />
    </Routes>
  );
}

interface FullFSRouterProps
  extends FSRouterProps, Omit<BrowserRouterProps, "children"> {
}

export function FullFSRouter({
  routes,
  notFoundComponent,
  suspenseFallback,
  ...browserProps
}: FullFSRouterProps) {
  return (
    <BrowserRouter {...browserProps}>
      <FSRouter
        routes={routes}
        notFoundComponent={notFoundComponent}
        suspenseFallback={suspenseFallback}
      />
    </BrowserRouter>
  );
}
