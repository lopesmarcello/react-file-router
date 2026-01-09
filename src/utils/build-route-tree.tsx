export interface RouteNode {
  segment: string;
  component?: () => Promise<{ default: unknown }>;
  isLayout?: boolean;
  isRoot: boolean;
  children: RouteNode[];
}

export function buildRouteTree(
  routes: Record<string, () => Promise<{ default: unknown }>>,
): RouteNode {
  const root: RouteNode = { segment: "", children: [], isRoot: true };

  Object.entries(routes).forEach(([fileRoute, importFn]) => {
    let path = fileRoute.replace(/.*?\/pages\//, "").replace(/\.[jt]sx?$/, ""); // Strip prefix and extension

    const segments = path.split("/").filter(Boolean); // Split into array, remove empty

    let currentNode = root;
    segments.forEach((seg: string, index: number) => {
      if (seg === "index" && segments.length === 1) {
        currentNode.segment = "";
        currentNode.component = importFn;
        return;
      }
      let cleanSeg = seg.replace(/\[(.*?)\]/g, ":$1"); // Handle [param] -> :param

      // Find or create child node for this segment
      let child = currentNode.children.find((c) => c.segment === cleanSeg);
      if (!child) {
        child = {
          segment: cleanSeg,
          isRoot: false,
          children: [],
        };
        currentNode.children.push(child);
      }

      // If last segment, assign component
      if (index === segments.length - 1) {
        if (seg === "_layout") {
          child.isLayout = true;
        }
        child.component = importFn;
      }

      currentNode = child;
    });
  });

  return root;
}
