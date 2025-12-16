import { BrowserRouterProps } from 'react-router-dom';
interface FileRouterProps {
    routes: Record<string, () => Promise<unknown>>;
}
export declare function FileRouter({ routes }: FileRouterProps): import("react/jsx-runtime").JSX.Element;
interface FullFileRouterProps extends FileRouterProps, Omit<BrowserRouterProps, 'children'> {
}
export declare function FullFileRouter({ routes, ...browserProps }: FullFileRouterProps): import("react/jsx-runtime").JSX.Element;
export {};
