import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on a VPS via Docker — emit a minimal server bundle in .next/standalone.
  output: "standalone",

  // The Prisma query engine is a native binary, so the file tracer can miss it.
  // The client is generated into src/generated/prisma (see prisma/schema.prisma).
  outputFileTracingIncludes: {
    "/**": ["./src/generated/prisma/**"],
  },
};

export default nextConfig;
