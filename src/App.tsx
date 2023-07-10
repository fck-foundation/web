import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en, ru } from "locales";

import { AppContext } from "./contexts";
import {
  dark,
  light,
  sky,
  skyLight,
  arctic,
  arcticLight,
  azure,
  azureLight,
  iris,
  irisLight,
  flamingo,
  flamingoLight,
  coral,
  coralLight,
  marine,
  marineLight,
  ocean,
  oceanLight,
  fluid,
  fluidLight,
  galaxy,
  galaxyLight,
  cosmos,
  cosmosLight,
  andromeda,
  andromedaLight,
} from "./themes";
import { Layout } from "./components";
import {
  Home,
  Tokens,
  Pairs,
  OurTeam,
  RoadMap,
  Analytics,
  Export,
  Privacy,
  Cookie,
  Terms,
} from "./pages";
import NotFound from "./NotFound";

import "react-loading-skeleton/dist/skeleton.css";
import "keen-slider/keen-slider.min.css";
import "./assets/index.scss";
import { Suspense, useContext, useMemo } from "react";
import { Wallet } from "pages/Wallet";
import { WhitePaper } from "pages/WhitePaper";
import { Plitch } from "pages/Plitch";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
    },

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/tokens",
        element: <Tokens />,
      },
      {
        path: "/pairs",
        element: <Pairs />,
      },
      // {
      //   path: "events",
      //   element: <Events />,
      // },
      {
        path: "roadmap",
        element: <RoadMap />,
      },
      {
        path: "team",
        element: <OurTeam />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "analytics/price/:id",
        element: <Analytics />,
      },
      {
        path: "analytics/volume/:ID",
        element: <Analytics />,
      },
      {
        path: "wallet/:ID",
        element: <Wallet />,
      },
      {
        path: "/whitepaper",
        element: <WhitePaper />,
      },
      {
        path: "/plitch",
        element: <Plitch />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/cookie",
        element: <Cookie />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
    ],
  },
  {
    path: "/export/:id",
    element: <Export />,
  },
  {
    path: "*",
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  const { theme, enabled } = useContext(AppContext);
  const themeName = useMemo(
    () =>
      theme
        ? `${theme.color}${!enabled ? "Light" : ""}`
        : enabled
        ? "dark"
        : "light",
    [theme, enabled]
  );
  const values = useMemo(
    () => ({
      light,
      dark,
      sky,
      skyLight,
      arctic,
      arcticLight,
      azure,
      azureLight,
      iris,
      irisLight,
      flamingo,
      flamingoLight,
      coral,
      coralLight,
      marine,
      marineLight,
      ocean,
      oceanLight,
      fluid,
      fluidLight,
      galaxy,
      galaxyLight,
      cosmos,
      cosmosLight,
      andromeda,
      andromedaLight,
    }),
    []
  );

  return (
    <>
      <Helmet>
        <title>Find & Check</title>
        <meta
          name="description"
          content="An analytics chart platform tool, that allows users to create, view, and analyze data using various visualizations such as charts, graphs, and dashboards. These tools provide users with the ability to extract insights and make data-driven decisions by analyzing and understanding complex data sets."
        ></meta>
        <meta
          property="og:description"
          content="An analytics chart platform tool, that allows users to create, view, and analyze data using various visualizations such as charts, graphs, and dashboards. These tools provide users with the ability to extract insights and make data-driven decisions by analyzing and understanding complex data sets."
        ></meta>
        <meta property="og:title" content="Find & Check"></meta>
        <meta property="og:image" content="/img/landing.png"></meta>
        <meta
          name="keywords"
          content="Decentralization, Smart Contracts, ICO (Initial Coin Offering), Digital Assets, Mining, Public Ledger, Altcoinsm, Consensus Algorithm, Distributed Ledger Technology, Wallets, Cryptography, Peer-to-Peer Network, Hashing, Security, Ethereum Virtual Machine, Gas, Proof-of-Stake, Non-Fungible Tokens (NFTs), Stablecoins, Cross-Chain Interoperability"
        ></meta>
      </Helmet>
      <Suspense>
        <ThemeProvider
          enableSystem
          enableColorScheme
          forcedTheme={themeName}
          themes={[
            "light",
            "dark",
            "sky",
            "skyLight",
            "arctic",
            "arcticLight",
            "azure",
            "azureLight",
            "iris",
            "irisLight",
            "flamingo",
            "flamingoLight",
            "corral",
            "corralLight",
            "marine",
            "marineLight",
            "ocean",
            "oceanLight",
            "fluid",
            "fluidLight",
            "galaxy",
            "galaxyLight",
            "cosmos",
            "cosmosLight",
            "andromeda",
            "andromedaLight",
          ]}
          value={Object.keys(values).reduce((acc, curr) => {
            acc[curr] = values[curr].className;

            return acc;
          }, {})}
        >
          <NextUIProvider theme={values[themeName]}>
            <RouterProvider router={router} />
          </NextUIProvider>
        </ThemeProvider>
      </Suspense>
    </>
  );
}

export default App;
