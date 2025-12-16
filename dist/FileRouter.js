"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRouter = FileRouter;
exports.FullFileRouter = FullFileRouter;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
function FileRouter({ routes }) {
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [Object.entries(routes).map(([filePath, importFn]) => {
                let path = filePath
                    .replace(/.*\/pages\//, '/') // Remove everything up to and including /pages/
                    .replace(/\.[jt]sx?$/, '') // Remove .js, .jsx, .ts, .tsx extension
                    .replace(/\/index$/, '') || '/' // Handle index as '' -> '/', or /foo/index -> /foo
                    .replace(/\[(.*?)\]/g, ':$1'); // Convert [param] to :param
                const Component = react_1.default.lazy(async () => {
                    const module = await importFn();
                    return { default: module.default };
                });
                return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: path, element: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)("div", { children: "Loading..." }), children: (0, jsx_runtime_1.jsx)(Component, {}) }) }, path));
            }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "*", element: (0, jsx_runtime_1.jsx)("div", { children: "404 - Not Found" }) })] }));
}
function FullFileRouter({ routes, ...browserProps }) {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { ...browserProps, children: (0, jsx_runtime_1.jsx)(FileRouter, { routes: routes }) }));
}
//# sourceMappingURL=FileRouter.js.map