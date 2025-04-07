import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "dev";
  const isProduction = mode === "prod";
  return {
    plugins: [
      reactPlugin(),
      ...(isProduction
        ? [
            viteStaticCopy({
              targets: [
                {
                  src: "src/assets/**/*",
                  dest: "src/assets/",
                },
              ],
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@/": new URL("./src/", import.meta.url).pathname,
      },
    },
    optimizeDeps: {
      include: [
        "@fullcalendar/core",
        "@fullcalendar/react",
        "@fullcalendar/resource-timegrid",
        "@fullcalendar/resource-daygrid",
      ],
    },
    envDir: "src/environments/",
    server: {
      host: true,
    },
    build: {
      target: "esnext",
      modulePreload: false,
      minify: isProduction,
      cssCodeSplit: false,
      sourcemap: isDevelopment,
      assetsDir: "assets",
    },
    define: {
      "import.meta.env": {
        ...process.env,
        MODE: mode,
        NODE_ENV: isDevelopment ? "development" : "production",
      },
    },
  };
});
