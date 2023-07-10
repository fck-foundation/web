import {
  createContext,
  ReactNode,
  ReactElement,
  useEffect,
  useState,
  Dispatch,
  useRef,
  useCallback,
} from "react";
import cookie from "react-cookies";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import TonConnect, { CHAIN } from "@tonconnect/sdk";
import { useQuery } from "@tanstack/react-query";
import { Address, TonClient } from "ton";
import { coingecko, fck } from "api";
import { NftItem } from "tonapi-sdk-js";
import TonProofApi, { connector, TonProofApiService } from "TonProofApi";
import { getCookie, normalize } from "utils";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import useInterval from "hooks/useInterval";
import { useJetton } from "hooks";
import { CurrentPrice, OrderData } from "types";
import { Button, Card, Grid, Image, Spacer } from "@nextui-org/react";

const client = new TonClient({
  endpoint: `https://toncenter.com/api/v2/jsonRPC`,
});

export type JType = {
  id: number;
  name: string;
  image: string;
  symbol: string;
  address: string;
  decimals: number;
  verified: number;
  is_scam?: number;
  dedust_lp_address?: string;
  dedust_swap_address?: string;
  data?: any[];
  stats: { promoting_points: number };
};

export type JScale = "1M" | "5M" | "30M" | "1H" | "4H" | "1D" | "7D" | "30D";

interface AppProps {
  connector: TonConnect;
  TonProofApi: TonProofApiService;
  isBottom: boolean;
  open: boolean;
  authorized?: boolean;
  address: string;
  rawAddress: string;
  nftItems?: NftItem[];
  jetton: Record<string, any>;
  theme: { color: string; id?: number };
  ton: Record<string, any>;
  isTLoading: boolean;
  isJLoading: boolean;
  enabled: boolean;
  client: TonClient;
  timescale: JScale;
  jettonCurrency?: JType;
  isDebug: boolean;
  isPrivate: boolean;
  walletJettons: Record<string, any>;
  isLoadingWalletJettons: boolean;
  dex: string;
  setDEX: Dispatch<string>;
  currency: string;
  setCurrency: Dispatch<string>;
  list: string[];
  setList: Dispatch<any>;
  hideList: string[];
  setHideList: Dispatch<any>;
  page: number;
  setPage: Dispatch<any>;
  search?: string;
  setSearch: Dispatch<any>;
  jettons: JType[];
  setJettons: Dispatch<any>;
  setTimescale: Dispatch<any>;
  setOpen: Dispatch<any>;
  setEnabled: Dispatch<any>;
  setTheme: Dispatch<any>;
  setJetton: Dispatch<any>;
  setAuthorized: Dispatch<any>;
  setIsBottom: Dispatch<any>;
  orders: OrderData[];
  setOrders: Dispatch<any>;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<boolean>;
  price?: CurrentPrice;
  setPrice: Dispatch<CurrentPrice>;
  privateKey?: NftItem;
  refetchJettons: () => Promise<any>;
}

const defaultAppContext: AppProps = {
  connector,
  TonProofApi,
  isDebug: false,
  isPrivate: false,
  isBottom: false,
  open: false,
  authorized: false,
  address: "",
  rawAddress: "",
  theme: { color: "" },
  nftItems: [],
  ton: {},
  orders: [],
  setOrders: () => null,
  dex: "DeDust",
  setDEX: () => null,
  currency: "",
  setCurrency: () => null,
  isTLoading: false,
  isJLoading: false,
  enabled: false,
  jetton: {},
  client,
  timescale: "1D",
  list: [],
  setList: () => null,
  hideList: [],
  setHideList: () => null,
  page: 2,
  setPage: () => null,
  search: "",
  walletJettons: [],
  isLoadingWalletJettons: false,
  setSearch: () => null,
  jettons: [],
  setJettons: () => null,
  setTimescale: () => null,
  setOpen: () => null,
  setEnabled: () => null,
  setTheme: () => null,
  setJetton: () => null,
  setAuthorized: () => null,
  setIsBottom: () => null,
  isMenuOpen: false,
  setIsMenuOpen: () => null,
  price: {
    price: 0,
    jetton: {
      id: 1,
      address:
        "0:3a4d2191094e3a33d4601efa51bb52dc5baa354516e162b7706955385f8144a7",
      symbol: "FCK",
      name: "FragmentChecker",
      image: "https://ton.beycoder.ru/token-logo.png",
      verified: 1,
      decimals: 5,
      dedust_swap_address: "EQA0S8EuxAf5W8KtkATOM_GBAAodelXHlQw-wtGApj5JLODa",
      dedust_lp_address: "EQDCewEw7Qck1B6c6MXlAeaG718dI_z8XSCPFKsJcEJYnD4Y",
      is_scam: 0,
      stats: { promoting_points: 42 },
    },
  },
  setPrice: () => null,
  refetchJettons: () => Promise.resolve(null),
};

const isDebug = false;
const key = "dark-mode";

export const AppContext = createContext<AppProps>(defaultAppContext);

const AppProviderWrapper = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const { t, i18n } = useTranslation();
  const address = useTonAddress();
  const wallet = useTonWallet();
  const rawAddress = useTonAddress(false);
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const [theme, setTheme] = useState(
    getCookie("theme")
      ? JSON.parse(decodeURIComponent(getCookie("theme") || ""))
      : {
          color: globalThis?.window?.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light",
        }
  );
  const [nftItems, setNFTItems] = useState<NftItem[]>();
  const [enabled, setEnabled] = useState(
    getCookie(key)
      ? JSON.parse(decodeURIComponent(getCookie(key) || ""))
      : globalThis?.window?.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [open, setOpen] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [jetton, setJetton] = useState<Record<string, any>>({});
  const [authorized, setAuthorized] = useState<boolean>();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [timescale, setTimescale] = useState<
    "1M" | "5M" | "30M" | "1H" | "4H" | "1D" | "7D" | "30D"
  >((cookie.load("timescale") as any) || "1D");

  const tokens = cookie.load("tokens");
  const hideTokens = cookie.load("hide-tokens");
  const defaultDEX = cookie.load("dex");
  const defaultOrders = cookie.load("orders");
  const defaultCurrency = cookie.load("currency");
  const [list, setList] = useState<string[]>(tokens || []);
  const [hideList, setHideList] = useState<string[]>(hideTokens || []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | undefined>();
  const [jettons, setJettons] = useState<JType[]>([]);
  const [dex, setDEX] = useState(defaultDEX || "DeDust");
  const [currency, setCurrency] = useState(defaultCurrency || "");
  const [price, setPrice] = useState<CurrentPrice>();
  const jettonCurrency = useJetton(currency, jettons);
  const [orders, setOrders] = useState<OrderData[]>(defaultOrders || []);
  const [isPrivate, setIsPrivate] = useState(true);
  const [privateKey, setPrivateKey] = useState<NftItem>();

  useEffect(() => {
    setHideList((prevList) => prevList.filter((val) => !list.includes(val)));
  }, [list]);

  const firstProofLoading = useRef<boolean>(true);

  const recreateProofPayload = useCallback(async () => {
    if (firstProofLoading.current) {
      tonConnectUI.setConnectRequestParameters({ state: "loading" });
      firstProofLoading.current = false;
    }

    if (!TonProofApi.accessToken) {
      const payload = await TonProofApi.generatePayload();

      if (payload) {
        tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value: payload,
        });
      } else {
        tonConnectUI.setConnectRequestParameters(null);
        setAuthorized(false);
      }
    }
  }, [tonConnectUI, firstProofLoading]);

  if (firstProofLoading.current) {
    recreateProofPayload();
  }

  useInterval(recreateProofPayload, TonProofApi.refreshIntervalMs);

  useEffect(
    () =>
      tonConnectUI.onStatusChange(async (w) => {
        if (!w || w.account.chain === CHAIN.TESTNET) {
          TonProofApi.reset();
          return;
        }

        if (w.connectItems?.tonProof && "proof" in w.connectItems.tonProof) {
          await TonProofApi.checkProof(
            w.connectItems.tonProof.proof,
            w.account
          ).then(() => {
            setAuthorized(true);
          });
        }
      }),
    [tonConnectUI]
  );

  useEffect(() => {
    if (!localStorage.getItem("access-token")) {
      setAuthorized(false);
    } else if (tonConnectUI.wallet) {
      setAuthorized(true);
    }
  }, [tonConnectUI.wallet]);

  useEffect(() => {
    cookie.save("timescale", timescale, { path: "/" });
  }, [timescale]);

  useEffect(() => {
    cookie.save("tokens", list, { path: "/" });
  }, [list]);

  useEffect(() => {
    cookie.save("hide-tokens", hideList, { path: "/" });
  }, [hideList]);

  useEffect(() => {
    cookie.save("dex", dex, { path: "/" });
  }, [dex]);

  useEffect(() => {
    cookie.save("orders", orders, { path: "/" });
  }, [orders]);

  useEffect(() => {
    cookie.save("currency", currency, { path: "/" });
    setPage(1);
  }, [currency]);

  useEffect(() => {
    if (theme && document.getElementsByTagName("html")) {
      cookie.save("theme", JSON.stringify(theme), { path: "/" });

      if (enabled) {
        document.getElementsByTagName("html")[0].classList.add("dark-theme");
        document
          .getElementsByTagName("html")[0]
          .classList.remove("light-theme");
      } else {
        document.getElementsByTagName("html")[0].classList.add("light-theme");
        document.getElementsByTagName("html")[0].classList.remove("dark-theme");
      }
    }

    setOptions({
      language: i18n.language as any,
      uiPreferences: { theme: (enabled ? "DARK" : "LIGHT") as any },
    });
  }, [theme, enabled, i18n.language]);

  useEffect(() => {
    cookie.save(key, JSON.stringify(enabled), { path: "/" });
  }, [enabled]);

  useQuery({
    queryKey: ["price"],
    queryFn: ({ signal }) => fck.getPrice({ signal }),
    onSuccess: (response) => {
      setPrice(response);
    },
  });

  const { data: walletJettons, isLoading: isLoadingWalletJettons } = useQuery({
    queryKey: ["wallet-jettons", wallet],
    queryFn: async ({ signal }) =>
      await axios.get(`https://tonapi.io/v2/accounts/${address}/jettons`, {
        signal,
      }),
    enabled: !!wallet,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) => response.data.balances,
  });

  const { data: ton, isLoading: isTLoading } = useQuery({
    queryKey: ["ton"],
    queryFn: coingecko.getData,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { isLoading: isJLoading, refetch } = useQuery({
    queryKey: ["jettons"],
    queryFn: ({ signal }) => fck.getJettons(signal),
    refetchOnMount: false,
    refetchOnReconnect: false,
    onSuccess: (response) => {
      const today = new Date();
      today.setHours(today.getHours() - 24);

      const listVerified = response
        .filter(
          ({ verified, address }) =>
            verified && !list.includes(address) && !hideList.includes(address)
        )
        .map(({ address }) => address);
      if (listVerified.length) {
        setList((prevState) => [...new Set([...listVerified, ...prevState])]);
      }

      setJettons(response);
    },
  });

  useEffect(() => {
    const getData = async () => {
      if (address) {
        if (isPrivate && isDebug) {
          setIsPrivate(false);
          // setTimeout(() => {
          //   axios
          //     .get(
          //       `https://tonapi.io/v2/accounts/${address}/nfts?limit=1&offset=${0}&indirect_ownership=true&collection=0:362f5299002f402d3f0119a0cc953267f8c114aaf77c745220cd641d4efd3d66`
          //     )
          //     .then(({ data }) => {
          //       setIsPrivate(!data.nft_items.length);
          //       setPrivateKey(data.nft_items[0]);
          //     });
          // }, 300);
        }

        if (isMenuOpen) {
          // Get list of transactions
          // const blockchainApi = new BlockchainApi(
          //   new Configuration({
          //     headers: {
          //       // To get unlimited requests
          //       Authorization:
          //         "Bearer eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsidGF0YWRldiJdLCJleHAiOjE4MzgwNDc0ODYsImlzcyI6IkB0b25hcGlfYm90IiwianRpIjoiMkFHREdMR09OSUMyVVo3MkNVS0lVUkJXIiwic2NvcGUiOiJjbGllbnQiLCJzdWIiOiJ0b25hcGkifQ.MzApNKLvc9ZHCquoCfXZ-3CXg2-DZLdRrTXjHqk2c1uZt4VPJeQTFvjFtHMtyWi59v1FTCWjYcRUr8viVpXZCA",
          //     },
          //   })
          // );

          axios
            .get(
              `https://tonapi.io/v2/accounts/${address}/nfts?limit=9&offset=${0}&indirect_ownership=true&collection=0:06d811f426598591b32b2c49f29f66c821368e4acb1de16762b04e0174532465`
            )
            .then(({ data }) => setNFTItems(data.nft_items));
        }
      }
    };

    getData();
  }, [address, isMenuOpen]);

  return (
    <AppContext.Provider
      value={{
        client,
        TonProofApi,
        connector,
        isDebug,
        isPrivate,
        orders,
        setOrders,
        isBottom,
        setIsBottom,
        open,
        setOpen,
        dex,
        setDEX,
        currency,
        setCurrency,
        jettonCurrency,
        jetton,
        setJetton,
        authorized,
        setAuthorized,
        address,
        rawAddress,
        nftItems,
        theme,
        setTheme,
        ton,
        isTLoading,
        isJLoading,
        timescale,
        setTimescale,
        enabled,
        setEnabled,
        list,
        setList,
        hideList,
        setHideList,
        page,
        setPage,
        search,
        setSearch,
        jettons,
        setJettons,
        isMenuOpen,
        setIsMenuOpen,
        price,
        setPrice,
        walletJettons,
        isLoadingWalletJettons,
        privateKey,
        refetchJettons: refetch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = ({ children }) => {
  return (
    <>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/fck-foundation/web/master/public/tonconnect-manifest.json">
        <AppProviderWrapper>
          <ToastContainer />
          {children}
        </AppProviderWrapper>
      </TonConnectUIProvider>
    </>
  );
};
