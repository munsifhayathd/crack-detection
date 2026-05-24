import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Monorepo: include workspace-root dependencies in Vercel output tracing.
  outputFileTracingRoot: path.join(__dirname, ".."),

  // Keep browser-only / native packages out of the server bundle to avoid
  // duplicate module resolution and SSR import failures on Vercel.
  serverExternalPackages: ["mapbox-gl"],

  // Subpath ESM packages (e.g. @base-ui/react/checkbox) must be transpiled.
  transpilePackages: ["@base-ui/react"],

  experimental: {
    // Reduce barrel-import fan-out that can trigger duplicate module graphs.
    optimizePackageImports: [
      "@base-ui/react",
      "date-fns",
      "lucide-react",
      "recharts",
    ],
  },
};

export default nextConfig;
