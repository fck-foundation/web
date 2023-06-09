/* eslint-disable @next/next/no-img-element */
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
import { _ } from "utils";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { ARR20, ARR24, GEN03, GEN04 } from "assets/icons";
import { AppContext } from "contexts";
import Skeleton from "react-loading-skeleton";
import { useTonAddress } from "@tonconnect/ui-react";
import { pagination } from "pages";
import { ThemeSwitcher } from "./Theme";
import { Address } from "ton-core";
import { JettonChart } from "pages/Analytics/Charts";

interface Props {}

export const Search: React.FC<Props> = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const refLogo = useRef<HTMLDivElement>(null);
  const refJetton = useRef<HTMLDivElement>(null);
  const address = useTonAddress();
  // const [present] = useIonActionSheet();
  const { authorized, jettons, timescale, setOpen } = useContext(AppContext);
  const tokens = cookie.load("tokens");
  const [widths, setWidths] = useState({
    logo: 0,
    jetton: 0,
  });
  const [isInformed, setIsInformed] = useState(
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

  const { data: dataWalletSearch, isLoading: isLoadingWalletSearch } = useQuery(
    {
      queryKey: ["wallet-search", search],
      queryFn: ({ signal }) =>
        axios
          .get(`https://tonapi.io/v2/accounts/search?name=${search}`, {
            signal,
          })
          .then(({ data: { addresses } }) => addresses),
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: !!search?.length && ["all", "wallets"].includes(tab),
      retryDelay: 1000,
      cacheTime: 60 * 1000,
    }
  );

  const { data: dataStatsSearch, isLoading: isLoadingStatsSearch } = useQuery({
    queryKey: ["jettons-analytics-search", timescale, searchList],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v2/analytics?jetton_ids=${searchList
            ?.map(({ id }) => id)
            ?.join(",")}&time_min=${Math.floor(
            Date.now() / 1000 - pagination[timescale] * 7
          )}&timescale=${pagination[timescale]}`,
          { signal }
        )
        .then(({ data: { data } }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!searchList?.length && ["all", "tokens"].includes(tab),
    cacheTime: 60 * 1000,
    select: (response) =>
      searchList.map((jetton: any, key) => {
        jetton.data =
          response?.sources?.DeDust?.jettons[jetton.id.toString()]?.prices ||
          [];
        const dataJetton = [
          ...(jetton.data && jetton.data.length < 2
            ? [
                {
                  name: jetton.data[0]?.symbol,
                  pv:
                    _(jetton.data[0]?.price_close) ||
                    _(jetton.data[0]?.price_high) ||
                    _(jetton.data[0]?.price_low) ||
                    _(jetton.data[0]?.price_open),
                  volume: 0,
                },
              ]
            : []),
          ...(jetton.data || [])?.map((item, i) => {
            return {
              name: jettons.find(({ id }) => id === item.jetton_id)?.symbol,
              pv:
                _(item.price_close) ||
                _(item.price_high) ||
                _(item.price_low) ||
                _(item.price_open),
              volume: _(item.volume),
            };
          }),
        ];
        const dataChart = [...dataJetton]
          .filter((i) => i.pv)
          .map((d, i) => ({
            ...d,
            pv:
              i > 0 &&
              d.pv &&
              dataJetton[i - 1].pv &&
              dataJetton[i - 1].pv !== d.pv
                ? dataJetton[i - 1].pv < d.pv
                  ? d.pv && d.pv - 100
                  : d.pv && d.pv + 100
                : dataJetton[dataJetton.length - 1].pv < d.pv
                ? d.pv && d.pv + 100 * 10
                : d.pv && d.pv - 100 * 2,
          }));

        const volume = [...dataJetton].reduce(
          (acc, i) => (acc += i?.volume),
          0
        );
        const percent = !!dataJetton[dataJetton.length - 1]?.pv
          ? ((dataJetton[dataJetton.length - 1]?.pv - dataJetton[0]?.pv) /
              dataJetton[0]?.pv) *
            100
          : 0;

        return { jetton, dataJetton, dataChart, percent, volume };
      }),
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
    <Grid.Container ref={ref} className="findcheck" wrap="nowrap">
      <Grid
        css={{
          transition: "all 300ms",
          ...(widths.logo && { maxWidth: active ? "0%" : widths.logo }),
          ...(widths.logo && { width: active ? "0%" : widths.logo }),
          minWidth: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Navbar.Brand
          ref={refLogo}
          css={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => navigate("/")}
        >
          <Grid.Container alignItems="center" wrap="nowrap">
            <Grid
              css={{
                display: "flex",
                ...(active && { display: "none" }),
                zIndex: 2,
              }}
            >
              <Badge
                size="xs"
                content={t("beta")}
                placement="bottom-right"
                css={{
                  mb: "$4",
                  zIndex: -1,
                  ...(active && { display: "none" }),
                }}
              >
                <ThemeSwitcher isLogo loading={isLoadingWallet} />
              </Badge>
            </Grid>
            <Grid>
              <Text
                size={16}
                css={{
                  textGradient: "45deg, $primary 25%, $secondary 125%",
                }}
                weight="bold"
                hideIn="xs"
              >
                Find & Check
              </Text>
            </Grid>
          </Grid.Container>
        </Navbar.Brand>
        <Spacer x={0.4} />
      </Grid>
      <Grid
        css={{
          transition: "all 300ms",
          overflow: "hidden",
          ...(widths.jetton && { maxWidth: active ? "0%" : widths.jetton }),
          ...(widths.jetton && { width: active ? "0%" : widths.jetton }),
          minWidth: 0,
        }}
      >
        {location.pathname.includes("price") ||
        location.pathname.includes("volume") ? (
          <Button
            ref={refJetton}
            flat
            size="sm"
            css={{
              minWidth: "auto",
              "@sm": { display: "none" },
              padding: "$4",
              width: "100%",
            }}
            onPress={() => setOpen(true)}
          >
            <div
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {location.pathname.split("/").pop()}
            </div>

            <Spacer x={0.4} />
            <ARR24 style={{ fill: "currentColor", fontSize: 18 }} />
          </Button>
        ) : null}
      </Grid>

      <Grid className={`findcheck__input ${active ? "active" : ""}`}>
        <Grid.Container gap={1} wrap="nowrap" alignContent="center">
          <Grid>
            <Input
              size="sm"
              className="search-input"
              inputMode="search"
              value={search as string}
              placeholder={t("searchToken") as string}
              clearable
              onChange={(e) => setSearch(e.target.value as any)}
            />
          </Grid>
        </Grid.Container>
      </Grid>

      <Grid
        className="findcheck__trigger"
        css={{ marginLeft: !active ? "$4" : "$0" }}
      >
        <Button
          flat
          size="sm"
          css={{ minWidth: 0, p: 8 }}
          onPress={() => setActive(!active)}
        >
          <GEN04 style={{ fill: "currentColor", fontSize: 18 }} />
        </Button>
      </Grid>

      {!!(searchList?.length || dataWalletSearch?.length) && (
        <div className={`jettons-list findcheck__popup`}>
          <Grid>
            <Button.Group size="sm">
              <Button flat={tab !== "all"} onPress={() => setTab("all")}>
                {t("all")}
              </Button>
              <Button
                flat={tab !== "wallets"}
                onPress={() => setTab("wallets")}
              >
                {t("wallets")}
              </Button>
              <Button flat={tab !== "tokens"} onPress={() => setTab("tokens")}>
                {t("tokens")}
              </Button>
            </Button.Group>
          </Grid>
          {["all", "tokens"].includes(tab) && (
            <AnimatePresence>
              {isLoadingStatsSearch ? (
                <Loading />
              ) : (
                dataStatsSearch
                  ?.sort((x, y) => y.jetton.verified - x.jetton.verified)
                  ?.sort(
                    (x, y) =>
                      y.jetton.stats.promoting_points -
                      x.jetton.stats.promoting_points
                  )
                  ?.map(
                    (
                      { jetton, dataJetton, dataChart, percent, volume },
                      key
                    ) => {
                      return (
                        <motion.div
                          key={key}
                          initial={{ y: -300, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 300, opacity: 0 }}
                        >
                          <Grid key={key} className="jetton-card" xs={12}>
                            <Card
                              variant="bordered"
                              isHoverable
                              isPressable
                              onClick={
                                () =>
                                  // jetton.verified
                                  onAdd(jetton.address)
                                // : null
                                // : present({
                                //     header: t("importRisks"),
                                //     subHeader: t("riskInfo"),
                                //     cssClass: "my-custom-class",
                                //     buttons: [
                                //       {
                                //         text: t("import"),
                                //         role: "destructive",
                                //         data: {
                                //           action: "import",
                                //         },
                                //       },
                                //       {
                                //         text: t("cancel"),
                                //         data: {
                                //           action: "cancel",
                                //         },
                                //       },
                                //     ],
                                //     onDidDismiss: ({ detail }) =>
                                //       detail?.data?.action === "import" &&
                                //       onAdd(jetton.address), //onAdd(jetton.address),
                                //   })
                              }
                            >
                              <Card.Header>
                                <Grid.Container
                                  wrap="nowrap"
                                  gap={1}
                                  alignItems="center"
                                  justify="space-between"
                                >
                                  <Grid css={{ textAlign: "center" }}>
                                    <User
                                      bordered
                                      src={jetton.image}
                                      name={
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {jetton.symbol}
                                          <Spacer x={0.2} />
                                          {!!jetton?.verified && (
                                            <Badge
                                              size="xs"
                                              css={{
                                                p: 0,
                                                background: "transparent",
                                                right: "unset",
                                                left: "$8",
                                              }}
                                            >
                                              <ARR20
                                                style={{
                                                  fill: "var(--nextui-colors-primary)",
                                                  fontSize: 16,
                                                  borderRadius: 100,
                                                  overflow: "hidden",
                                                }}
                                              />
                                            </Badge>
                                          )}
                                          <Spacer x={0.2} />
                                          <Badge
                                            size="xs"
                                            variant="flat"
                                            color="primary"
                                            css={{
                                              flexWrap: "nowrap",
                                              p: "$0 $4 $0 $0",
                                            }}
                                          >
                                            <GEN03
                                              style={{
                                                fill: "currentColor",
                                                fontSize: 18,
                                              }}
                                            />
                                            <Spacer x={0.4} />
                                            {jetton?.stats?.promoting_points ||
                                              0}
                                          </Badge>
                                        </div>
                                      }
                                      description={(!!dataJetton[
                                        dataJetton.length - 1
                                      ]?.pv
                                        ? 1 /
                                          dataJetton[dataJetton.length - 1]?.pv
                                        : 0
                                      ).toFixed(2)}
                                      css={{ padding: 0 }}
                                    />
                                  </Grid>
                                  <Grid
                                    xs={4}
                                    className="jetton-chart"
                                    css={{
                                      padding: 0,
                                      overflow: "hidden",
                                    }}
                                  >
                                    {isLoadingStatsSearch ? (
                                      <Skeleton
                                        count={1}
                                        height={35}
                                        width={250}
                                      />
                                    ) : dataChart.length ? (
                                      <JettonChart
                                        index={key}
                                        data={
                                          dataChart.length < 2
                                            ? [
                                                ...dataChart.map((i) => ({
                                                  ...i,
                                                  pv:
                                                    _(i?.price_close) ||
                                                    _(i?.price_high) ||
                                                    _(i?.price_low) ||
                                                    _(i?.price_open),
                                                })),
                                                ...dataChart,
                                              ]
                                            : dataChart
                                        }
                                        height={
                                          ["FCK"].includes(jetton.symbol)
                                            ? 36
                                            : 50
                                        }
                                        color={
                                          !isNaN(percent) && percent !== 0
                                            ? percent > 0
                                              ? "#1ac964"
                                              : "#f31260"
                                            : "gray"
                                        }
                                      />
                                    ) : null}
                                  </Grid>
                                  <Grid>
                                    <Grid.Container
                                      direction="column"
                                      alignItems="flex-end"
                                    >
                                      <Grid>
                                        <Badge
                                          size="xs"
                                          color={
                                            !isNaN(percent) && percent !== 0
                                              ? percent > 0
                                                ? "success"
                                                : "error"
                                              : "default"
                                          }
                                          css={{ whiteSpace: "nowrap" }}
                                        >
                                          {!isNaN(percent) && percent !== 0
                                            ? parseFloat(
                                                Math.abs(percent).toFixed(2)
                                              )
                                            : 0}{" "}
                                          %
                                        </Badge>
                                      </Grid>
                                      <Spacer y={0.4} />
                                      <Grid
                                        css={{
                                          display: "flex",
                                          flexWrap: "nowrap",
                                          whiteSpace: "nowrap",
                                          alignItems: "center",
                                        }}
                                      >
                                        {(volume || 0).toFixed(0)} TON
                                      </Grid>
                                    </Grid.Container>
                                  </Grid>
                                </Grid.Container>
                              </Card.Header>
                            </Card>
                          </Grid>
                          <Spacer y={0.4} />
                        </motion.div>
                      );
                    }
                  )
              )}
            </AnimatePresence>
          )}
          {["all", "wallets"].includes(tab) &&
            dataWalletSearch?.map((wallet, i) => (
              <>
                <Grid key={i} className="jetton-card" xs={12}>
                  <Card
                    variant="bordered"
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
    </Grid.Container>
  );
};
