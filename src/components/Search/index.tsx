import { useContext, useEffect, useMemo, useRef, useState } from "react";
import cookie from "react-cookies";
import { motion, AnimatePresence } from "framer-motion";
import {
  Badge,
  Button,
  Card,
  Grid,
  Input,
  Loading,
  Navbar,
  Spacer,
  Text,
  User,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import axios from "libs/axios";
import { _, getList } from "utils";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { ARR12, ARR20, ARR24, GEN03, GEN04 } from "assets/icons";
import { AppContext } from "contexts";
import Skeleton from "react-loading-skeleton";
import { pagination } from "pages";
import { ThemeSwitcher } from "../Theme";
import { Address } from "ton-core";
import { FJetton } from "../Jetton";

import "./index.scss";
import { FCard } from "components/Card";
import { usePairs } from "hooks";

interface Props {
  isCompact?: boolean;
}

export const Search: React.FC<Props> = ({ isCompact = false }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const refLogo = useRef<HTMLDivElement>(null);
  const refJetton = useRef<HTMLDivElement>(null);
  // const [present] = useIonActionSheet();
  const { authorized, jetton, jettons, timescale, currency, setOpen } =
    useContext(AppContext);
  const [widths, setWidths] = useState({
    logo: 0,
    jetton: 0,
  });
  const [isInformed] = useState(
    cookie.load("informed") === "true" ? true : false
  );
  const [search, setSearch] = useState<string | null | undefined>();
  const [active, setActive] = useState(false);
  const [tab, setTab] = useState<"all" | "wallets" | "tokens">("all");

  useEffect(() => {
    cookie.save("informed", JSON.stringify(isInformed), { path: "/" });
  }, [isInformed]);

  const searchList = useMemo(
    () =>
      search
        ? jettons?.filter(
            (i) =>
              i.symbol.toLowerCase().includes(search?.toLowerCase() || "") ||
              i.address.includes(search || "")
          )
        : [],
    [jettons, search]
  );

  const { data: dataWalletSearch } = useQuery({
    queryKey: ["wallet-search", search],
    queryFn: ({ signal }) =>
      axios
        .get(`https://tonapi.io/v2/accounts/search?name=${search}`, {
          signal,
        })
        .then(({ data: { addresses } }) => addresses),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!((search?.length || 0) > 3) && ["all", "wallets"].includes(tab),
    retryDelay: 1000,
    cacheTime: 60 * 1000,
  });

  const pairJetton = usePairs(
    "search",
    searchList?.map(({ id }) => id as number) || []
  );

  const { data: dataStatsSearch, isLoading: isLoadingStatsSearch } = useQuery({
    queryKey: [
      "jettons-analytics-search",
      timescale,
      searchList,
      currency,
      pairJetton,
    ],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v3/analytics?pairs=${pairJetton
            ?.map(({ id }) => id)
            ?.join(",")}&period=${pagination[timescale]}&currency=${currency}`,
          { signal }
        )
        .then(({ data }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled:
      !!pairJetton?.length &&
      !!jettons.length &&
      ["all", "tokens"].includes(tab),
    cacheTime: 60 * 1000,
    select: (results) => getList(results.data, jettons, pairJetton),
  });

  const onAdd = (value) => {
    // setList((prevList) => [...prevList, value]);
    // setSearch(null);
    setSearch("");
    navigate(
      `/analytics/price/${
        jettons.find(({ address }) => address === value)?.symbol
      }`
    );
  };

  useEffect(() => {
    if (
      (!widths.jetton || !widths.logo) &&
      (refLogo.current?.clientWidth || refJetton.current?.clientWidth)
    ) {
      setWidths({
        logo: refLogo.current?.clientWidth as number,
        jetton: refJetton.current?.clientWidth as number,
      });
    }

    if (
      !active &&
      (refLogo.current?.clientWidth || refJetton.current?.clientWidth)
    ) {
      setWidths({
        logo: refLogo.current?.clientWidth as number,
        jetton: refJetton.current?.clientWidth as number,
      });
    }
  }, [refLogo.current, refJetton.current, location.pathname]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setActive(false);
        setOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, location.pathname]);

  useEffect(() => {
    setActive(false);
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setSearch("");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  const isLoadingWallet = typeof authorized === "undefined";

  return (
    <Grid.Container
      ref={ref}
      alignItems="center"
      className={`findcheck ${active ? "active" : undefined}`}
      wrap="nowrap"
    >
      <Grid className={`findcheck__input ${active ? "active" : ""}`}>
        <Grid.Container wrap="nowrap" alignContent="center" justify="center">
          <Grid className="w-full">
            <Input
              animated={false}
              labelLeft={
                <GEN04
                  className="text-2xl"
                  style={{
                    fill: "var(--nextui-colors-accents9)",
                  }}
                />
              }
              size={isCompact ? "md" : "xl"}
              bordered
              className="search-input"
              inputMode="search"
              value={search as string}
              placeholder={t("searchToken") as string}
              clearable
              css={{ minWidth: "100%" }}
              onChange={(e) => setSearch(e.target.value as any)}
            />
          </Grid>
          <Spacer x={0.8} />
          <Grid>
            {location.pathname.includes("price") ||
            location.pathname.includes("volume") ? (
              <Button
                ref={refJetton}
                flat
                css={{
                  minWidth: "auto",
                  "@sm": { display: "none" },
                  padding: "$4",
                  width: "100%",
                }}
                onPress={() => setOpen(true)}
              >
                <div className="flex place-items-center overflow-hidden text-ellipsis whitespace-nowrap">
                  <User
                    size="sm"
                    bordered
                    src={jetton.image}
                    name={
                      <div
                        className="flex place-items-center pl-2"
                        style={{ paddingTop: 4 }}
                      >
                        {jetton.symbol}
                      </div>
                    }
                    css={{ padding: 0 }}
                  />
                </div>
                <Spacer x={0.4} />
                <ARR24 className="text-lg fill-current" />
              </Button>
            ) : null}
          </Grid>
        </Grid.Container>
      </Grid>
      <Grid xs={12} className="w-full">
        {!!(searchList?.length || dataWalletSearch?.length) && (
          <div className={`jettons-list findcheck__popup justify-center`}>
            <Grid xs={12}>
              <Button.Group className="py-2" size="sm" css={{ m: 0 }}>
                <Button flat={tab !== "all"} onPress={() => setTab("all")}>
                  {t("all")}
                </Button>
                <Button
                  flat={tab !== "wallets"}
                  onPress={() => setTab("wallets")}
                >
                  {t("wallets")}
                </Button>
                <Button
                  flat={tab !== "tokens"}
                  onPress={() => setTab("tokens")}
                >
                  {t("tokens")}
                </Button>
              </Button.Group>
            </Grid>
            {["all", "tokens"].includes(tab) && (
              <AnimatePresence>
                <FCard
                  isLoading={isLoadingStatsSearch}
                  title={undefined}
                  list={
                    dataStatsSearch
                      ?.sort(
                        (x, y) =>
                          parseInt(y?.verified as any) -
                          parseInt(x?.verified as any)
                      )
                      ?.sort(
                        (x, y) =>
                          (y?.stats?.promoting_points || 0) -
                          (x?.stats?.promoting_points || 0)
                      ) || []
                  }
                  setVoteId={console.log}
                />
              </AnimatePresence>
            )}
            {["all", "wallets"].includes(tab) &&
              dataWalletSearch?.map((wallet, i) => (
                <>
                  <Grid key={i} className="jetton-card" xs={12}>
                    <Card
                      isPressable
                      onPress={() => {
                        setSearch("");
                        setActive(false);
                        setOpen(false);
                        navigate(
                          `/wallet/${Address.parse(wallet.address).toString()}`
                        );
                      }}
                    >
                      <Card.Header>{wallet.name}</Card.Header>
                    </Card>
                  </Grid>
                  {dataWalletSearch.length - 1 !== i && <Spacer y={0.4} />}
                </>
              ))}
          </div>
        )}
      </Grid>
    </Grid.Container>
  );
};
