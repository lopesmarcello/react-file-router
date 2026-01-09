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

type ComponentTypePromise = () => Promise<{ default: React.ComponentType<any> }>;

export function FSRouter({
  routes,
  notFoundComponent = <div>404 - Not Found</div>,
  suspenseFallback = <div>Loading...</div>,
}: FSRouterProps) {
  const routeTree = buildRouteTree(routes);

  function renderNode(node: RouteNode): JSX.Element {
    const LayoutComponent =
      node.isLayout && node.component
        ? React.lazy(node.component as ComponentTypePromise)
        : null;
    const PageComponent =
      !node.isLayout && node.component
        ? React.lazy(node.component as ComponentTypePromise)
        : null;
    const IndexComponent = node.indexComponent
      ? React.lazy(node.indexComponent as ComponentTypePromise)
      : null;

    const element = LayoutComponent ? (
      <Suspense fallback={suspenseFallback}>
        {React.createElement(LayoutComponent, null, <Outlet />)}
      </Suspense>
    ) : PageComponent ? (
      <Suspense fallback={suspenseFallback}>
        <PageComponent />
      </Suspense>
    ) : (
      <Outlet />
    );

    return (
      <Route path={node.segment} element={element}>
        {IndexComponent && (
          <Route
            index
            element={
              <Suspense fallback={suspenseFallback}>
                <IndexComponent />
              </Suspense>
            }
          />
        )}
        {node.children.map((child) => renderNode(child))}
      </Route>
    );
  }

  const RootLayout =
    routeTree.isLayout && routeTree.component
      ? React.lazy(routeTree.component as ComponentTypePromise)
      : null;
  const RootIndex = routeTree.indexComponent
    ? React.lazy(routeTree.indexComponent as ComponentTypePromise)
    : null;

  const rootElement = RootLayout ? (
    <Suspense fallback={suspenseFallback}>
      {React.createElement(RootLayout, null, <Outlet />)}
    </Suspense>
  ) : (
    <Outlet />
  );

  return (
    <Routes>
      <Route path="/" element={rootElement}>
        {RootIndex && (
          <Route
            index
            element={
              <Suspense fallback={suspenseFallback}>
                <RootIndex />
              </Suspense>
            }
          />
        )}
        {routeTree.children.map((child) => renderNode(child))}
      </Route>
      <Route path="*" element={notFoundComponent} />
    </Routes>
  );
}

interface FullFSRouterProps
  extends FSRouterProps,
    Omit<BrowserRouterProps, "children"> {}

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
