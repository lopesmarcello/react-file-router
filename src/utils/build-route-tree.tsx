export interface RouteNode {
  segment: string;
  component?: () => Promise<unknown>;
  isLayout?: boolean;
  isRoot: boolean;
  children: RouteNode[];
  indexComponent?: () => Promise<unknown>;
}

export function buildRouteTree(
  routes: Record<string, () => Promise<unknown>>,
): RouteNode {
  const root: RouteNode = { segment: "", children: [], isRoot: true };

  Object.entries(routes).forEach(([fileRoute, importFn]) => {
    let path = fileRoute.replace(/.*?\/pages\//, "").replace(/\.[jt]sx?$/, "");

    const segments = path.split("/").filter(Boolean);

    let currentNode = root;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];

      if (seg === "index") {
        currentNode.indexComponent = importFn;
        return;
      }
      if (seg === "_layout") {
        currentNode.component = importFn;
        currentNode.isLayout = true;
        return;
      }

      let cleanSeg = seg.replace(/\[(.*?)\]/g, ":$1"); // Handle [param] -> :param

      let child = currentNode.children.find((c) => c.segment === cleanSeg);
      if (!child) {
        child = {
          segment: cleanSeg,
          isRoot: false,
          children: [],
        };
        currentNode.children.push(child);
      }

      if (i === segments.length - 1) {
        child.component = importFn;
      }

      currentNode = child;
    }
  });

  return root;
}
