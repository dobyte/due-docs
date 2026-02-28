import type { NextConfig } from "next";
import { BASE_PATH } from "./config/site";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  images: { unoptimized: true },
};

export default nextConfig;
