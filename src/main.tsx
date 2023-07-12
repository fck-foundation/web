import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "contexts";
import App from "./App";

import "./assets/index.scss";
import "./patch-local-storage-for-github-pages";

const queryClient = new QueryClient();

window.global = window;

createRoot(document.getElementById("root") as any).render(
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <App />
    </AppProvider>
  </QueryClientProvider>
);
