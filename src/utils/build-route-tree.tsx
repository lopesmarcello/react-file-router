export interface RouteNode {
  segment: string;
  component?: () => Promise<{ default: React.ComponentType }>;
  isLayout?: boolean;
  children: RouteNode[];
}

export function buildRouteTree(
  routes: Record<string, () => Promise<{ default: React.ComponentType }>>,
): RouteNode {
  const root: RouteNode = { segment: "", children: [] };

  Object.entries(routes).forEach(([fileRoute, importFn]) => {
    let path = fileRoute.replace(/.*?\/pages\//, "").replace(/\.[jt]sx?$/, ""); // Strip prefix and extension

    const segments = path.split("/").filter(Boolean); // Split into array, remove empty

    let currentNode = root;
    segments.forEach((seg: string, index: number) => {
      if (seg === "index" && segments.length === 1) {
        currentNode.component = importFn;
        return;
      }
      let cleanSeg = seg.replace(/\[(.*?)\]/g, ":$1"); // Handle [param] -> :param

      // Find or create child node for this segment
      let childIndex = currentNode.children.findIndex((c) => c.segment === cleanSeg);
      if (childIndex === -1) {
        currentNode.children.push({ segment: cleanSeg, children: [] });
        childIndex = currentNode.children.length - 1;
      }
      let child = currentNode.children[childIndex];

      // If last segment, assign component
      if (index === segments.length - 1) {
        if (seg === "_layout") {
          child.isLayout = true;
          child.component = importFn;
          // Don't add as a separate route path
        } else {
          child.component = importFn;
        }
      }

      currentNode = child;
    });
  });

  return root;
}
