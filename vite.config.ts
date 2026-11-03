import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sharedApi } from "./server/dev";

export default defineConfig({
  plugins: [react(), tailwindcss(), sharedApi()],
  build: { target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"] },
  server: { host: "127.0.0.1", port: 5173, open: false },
});
