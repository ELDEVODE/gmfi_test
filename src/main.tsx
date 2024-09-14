import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "./networkConfig.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./routes/root.tsx";
import "./index.css";
import ErrorPage from "./error-page.tsx";
import { SinglePlayer } from "./routes/SinglePlayer.tsx";
import { MultiplayerStakes } from "./routes/MultiplayerStakes.tsx";
import { MultiplayerPoints } from "./routes/MultiplayerPoints.tsx";
import App from "./App.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <Home />, errorElement: <ErrorPage /> },
  { path: "/single-player", element: <SinglePlayer /> },
  { path: "/multiplayer-points", element: <MultiplayerPoints /> },
  { path: "/multiplayer-stakes", element: <MultiplayerStakes /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
        <WalletProvider autoConnect>
          <RouterProvider router={router} />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
