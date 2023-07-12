import { useContext, useEffect, useMemo, useRef, useState } from "react";
import cookie from "react-cookies";
import { useTranslation } from "react-i18next";
import { Grid, Loading, Spacer, Table, Text, Divider } from "@nextui-org/react";
import {
  ChartOptions,
  createChart,
  DeepPartial,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import moment from "moment";
import { AppContext } from "contexts/AppContext";
import axios from "libs/axios";
import { _ } from "utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toFixed } from "utils/price";
import { useLocation } from "react-router-dom";
import { GEN13, GRA06, GRA09 } from "assets/icons";
import { usePairs } from "hooks";

export const paginationVolume = {
  "1H": "h1",
  "4H": "h4",
  "1D": "d1",
  "3D": "d3",
  "7D": "w1",
  "14D": "w2",
  "30D": "m1",
  "90D": "m3",
  "180D": "m6",
  "1Y": "y1",
};

export const Volume = ({ timescale }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const areaSeriesRef = useRef<ISeriesApi<"Area">>();
  const jettonsSeriesRef = useRef<ISeriesApi<"Area">>();
  const { jettons, enabled, theme, jettonCurrency, setTimescale } =
    useContext(AppContext);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isFull] = useState(false);
  const [info, setInfo] = useState<Record<string, any>>();
  const [jetton, setJetton] = useState<Record<string, any>>({});
  const [changes, setChanges] = useState<Record<string, any>>({});
  const [isLoad, setIsLoad] = useState(false);

  const pairJetton = usePairs("volume", [jetton.id]);

  useEffect(() => {
    setChanges({
      jetton: jetton?.id,
      timescale,
      location: location.pathname,
      theme: theme?.color,
      enabled,
      currency: jettonCurrency?.symbol,
      pairJetton,
    });
  }, [
    jetton,
    timescale,
    location.pathname,
    theme,
    jettonCurrency?.symbol,
    pairJetton,
  ]);

  useEffect(() => {
    if (
      location.pathname.includes("volume") &&
      ["5M", "15M", "30M"].includes(timescale)
    ) {
      setTimescale("1H");
    }
  }, [timescale, location.pathname]);

  useEffect(() => {
    if (jettons?.length) {
      const jettonName = location.pathname.split("/").pop();

      const dataJetton = jettons.find(
        ({ symbol }) => symbol?.toUpperCase() === jettonName?.toUpperCase()
      );

      if (dataJetton) {
        setJetton(dataJetton);
      }
    }
  }, [jettons, location.pathname, jetton]);

  const chartOptions: DeepPartial<ChartOptions> = useMemo(
    () => ({
      autoSize: true,
      layout: {
        textColor: !enabled ? "#3e3e3e" : "#eae5e7",
        background: { color: "transparent" },
      },
      grid: {
        vertLines: { color: "transparent" },
        horzLines: { color: "transparent" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: enabled ? "#3e3e3e" : "#eae5e7",
      },
    }),
    [enabled]
  );

  const { data: dataVolume, isLoading } = useQuery({
    queryKey: [
      "single-analytics-volume",
      location.pathname,
      timescale,
      jetton.id,
      jettonCurrency?.symbol,
      JSON.stringify(enabled),
      pairJetton,
    ],
    queryFn: ({ signal }) => {
      return axios
        .get(
          `https://api.fck.foundation/api/v3/analytics/liquidity?pairs=${pairJetton[0].id}&period=${paginationVolume[timescale]}&currency=${jettonCurrency?.symbol}`,
          { signal }
        )
        .then(({ data: { data } }) => data[pairJetton[0].id]?.reverse());
    },
    enabled:
      !!jetton?.id &&
      !!pairJetton.length &&
      location.pathname.includes("volume"),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (results) => {
      setData((prevData) => {
        results = [...(results || []), ...prevData].sort(
          (x, y) => moment(x.period).unix() - moment(y.period).unix()
        );

        cookie.save("timescale", timescale, { path: "/" });

        const list = results;

        areaSeriesRef.current?.setData(
          [...list].map((item) => ({
            time: moment(item.period).unix() as any,
            value: _(item.avg2_pool),
          }))
        );

        jettonsSeriesRef.current?.setData(
          [...list].map((item) => ({
            time: moment(item.period).unix() as any,
            value: _(item.avg1_pool),
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
            time: moment(time).format("DD.MM.YY HH:mm"),
            value: candle?.value || 0,
            jettons: jettons?.value || 0,
            color:
              candle?.avg2_pool > candle?.min2_pool
                ? "#26a69a"
                : candle?.avg2_pool === candle?.min2_pool
                ? "#fff"
                : "#ef5350",
          });
        };

        chartRef.current?.subscribeCrosshairMove(updateLegend);
        updateLegend(undefined);

        chartRef.current?.timeScale().fitContent();

        return results;
      });
    },
  });

  const dataDays = useMemo(
    () => Math.round((Date.now() / 1000 - dataVolume?.pop()?.time) / 86400),
    [dataVolume]
  );

  useEffect(() => {
    if (
      !isLoad ||
      !chartRef.current ||
      changes?.enabled !== enabled ||
      changes?.currency !== jettonCurrency?.symbol ||
      changes?.jetton !== jetton?.id ||
      changes?.timescale !== timescale ||
      changes?.location !== location?.pathname ||
      changes?.theme !== theme?.color
    ) {
      if (chartRef.current && "remove" in chartRef.current) {
        chartRef.current?.remove();
      }

      chartRef.current = createChart(ref.current as any, chartOptions);
      const date = new Date();

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
      setData([]);
      areaSeriesRef.current?.setData([]);
      jettonsSeriesRef.current?.setData([]);
      queryClient.setQueryData(
        [
          "single-analytics-volume",
          location.pathname,
          timescale,
          jetton.id,
          jettonCurrency?.symbol,
          JSON.stringify(enabled),
          pairJetton,
        ],
        []
      );

      setIsLoad(true);
    }
  }, [
    changes,
    jetton,
    timescale,
    location,
    chartOptions,
    theme,
    enabled,
    jettonCurrency?.symbol,
    isLoad,
    pairJetton,
  ]);

  return (
    <Grid.Container>
      {!isLoading && (!data.length || dataDays > 3) && (
        <Grid.Container
          justify="center"
          alignItems="center"
          wrap="nowrap"
          css={{
            position: "absolute",
            left: "0",
            top: "0",
            height: "100%",
            background: "var(--nextui--navbarBlurBackgroundColor)",
            pointerEvents: "none",
          }}
        >
          <Grid>
            <GEN13 className="text-2xl " />
          </Grid>
          <Spacer x={0.4} />
          <Grid>
            <Text className="text-base">{t("notAvailable")}</Text>
          </Grid>
        </Grid.Container>
      )}
      {isLoading && location.pathname.includes("volume") && (
        <Loading
          css={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate3d(-50%, -50%, 0)",
          }}
        />
      )}

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
                <GRA06 className="text-2xl " /> {t("volumeJ")}
              </div>
            </Table.Column>
            <Table.Column>
              <div className="chart-label">
                <GRA09 className="text-2xl " /> {t("volumeL")}
              </div>
            </Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row key="1">
              <Table.Cell>
                <Grid.Container alignItems="center">
                  <Grid>
                    <Text
                      css={{
                        textGradient: "45deg, $primary -20%, $secondary 100%",
                      }}
                      className="chart-label"
                    >
                      <GRA06 className="text-2xl fill-current" /> {t("volumeJ")}
                    </Text>
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid>
                    {toFixed(
                      (parseFloat(info?.jettons || 0) as number).toFixed(
                        jetton?.decimals
                      )
                    )}{" "}
                    {jetton.symbol}
                  </Grid>
                </Grid.Container>
              </Table.Cell>
              <Table.Cell>
                <Grid.Container alignItems="center">
                  <Grid>
                    <Text
                      css={{
                        textGradient: "45deg, $primary -20%, $secondary 100%",
                      }}
                      className="chart-label"
                    >
                      <GRA09 className="text-2xl fill-current" /> {t("volumeL")}
                    </Text>
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid>{parseFloat(info?.value?.toFixed(2) || 0)} TON</Grid>
                </Grid.Container>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Grid>
      <Divider />
      <Grid css={{ width: "100%" }}>
        <div
          ref={ref}
          key={timescale}
          style={{
            width: "100%",
            height: isFull ? "calc(100vh - 350px)" : "70vh",
            filter: !data.length || dataDays > 3 ? "blur(3px)" : undefined,
          }}
        />
      </Grid>
    </Grid.Container>
  );
};
