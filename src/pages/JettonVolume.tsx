/* eslint-disable @next/next/no-img-element */
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import useDarkMode from "use-dark-mode";
import {
  Badge,
  Button,
  Card,
  Grid,
  Loading,
  Spacer,
  Table,
  Link,
  Avatar,
  Text,
  Dropdown,
} from "@nextui-org/react";
import {
  ChartOptions,
  createChart,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  Time,
} from "lightweight-charts";
import moment from "moment";
import { AppContext } from "contexts/AppContext";
import axios from "libs/axios";
import { _, scaleTime } from "utils/time";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { toFixed } from "utils/price";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ARR01,
  ARR02,
  ARR40,
  ARR43,
  FIL02,
  GEN13,
  GRA01,
  GRA03,
  GRA06,
  GRA09,
} from "assets/icons";

const pagination = {
  "1M": 60,
  "5M": 300,
  "30M": 1800,
  "1H": 3600,
  "4H": 14400,
  "1D": 86400,
};

export const AnalyticsVolume = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const darkMode = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const areaSeriesRef = useRef<ISeriesApi<"Area">>();
  const jettonsSeriesRef = useRef<ISeriesApi<"Area">>();
  const { jettons } = useContext(AppContext);
  const [timescale, setTimescale] = useState<
    "1M" | "5M" | "30M" | "1H" | "4H" | "1D" | "30D"
  >((localStorage.getItem("timescale") as any) || "1H");
  const [isFull, setIsFull] = useState(false);
  const [page, setPage] = useState<number>();
  const [loadingPage, setLoadingPage] = useState(1);
  const [info, setInfo] = useState<Record<string, any>>();
  const [decimals, setDecimals] = useState(9);
  const [jetton, setJetton] = useState<Record<string, any>>({});
  const [results, setResult] = useState<Record<string, any>>([]);

  // const [] = useDebounce(
  //   () => {
  //     setPage(loadingPage);
  //   },
  //   300,
  //   [loadingPage]
  // );

  const chartOptions: DeepPartial<ChartOptions> = useMemo(
    () => ({
      autoSize: true,
      layout: { textColor: "white", background: { color: "transparent" } },
      grid: {
        vertLines: { color: darkMode.value ? "#131d29" : "#f1f1f1" },
        horzLines: { color: darkMode.value ? "#131d29" : "#f1f1f1" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    }),
    [darkMode.value]
  );

  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["jetton-analytics", location.pathname],
      queryFn: ({ pageParam = 1 }) => {
        return (
          jetton.id &&
          !!(!data?.pages[pageParam - 1] || data?.pages[pageParam - 1]) &&
          axios
            .get(
              `https://api.fck.foundation/api/v1/analytics/liquidity?jetton_id=${
                jetton.id
              }&time_min=${Math.floor(
                Date.now() / 1000 - pageParam * pagination[timescale] * 60
              )}&time_max=${Math.floor(
                Date.now() / 1000 - (pageParam - 1) * pagination[timescale] * 60
              )}&timescale=${pagination[timescale]}`
            )
            .then(({ data: { data } }) => data)
        );
      },
      cacheTime: 60 * 1000,
      enabled: !!jetton?.id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      getNextPageParam: (_, pages) => {
        return page && !pages[page - 1] ? page : undefined; // If there is not a next page, getNextPageParam will return undefined and the hasNextPage boolean will be set to 'false'
      },
      onSuccess: (results) => {
        localStorage.setItem("timescale", timescale);

        const list = results.pages
          ?.reverse()
          ?.flat()
          ?.sort((x: any, y: any) => x.time - y.time)
          ?.filter((i: any) => i && i?.price_close !== "0.000000000") as any;

        areaSeriesRef.current!.setData(
          [...list].map((item) => ({
            time: Math.floor(item.time) as any,
            value: _(item.ton_pool),
          }))
        );

        jettonsSeriesRef.current!.setData(
          [...list].map((item) => ({
            time: Math.floor(item.time) as any,
            value: _(item.jetton_pool),
          }))
        );

        const getLastBar = (series) => {
          return list && series.dataByIndex(list.length - 1);
        };

        const updateLegend = (param) => {
          const validCrosshairPoint = !(
            param === undefined ||
            param.time === undefined ||
            param.point.x < 0 ||
            param.point.y < 0
          );

          const candle = validCrosshairPoint
            ? param.seriesData.get(areaSeriesRef.current)
            : getLastBar(areaSeriesRef.current);
          const jettons = validCrosshairPoint
            ? param.seriesData.get(jettonsSeriesRef.current)
            : getLastBar(jettonsSeriesRef.current);

          // time is in the same format that you supplied to the setData method,
          // which in this case is YYYY-MM-DD

          const time = candle?.time ? new Date(candle.time * 1000) : new Date();

          setInfo({
            time: moment(time).format("HH:mm"),
            value: candle?.value || 0,
            jettons: jettons?.value || 0,
            color:
              candle?.close > candle?.open
                ? "#26a69a"
                : candle?.close === candle?.open
                ? "#fff"
                : "#ef5350",
          });
        };

        chartRef.current!.subscribeCrosshairMove(updateLegend);
        updateLegend(undefined);

        if (!page || (page && page <= 2)) {
          chartRef.current!.timeScale().fitContent();
        }
      },
    });

  const onVisibleLogicalRangeChanged = useCallback(
    (newVisibleLogicalRange) => {
      if (areaSeriesRef.current) {
        const barsInfo = areaSeriesRef.current.barsInLogicalRange(
          newVisibleLogicalRange
        );
        if (
          hasNextPage &&
          page &&
          page >= 3 &&
          page <= loadingPage &&
          barsInfo !== null &&
          barsInfo.barsBefore < 0
        ) {
          setLoadingPage(page + 1);
        }
      }
    },
    [page, loadingPage, hasNextPage]
  );

  useEffect(() => {
    if (page && page <= 2 && !isFetchingNextPage) {
      setLoadingPage(page + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    chartRef.current = createChart(ref.current!, chartOptions);
    const date = new Date();

    if (chartRef.current) {
      areaSeriesRef.current = chartRef.current.addAreaSeries({
        lineColor: "#2962FF",
        topColor: "transparent",
        bottomColor: "transparent",
      });
      jettonsSeriesRef.current = chartRef.current.addAreaSeries({
        lineColor: "#1ac964",
        topColor: "transparent",
        bottomColor: "transparent",
      });

      areaSeriesRef.current.setMarkers([
        {
          time: {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
          },
          position: "belowBar",
          color: "#2962FF",
          shape: "circle",
          text: "TON",
        },
      ]);
      jettonsSeriesRef.current.setMarkers([
        {
          time: {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
          },
          position: "aboveBar",
          color: "#1ac964",
          shape: "circle",
          text: jetton?.symbol,
        },
      ]);
    }

    setPage(undefined);
    setLoadingPage(1);
    queryClient.setQueryData(["jetton-analytics"], { pages: [] });

    return () => {
      chartRef.current!.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jetton.id, timescale, chartOptions, location?.pathname]);

  useEffect(() => {
    if (hasNextPage) {
      setTimeout(() => {
        chartRef.current
          ?.timeScale()
          .unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
        chartRef.current
          ?.timeScale()
          .subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);

        fetchNextPage();
      }, 150);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasNextPage]);

  useEffect(() => {
    if (jettons?.length) {
      const jettonName = globalThis.location.pathname
        .split("/analytics/volume/")
        .pop();

      const dataJetton = jettons.find(
        ({ symbol }) => symbol?.toUpperCase() === jettonName?.toUpperCase()
      );

      if (dataJetton) {
        setJetton(dataJetton);

        axios
          .get(
            `https://tonobserver.com/api/v2/jetton_top_holders/${dataJetton.address}?limit=100`
          )
          .then(({ data: { result } }) => {
            setResult(result);
          });

        axios
          .get(
            `https://tonapi.io/v1/jetton/getInfo?account=${dataJetton.address}`
          )
          .then(({ data: { metadata } }) => {
            setDecimals(metadata?.decimals);
          });
      }
    }
  }, [jettons, location]);

  const prevJetton = useMemo(() => {
    const list = jettons?.filter((i) => i.verified);

    if (list) {
      const index = list.findIndex((item) => item.symbol === jetton.symbol) - 1;

      return index > -1 ? list[index] : list && list[list.length - 1];
    } else {
      return null;
    }
  }, [jettons, jetton]);

  const nextJetton = useMemo(
    () =>
      jettons &&
      jettons[jettons.findIndex((item) => item.symbol === jetton.symbol) + 1],
    [jettons, jetton]
  );

  return (
    <Grid.Container>
      <Grid css={{ width: '100%' }}>
        <div
          ref={ref}
          key={timescale}
          style={{
            width: "100%",
            height: isFull ? "calc(100vh - 350px)" : "30vh",
          }}
        />
      </Grid>
      <Spacer y={0.5} />
      <Grid className="chart-table">
        <Table
          aria-label="Stats"
          compact
          bordered={false}
          shadow={false}
          css={{ border: "none", padding: 0 }}
        >
          <Table.Header>
            <Table.Column>
              <div className="chart-label">
                <GRA06 style={{ fill: "currentColor", fontSize: 24 }} />{" "}
                {t("volumeJ")}
              </div>
            </Table.Column>
            <Table.Column>
              <div className="chart-label">
                <GRA09 style={{ fill: "currentColor", fontSize: 24 }} />{" "}
                {t("volumeL")}
              </div>
            </Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row key="1">
              <Table.Cell>
                {toFixed(
                  (parseFloat(info?.jettons || 0) as number).toFixed(decimals)
                )}{" "}
                {jetton.symbol}
              </Table.Cell>
              <Table.Cell>{parseFloat(info?.value?.toFixed(2))} TON</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Grid>
    </Grid.Container>
  );
};

const infoAddress = {
  "EQB-7nZY_Onatn-_s5J2Y9jDOxCjWFzwMOa4_MeuSbgPgnVO": {
    color: "secondary",
    text: "Development",
  },
  "EQDzIMlFI2-f-hWlVqoxFmFCo7nIA5YN0q3V6zg2DN2aEpmR": {
    color: "secondary",
    text: "Marketing",
  },
};