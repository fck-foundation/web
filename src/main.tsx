import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "contexts";
import App from "./App";

import "./assets/index.scss";
import "./patch-local-storage-for-github-pages";

const queryClient = new QueryClient();

window.global = window;

ReactDOM.hydrateRoot(
  document.getElementById("root") as any,
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <App />
    </AppProvider>
  </QueryClientProvider>
);
