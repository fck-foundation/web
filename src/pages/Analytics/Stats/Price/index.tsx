/* eslint-disable @next/next/no-img-element */
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cookie from "react-cookies";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Badge,
  Card,
  Grid,
  Loading,
  Spacer,
  Table,
  Link,
  Text,
} from "@nextui-org/react";
import {
  ChartOptions,
  createChart,
  CrosshairMode,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineStyle,
  Time,
} from "lightweight-charts";
import moment from "moment";
import { AppContext } from "contexts/AppContext";
import axios from "libs/axios";
import { _, copyTextToClipboard } from "utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toFixed } from "utils/price";
import { useLocation } from "react-router-dom";
import {
  ARR36,
  ARR42,
  ARR58,
  ARR59,
  Copy,
  GEN20,
  GRA04,
  GRA11,
  GRA12,
} from "assets/icons";
import { colors } from "colors";
import { pagination } from "pages/Analytics";
import { useDebounce } from "hooks";
import { normalize } from "utils";
import { ThemeSwitcher } from "components";
import { Address } from "ton-core";

import { Volume } from "../Volume";

export const Price: React.FC<{
  timescale: string;
  onPercentChange: React.Dispatch<number>;
  onRef?: (val: any) => void;
}> = ({ timescale, onPercentChange, onRef }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const volumeSeries = useRef<ISeriesApi<"Histogram">>();
  const candlestickSeries = useRef<ISeriesApi<"Candlestick">>();
  const { jetton, jettons, enabled, theme, setJetton } = useContext(AppContext);

  const [isFull, setIsFull] = useState(false);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loadingPage, setLoadingPage] = useState(1);
  const [info, setInfo] = useState<Record<string, any>>();
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, any>>([]);
  const [saved, setSaved] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [changes, setChanges] = useState<Record<string, any>>({});
  const [isLoad, setIsLoad] = useState(false);

  const value = useDebounce(loadingPage, 300);

  useEffect(() => {
    setChanges({
      jetton: jetton?.id,
      timescale,
      location: location.pathname,
      theme: theme?.color,
      enabled,
    });
  }, [jetton, timescale, location.pathname, theme]);

  useEffect(() => {
    setPage(value);
  }, [value]);

  const chartOptions: DeepPartial<ChartOptions> = useMemo(
    () => ({
      autoSize: true,
      layout: {
        textColor: !enabled ? "#3e3e3e" : "#eae5e7",
        background: { color: "transparent" },
      },
      grid: {
        vertLines: { color: enabled ? "#3e3e3e" : "#eae5e7" },
        horzLines: { color: enabled ? "#3e3e3e" : "#eae5e7" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: enabled ? "#3e3e3e" : "#eae5e7",
      },
      kineticScroll: {
        touch: true,
        mouse: true,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    }),
    [enabled]
  );

  const {
    data: dataJetton,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "jetton-analytics-single",
      page,
      location.pathname,
      timescale,
      jetton.id,
      JSON.stringify(enabled),
    ],
    queryFn: ({ signal }) => {
      return axios
        .get(
          `https://api.fck.foundation/api/v2/analytics?jetton_ids=${
            jetton.id
          }&time_min=${Math.floor(
            Date.now() / 1000 - page * pagination[timescale] * 84
          )}&time_max=${Math.floor(
            Date.now() / 1000 - (page - 1) * pagination[timescale] * 84
          )}&timescale=${pagination[timescale]}`,
          { signal }
        )
        .then(
          ({ data: { data } }) =>
            data?.sources?.DeDust?.jettons[jetton?.id?.toString()]?.prices
        );
    },
    // refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    cacheTime: 60 * 1000,
    enabled: !!jetton?.id,
    onSuccess: (results) => {
      cookie.save("timescale", timescale, { path: "/" });

      if (!results.length) {
        setHasNextPage(false);
      }

      results = [...results, ...data].sort((x, y) => x.time - y.time);

      const list = results;
      volumeSeries.current!.setData(
        [...list].map((item) => ({
          time: Math.floor(item.time) as any,
          value: _(item.volume),
          color:
            _(item.price_close) > _(item.price_open)
              ? "#26a69a80"
              : _(item.price_close) === _(item.price_open)
              ? "gray"
              : "#ef535080",
        }))
      );

      const dataCandle = [...list].map((item) => ({
        time: Math.floor(item.time) as any,
        open: _(item.price_open),
        close: _(item.price_close),
        high: _(item.price_high),
        low: _(item.price_low),
        buy: _(item.volume),
        sell: _(item.jetton_volume),
      }));

      candlestickSeries.current!.setData(dataCandle);

      const getLastBar = (series) => {
        return list && series.dataByIndex(list.length - 1);
      };

      const toolTipWidth = 215;
      const toolTipHeight = 165;
      const toolTipMargin = 16;

      // Create and style the tooltip html element
      const toolTip = document.createElement("div");
      toolTip.style.position = "absolute";
      toolTip.style.display = "none";
      toolTip.style.boxSizing = "border-box";
      toolTip.style.zIndex = "1000";
      toolTip.style.top = "12px";
      toolTip.style.left = "12px";
      toolTip.style.pointerEvents = "none";

      ref.current!.appendChild(toolTip);

      const updateLegend = (param) => {
        const validCrosshairPoint = !(
          param === undefined ||
          param?.time === undefined ||
          param.point.x < 0 ||
          param.point.y < 0
        );

        const candle = validCrosshairPoint
          ? param.seriesData.get(candlestickSeries.current)
          : getLastBar(candlestickSeries.current);
        const volume = validCrosshairPoint
          ? param.seriesData.get(volumeSeries.current)
          : getLastBar(volumeSeries.current);

        // time is in the same format that you supplied to the setData method,
        // which in this case is YYYY-MM-DD

        const time = candle?.time ? new Date(candle.time * 1000) : new Date();
        const item = list?.find(({ time }) => time === volume?.time);

        const selectedInfo = {
          time: moment(time).format("HH:mm"),
          price: candle?.close || 0,
          volume: volume?.value,
          open: candle?.open,
          close: candle?.close,
          high: candle?.high,
          low: candle?.low,
          buy: item?.volume,
          sell: item?.jetton_volume,
          color:
            candle?.close > candle?.open
              ? "#26a69a"
              : candle?.close === candle?.open
              ? colors[theme.color].primary
              : "#ef5350",
        };

        if (
          param?.point === undefined ||
          !param?.time ||
          param?.point.x < 0 ||
          param?.point.y < 0
        ) {
          toolTip.style.display = "none";
        } else {
          if (window.innerWidth >= 960) {
            toolTip.style.display = "block";
          }
          const data = param.seriesData.get(candlestickSeries.current);

          toolTip.innerHTML = `<div style="background: var(--nextui--navbarBlurBackgroundColor);backdrop-filter: saturate(180%) blur(var(--nextui--navbarBlur));" role="section" tabindex="-1" class="nextui-c-BDLTQ nextui-c-jMTBsW nextui-c-gulvcB nextui-c-BDLTQ-jzLLYn-variant-flat nextui-c-BDLTQ-fmlsco-borderWeight-light nextui-c-BDLTQ-cuwTXc-disableAnimation-false nextui-c-BDLTQ-ieFObHQ-css"><div class="nextui-c-eFfoBo" style="padding-top: 8px; padding-bottom: 8px;"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-ijDEIix-css nextui-grid-item nextui-grid-container"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-igNCIse-css nextui-grid-item chart-table"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iebUeoS-css nextui-grid-item nextui-grid-container" style="flex-direction: column"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-idJnZoH-css nextui-grid-item xs sm" style="padding: 0; flex-basics: 100%; max-width: 100%;"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iiwAayw-css nextui-grid-item nextui-grid-container"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-igNCIse-css nextui-grid-item" style="font-size: 12px"><p class="nextui-c-PJLV nextui-c-PJLV-ikeegJh-css chart-label" style="font-size: 12px;"><svg width="14px" height="14px" id="General" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: currentcolor; font-size: 14px !important;"><defs><style>.cls-1{opacity:0.3;}</style></defs><g id="gen011-020"><g id="gen020"><polygon points="14 18 14 16 10 16 10 18 9 20 15 20 14 18"></polygon><path class="cls-1" d="M20,4H17V3a1,1,0,0,0-1-1H8A1,1,0,0,0,7,3V4H4A1,1,0,0,0,3,5V9a4,4,0,0,0,4,4H7l3,3h4l3-3h0a4,4,0,0,0,4-4V5A1,1,0,0,0,20,4ZM5,9V6H7v5A2,2,0,0,1,5,9ZM19,9a2,2,0,0,1-2,2V6h2ZM17,21v1H7V21a1,1,0,0,1,1-1h8A1,1,0,0,1,17,21ZM10,9A1,1,0,0,1,9,8V5a1,1,0,0,1,2,0V8A1,1,0,0,1,10,9Zm0,4a1,1,0,0,1-1-1V11a1,1,0,0,1,2,0v1A1,1,0,0,1,10,13Z"></path></g></g></svg> 1 ${
            jetton.symbol
          }</p></div><span aria-hidden="true" class="nextui-c-gNVTSf nextui-c-gNVTSf-hakyQ-inline-false nextui-c-gNVTSf-ijSsVeB-css"></span><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iajzRv-css nextui-grid-item" style="font-size: 12px">${parseFloat(
            (selectedInfo?.price || 0)?.toFixed(9)
          )}</div></div></div><div class="nextui-c-kRHeuF nextui-c-kRHeuF-idJnZoH-css nextui-grid-item xs sm" style="padding: 0; flex-basics: 100%; max-width: 100%;"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iiwAayw-css nextui-grid-item nextui-grid-container"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-igNCIse-css nextui-grid-item" style="font-size: 12px"><p class="nextui-c-PJLV nextui-c-PJLV-ikeegJh-css chart-label" style="font-size: 12px;"><svg width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: currentcolor; font-size: 14px !important;"><defs><style>.cls-1{opacity:0.3;}</style></defs><g id="Charts_Dashboards_and_Graphs" data-name="Charts, Dashboards and Graphs"><g id="gra001-010"><g id="gra004"><g class="cls-1"><path d="M11,11h2a1,1,0,0,1,1,1v9H10V12A1,1,0,0,1,11,11Zm5-8V21h4V3a1,1,0,0,0-1-1H17A1,1,0,0,0,16,3Z"></path></g><path d="M21,20H8V16a1,1,0,0,0-1-1H5a1,1,0,0,0-1,1v4H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"></path></g></g></g></svg>${t(
            "buy"
          )}</p></div><span aria-hidden="true" class="nextui-c-gNVTSf nextui-c-gNVTSf-hakyQ-inline-false nextui-c-gNVTSf-ijSsVeB-css"></span><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iajzRv-css nextui-grid-item" style="font-size: 12px">${toFixed(
            (selectedInfo?.buy || 0).toFixed(9)
          )} TON</div></div></div><div class="nextui-c-kRHeuF nextui-c-kRHeuF-idJnZoH-css nextui-grid-item xs sm" style="padding: 0; flex-basics: 100%; max-width: 100%;"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iiwAayw-css nextui-grid-item nextui-grid-container"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-igNCIse-css nextui-grid-item" style="font-size: 12px"><p class="nextui-c-PJLV nextui-c-PJLV-ikeegJh-css chart-label" style="font-size: 12px;"><svg width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: currentcolor; font-size: 14px !important;"><defs><style>.cls-1{opacity:0.3;}</style></defs><g id="Arrows"><g id="arr051-059"><g id="arr059"><path d="M6.84,15.83a1,1,0,0,1,1.23.7A2,2,0,0,0,10,18h8a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H10A2,2,0,0,0,8,8V9.41H6V8a4,4,0,0,1,4-4h8a4,4,0,0,1,4,4v8a4,4,0,0,1-4,4H10a4,4,0,0,1-3.86-2.94A1,1,0,0,1,6.84,15.83Z"></path><path class="cls-1" d="M12,9.41H2l4.29,4.3a1,1,0,0,0,1.42,0Z"></path></g></g></g></svg> ${t(
            "sell"
          )}</p></div><span aria-hidden="true" class="nextui-c-gNVTSf nextui-c-gNVTSf-hakyQ-inline-false nextui-c-gNVTSf-ijSsVeB-css"></span><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iajzRv-css nextui-grid-item" style="font-size: 12px">${parseFloat(
            (selectedInfo?.sell
              ? parseFloat(selectedInfo?.sell?.toFixed(jetton?.decimals)) *
                selectedInfo?.close
              : 0
            ).toFixed(9)
          )} TON</div></div></div><div class="nextui-c-kRHeuF nextui-c-kRHeuF-idJnZoH-css nextui-grid-item xs sm" style="padding: 0; flex-basics: 100%; max-width: 100%;"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iiwAayw-css nextui-grid-item nextui-grid-container"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-igNCIse-css nextui-grid-item" style="font-size: 12px"><p class="nextui-c-PJLV nextui-c-PJLV-ikeegJh-css chart-label" style="font-size: 12px;"><svg width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: currentcolor; font-size: 14px !important;"><defs><style>.cls-1{opacity:0.3;}</style></defs><g id="Arrows"><g id="arr041-050"><g id="arr042"><path class="cls-1" d="M21,22H12a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h9a1,1,0,0,1,1,1V21A1,1,0,0,1,21,22Zm-5.59-5,4.3-4.29a1,1,0,0,0,0-1.42L15.41,7Z"></path><path d="M15.41,11H3a1,1,0,0,0,0,2H15.41Z"></path></g></g></g></svg> ${t(
            "closeF"
          )}</p></div><span aria-hidden="true" class="nextui-c-gNVTSf nextui-c-gNVTSf-hakyQ-inline-false nextui-c-gNVTSf-ijSsVeB-css"></span><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iajzRv-css nextui-grid-item" style="font-size: 12px">${toFixed(
            (selectedInfo?.close || 0).toFixed(9)
          )}</div></div></div><div class="nextui-c-kRHeuF nextui-c-kRHeuF-idJnZoH-css nextui-grid-item xs sm" style="padding: 0; flex-basics: 100%; max-width: 100%;"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iiwAayw-css nextui-grid-item nextui-grid-container"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-igNCIse-css nextui-grid-item" style="font-size: 12px"><p class="nextui-c-PJLV nextui-c-PJLV-ikeegJh-css chart-label" style="font-size: 12px;"><svg width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: currentcolor; font-size: 14px !important;"><defs><style>.cls-1{opacity:0.3;}</style></defs><g id="Arrows"><g id="arr031-040"><g id="arr036"><rect class="cls-1" x="2" y="6" width="16" height="16" rx="1"></rect><path d="M17.76,4.83,9.29,13.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l8.46-8.47Z"></path><path class="cls-1" d="M22,9.07V3a1,1,0,0,0-1-1H14.93Z"></path></g></g></g></svg> ${t(
            "openF"
          )}</p></div><span aria-hidden="true" class="nextui-c-gNVTSf nextui-c-gNVTSf-hakyQ-inline-false nextui-c-gNVTSf-ijSsVeB-css"></span><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iajzRv-css nextui-grid-item" style="font-size: 12px">${toFixed(
            (selectedInfo?.open || 0).toFixed(9)
          )}</div></div></div><div class="nextui-c-kRHeuF nextui-c-kRHeuF-idJnZoH-css nextui-grid-item xs sm" style="padding: 0; flex-basics: 100%; max-width: 100%;"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iiwAayw-css nextui-grid-item nextui-grid-container"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-igNCIse-css nextui-grid-item" style="font-size: 12px"><p class="nextui-c-PJLV nextui-c-PJLV-ikeegJh-css chart-label" style="font-size: 12px;"><svg width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: currentcolor; font-size: 14px !important;"><defs><style>.cls-1{opacity:0.3;}</style></defs><g id="Charts_Dashboards_and_Graphs" data-name="Charts, Dashboards and Graphs"><g id="gra011-012"><g id="gra012"><polygon class="cls-1" points="8.36 14 15.59 8.84 20 9.94 20 6 16 4 9 11 5 12 5 14 8.36 14"></polygon><path d="M21,18H20V12l-4-1L9,16H6V3A1,1,0,0,0,4,3V18H3a1,1,0,0,0,0,2H4v1a1,1,0,0,0,2,0V20H21a1,1,0,0,0,0-2Z"></path></g></g></g></svg> ${t(
            "high"
          )}</p></div><span aria-hidden="true" class="nextui-c-gNVTSf nextui-c-gNVTSf-hakyQ-inline-false nextui-c-gNVTSf-ijSsVeB-css"></span><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iajzRv-css nextui-grid-item" style="font-size: 12px">${toFixed(
            (selectedInfo?.high || 0).toFixed(9)
          )}</div></div></div><div class="nextui-c-kRHeuF nextui-c-kRHeuF-idJnZoH-css nextui-grid-item xs sm" style="padding: 0; flex-basics: 100%; max-width: 100%;"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iiwAayw-css nextui-grid-item nextui-grid-container"><div class="nextui-c-kRHeuF nextui-c-kRHeuF-igNCIse-css nextui-grid-item" style="font-size: 12px"><p class="nextui-c-PJLV nextui-c-PJLV-ikeegJh-css chart-label" style="font-size: 12px;"><svg width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: currentcolor; font-size: 14px !important;"><defs><style>.cls-1{opacity:0.3;}</style></defs><g id="Charts_Dashboards_and_Graphs" data-name="Charts, Dashboards and Graphs"><g id="gra011-012"><g id="gra011"><polygon class="cls-1" points="9.41 8.84 16.64 14 20 14 20 12 16 11 9 4 5 6 5 9.94 9.41 8.84"></polygon><path d="M21,18H20V16H16L9,11l-3,.75V3A1,1,0,0,0,4,3V18H3a1,1,0,0,0,0,2H4v1a1,1,0,0,0,2,0V20H21a1,1,0,0,0,0-2Z"></path></g></g></g></svg> ${t(
            "min"
          )}</p></div><span aria-hidden="true" class="nextui-c-gNVTSf nextui-c-gNVTSf-hakyQ-inline-false nextui-c-gNVTSf-ijSsVeB-css"></span><div class="nextui-c-kRHeuF nextui-c-kRHeuF-iajzRv-css nextui-grid-item" style="font-size: 12px">${toFixed(
            (selectedInfo?.low || 0).toFixed(9)
          )}</div></div></div></div></div></div></div></div>`;

          const y = param.point.y;
          let left = param.point.x + toolTipMargin;
          if (left > ref.current!.clientWidth - toolTipWidth) {
            left = param.point.x - toolTipMargin - toolTipWidth;
          }

          let top = y + toolTipMargin;
          if (top > ref.current!.clientHeight - toolTipHeight) {
            top = y - toolTipHeight - toolTipMargin;
          }
          // toolTip.style.left = left + "px";
          // toolTip.style.top = top + "px";
          toolTip.style.left = 16 + "px";
          toolTip.style.top = 16 + "px";
        }

        setInfo(selectedInfo);
      };

      chartRef.current!.subscribeCrosshairMove(updateLegend);
      updateLegend(undefined);

      setData(results);

      if (page && page <= 1) {
        // chartRef.current!.timeScale().
        chartRef.current!.timeScale().fitContent();
        // .applyOptions({ rightOffset: globalThis.innerWidth / 20 });
      }

      chartRef.current
        ?.timeScale()
        .unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
      chartRef.current
        ?.timeScale()
        .subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
    },
  });

  // useEffect(() => {
  //   const dataCandle = data?.pages?.flat()?.map(({ time }: any) => time);

  //   if (dataCandle?.length) {
  //     const markers: any[] = [];

  //     if (swaps && swaps[jetton.id]?.swaps) {
  //       Object.keys(swaps[jetton.id].swaps).forEach((i) => {
  //         if (swaps[jetton.id].swaps[i].type === "sell") {
  //           markers.push({
  //             time: nearestDate(dataCandle, swaps[jetton.id].swaps[i].time),
  //             position: "aboveBar",
  //             color: "#ef5350",
  //             shape: "arrowDown",
  //             text: `Sell ${parseFloat(swaps[jetton.id].swaps[i].ton).toFixed(
  //               2
  //             )} TON`,
  //           });
  //         } else if (swaps[jetton.id].swaps[i].type === "buy") {
  //           markers.push({
  //             time: nearestDate(dataCandle, swaps[jetton.id].swaps[i].time),
  //             position: "belowBar",
  //             color: "#26a69a",
  //             shape: "arrowUp",
  //             text: `Buy ${parseFloat(swaps[jetton.id].swaps[i].ton).toFixed(
  //               2
  //             )} TON`,
  //           });
  //         }
  //       });
  //     }

  //     // candlestickSeries.current?.setMarkers(markers);
  //   }
  // }, [swaps, data]);

  const onVisibleLogicalRangeChanged = useCallback(
    (newVisibleLogicalRange) => {
      if (candlestickSeries.current) {
        const barsInfo = candlestickSeries.current.barsInLogicalRange(
          newVisibleLogicalRange
        );
        if (hasNextPage && barsInfo !== null && barsInfo.barsBefore < 0) {
          setLoadingPage(page + 1);
        }
      }
    },
    [page, loadingPage, isLoading, hasNextPage]
  );

  useEffect(() => {
    if (
      hasNextPage &&
      page &&
      page <= 2 &&
      page !== loadingPage &&
      !isLoading
    ) {
      setLoadingPage(page + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasNextPage]);

  useEffect(() => {
    if (
      !isLoad ||
      !chartRef.current ||
      changes?.enabled !== enabled ||
      changes?.jetton !== jetton?.id ||
      changes?.timescale !== timescale ||
      changes?.location !== location?.pathname ||
      changes?.theme !== theme?.color
    ) {
      if (chartRef.current) {
        chartRef.current.remove();
      }

      chartRef.current = createChart(ref.current!, chartOptions);

      chartRef.current.applyOptions({
        crosshair: {
          // Change mode from default 'magnet' to 'normal'.
          // Allows the crosshair to move freely without snapping to datapoints
          mode: CrosshairMode.Normal,

          // Vertical crosshair line (showing Date in Label)
          vertLine: {
            width: 8 as any,
            color: "#C3BCDB44",
            style: LineStyle.Solid,
            labelBackgroundColor: colors[theme.color].primary,
          },

          // Horizontal crosshair line (showing Price in Label)
          horzLine: {
            color: colors[theme.color].primary,
            labelBackgroundColor: colors[theme.color].primary,
          },
        },
      });

      volumeSeries.current = chartRef.current.addHistogramSeries({
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "", // set as an overlay by setting a blank priceScaleId
        // set the positioning of the volume series
      });

      volumeSeries.current.priceScale().applyOptions({
        scaleMargins: {
          top: 0.9, // highest point of the series will be 70% away from the top
          bottom: 0,
        },
      });

      if (chartRef.current) {
        candlestickSeries.current = chartRef.current.addCandlestickSeries({
          priceFormat: {
            precision: ["STYC"].includes(jetton.symbol)
              ? 9
              : jetton.decimals > 16
              ? 16
              : jetton.decimals,
            minMove: normalize(
              "1",
              ["STYC"].includes(jetton.symbol)
                ? 9
                : jetton.decimals > 16
                ? 16
                : jetton.decimals
            ),
          },
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });
      }

      volumeSeries.current!.setData([]);
      candlestickSeries.current!.setData([]);
      setData([]);
      setPage(1);
      setLoadingPage(1);
      queryClient.setQueryData(
        [
          "jetton-analytics-single",
          page,
          location.pathname,
          timescale,
          jetton.id,
        ],
        []
      );
      setIsLoad(true);
    }

    return () => {
      // if (
      //   changes?.jetton !== jetton?.id ||
      //   changes?.timescale !== timescale ||
      //   changes?.location !== location?.pathname ||
      //   changes?.theme !== theme?.color
      // ) {
      // chartRef.current?.remove();
      // }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    changes,
    jetton,
    timescale,
    location,
    chartOptions,
    theme,
    enabled,
    isLoad,
  ]);

  useEffect(() => {
    if (jettons?.length) {
      const jettonName = location.pathname.split("/").pop();

      const dataJetton = jettons.find(
        ({ symbol }) => symbol?.toUpperCase() === jettonName?.toUpperCase()
      );

      if (dataJetton) {
        setJetton(dataJetton);

        axios
          .get(
            `https://api.ton.cat/v2/contracts/jetton_minter/${dataJetton.address}/holders`
          )
          .then(({ data }) => {
            setResults(data);
          });

        axios
          .get(
            `https://tonapi.io/v1/jetton/getInfo?account=${dataJetton.address}`
          )
          .then(({ data: { metadata, total_supply, mintable } }) => {
            setMetadata({ ...metadata, total_supply, mintable });
          });
      }
    }
  }, [jettons, location.pathname, jetton]);

  // const prevJetton = useMemo(() => {
  //   const list = jettons?.filter((i) => i.verified);

  //   if (list) {
  //     const index = list.findIndex((item) => item.symbol === jetton.symbol) - 1;

  //     return index > -1 ? list[index] : list && list[list.length - 1];
  //   } else {
  //     return null;
  //   }
  // }, [jettons, jetton]);

  // const nextJetton = useMemo(
  //   () =>
  //     jettons &&
  //     jettons?.filter((i) => i.verified)[
  //       jettons
  //         ?.filter((i) => i.verified)
  //         .findIndex((item) => item.symbol === jetton.symbol) + 1
  //     ],
  //   [jettons, jetton]
  // );

  useEffect(() => {
    if (ref.current && onRef && !isLoading) {
      setTimeout(() => {
        onRef(ref);
      }, 50);
      setSaved(true);
    }
  }, [ref, isLoading, jetton, location.pathname]);

  const jettonAddress = useMemo(
    () => jetton?.address && Address.parseRaw(jetton?.address).toString(),
    [jetton]
  );

  const onCopy = () => {
    copyTextToClipboard(jettonAddress);
    toast.success(t("copied"), {
      position: toast.POSITION.TOP_RIGHT,
      theme: enabled ? "dark" : "light",
    });
  };

  const percent = useMemo(
    () =>
      !!data[data.length - 2]?.price_close
        ? ((data[data.length - 1]?.price_close -
            data[data.length - 2]?.price_close) /
            data[data.length - 2]?.price_close) *
          100
        : 0,
    [data]
  );

  useEffect(() => {
    onPercentChange(percent);
  }, [percent]);

  return onRef ? (
    <div
      ref={ref}
      key={timescale}
      style={{
        width: "700px",
        height: "400px",
        display:
          !location.pathname.includes("price") &&
          !location.pathname.includes("chart")
            ? "none"
            : undefined,
      }}
    />
  ) : (
    <Grid.Container
      gap={1}
      wrap="wrap"
      css={{ height: "fit-content", position: "sticky", top: 0 }}
    >
      <Grid xs={12} css={{ "@sm": { display: "none !important" } }}>
        <Grid.Container justify="center">
          <Grid xs={12} css={{ height: "fit-content" }}>
            <Grid.Container>
              <Grid xs={12}>
                <Card variant="flat">
                  <Card.Body css={{ p: 0, overflow: "hidden" }}>
                    <Grid.Container>
                      <Grid className="chart-table">
                        <Grid.Container gap={1} justify="space-between">
                          <Grid xs={3}>
                            <Grid.Container
                              gap={0}
                              direction="column"
                              alignItems="flex-start"
                            >
                              <Grid>
                                <Text
                                  size="0.65rem"
                                  css={{
                                    textGradient:
                                      "45deg, $primary -20%, $secondary 100%",
                                  }}
                                  className="chart-label"
                                >
                                  <GEN20
                                    style={{
                                      fill: "currentColor",
                                      fontSize: 18,
                                    }}
                                  />{" "}
                                  1 {jetton.symbol}
                                </Text>
                              </Grid>
                              <Grid
                                css={{
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {parseFloat((info?.price || 0)?.toFixed(9))}
                              </Grid>
                            </Grid.Container>
                          </Grid>
                          <Grid xs={3}>
                            <Grid.Container gap={0} direction="column">
                              <Grid>
                                <Text
                                  size="0.65rem"
                                  css={{
                                    textGradient:
                                      "45deg, $primary -20%, $secondary 100%",
                                  }}
                                  className="chart-label"
                                >
                                  <GRA04
                                    style={{
                                      fill: "currentColor",
                                      fontSize: 18,
                                    }}
                                  />
                                  {t("buy")}
                                </Text>
                              </Grid>

                              <Grid
                                css={{
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {toFixed((info?.buy || 0).toFixed(0))} TON
                              </Grid>
                            </Grid.Container>
                          </Grid>
                          <Grid xs={3}>
                            <Grid.Container gap={0} direction="column">
                              <Grid>
                                <Text
                                  size="0.65rem"
                                  css={{
                                    textGradient:
                                      "45deg, $primary -20%, $secondary 100%",
                                  }}
                                  className="chart-label"
                                >
                                  <ARR59
                                    style={{
                                      fill: "currentColor",
                                      fontSize: 18,
                                    }}
                                  />{" "}
                                  {t("sell")}
                                </Text>
                              </Grid>

                              <Grid
                                css={{
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {(info?.sell
                                  ? parseFloat(info?.sell?.toFixed(9)) *
                                    info?.close
                                  : 0
                                ).toFixed(9)}{" "}
                                TON
                              </Grid>
                            </Grid.Container>
                          </Grid>
                          <Grid xs={3}></Grid>
                          {/*   xs={4}
                            <Grid.Container gap={0}>
                              <Grid>
                                <Text
                                size="0.65rem"
                                  css={{
                                    textGradient:
                                      "45deg, $primary -20%, $secondary 100%",
                                  }}
                                  className="chart-label"
                                >
                                  <GEN02
                                    style={{
                                      fill: "currentColor",
                                      fontSize: 18,
                                    }}
                                  />{" "}
                                  {t("source")}
                                </Text>
                              </Grid>
                              <Grid>
                                <Link href="https://dedust.io/" target="_blank" css={{ fontSize: '0.65rem' }}>
                                  DeDust.io
                                </Link>
                              </Grid>
                            </Grid.Container>
                          </Grid> */}
                          <Grid xs={3}>
                            <Grid.Container gap={0} direction="column">
                              <Grid>
                                <Text
                                  size="0.65rem"
                                  css={{
                                    textGradient:
                                      "45deg, $primary -20%, $secondary 100%",
                                  }}
                                  className="chart-label"
                                >
                                  <ARR42
                                    style={{
                                      fill: "currentColor",
                                      fontSize: 18,
                                    }}
                                  />{" "}
                                  {t("close")}
                                </Text>
                              </Grid>
                              <Grid
                                css={{
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {toFixed((info?.close || 0).toFixed(9))}
                              </Grid>
                            </Grid.Container>
                          </Grid>
                          <Grid xs={3}>
                            <Grid.Container gap={0} direction="column">
                              <Grid>
                                <Text
                                  size="0.65rem"
                                  css={{
                                    textGradient:
                                      "45deg, $primary -20%, $secondary 100%",
                                  }}
                                  className="chart-label"
                                >
                                  <ARR36
                                    style={{
                                      fill: "currentColor",
                                      fontSize: 18,
                                    }}
                                  />{" "}
                                  {t("open")}
                                </Text>
                              </Grid>
                              <Grid
                                css={{
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {toFixed((info?.open || 0).toFixed(9))}
                              </Grid>
                            </Grid.Container>
                          </Grid>
                          <Grid xs={3}>
                            <Grid.Container gap={0} direction="column">
                              <Grid>
                                <Text
                                  size="0.65rem"
                                  css={{
                                    textGradient:
                                      "45deg, $primary -20%, $secondary 100%",
                                  }}
                                  className="chart-label"
                                >
                                  <GRA12
                                    style={{
                                      fill: "currentColor",
                                      fontSize: 18,
                                    }}
                                  />{" "}
                                  {t("high")}
                                </Text>
                              </Grid>

                              <Grid
                                css={{
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {toFixed((info?.high || 0).toFixed(9))}
                              </Grid>
                            </Grid.Container>
                          </Grid>
                          <Grid xs={3}>
                            <Grid.Container gap={0} direction="column">
                              <Grid>
                                <Text
                                  size="0.65rem"
                                  css={{
                                    textGradient:
                                      "45deg, $primary -20%, $secondary 100%",
                                  }}
                                  className="chart-label"
                                >
                                  <GRA11
                                    style={{
                                      fill: "currentColor",
                                      fontSize: 18,
                                    }}
                                  />{" "}
                                  {t("low")}
                                </Text>
                              </Grid>

                              <Grid
                                css={{
                                  display: "flex",
                                  alignItems: "center",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {toFixed((info?.low || 0).toFixed(9))}
                              </Grid>
                            </Grid.Container>
                          </Grid>
                        </Grid.Container>
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Grid>
      <Grid
        xs={12}
        css={{
          minHeight: "50vh",
          "@sm": {
            minHeight: "75vh",
          },
        }}
      >
        <Card variant="flat">
          <Card.Body
            css={{
              p: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate3d(-50%, -50%, 0)",
                zIndex: -1,
                filter: "opacity(0.3)",
              }}
            >
              <Grid.Container alignItems="center" wrap="nowrap">
                <Grid css={{ display: "flex", filter: "grayscale(1)" }}>
                  <ThemeSwitcher isLogo loading={isLoading || isFetching} />
                </Grid>
                <Grid>
                  <Text size={16} color="gray" weight="bold">
                    FCK.Foundation
                  </Text>
                </Grid>
              </Grid.Container>
            </div>
            <div
              ref={ref}
              key={timescale}
              style={{
                width: "100%",
                height: "100%",
                display:
                  !location.pathname.includes("price") &&
                  !location.pathname.includes("chart")
                    ? "none"
                    : undefined,
              }}
            />
            <div
              style={{
                display: !location.pathname.includes("volume")
                  ? "none"
                  : undefined,
              }}
            >
              <Volume timescale={timescale} />
            </div>
          </Card.Body>
        </Card>
      </Grid>

      <Grid xs={12}>
        <Card variant="flat">
          <Card.Body>
            {!metadata?.total_supply ? (
              <Grid.Container justify="center">
                <Grid>
                  <Loading />
                </Grid>
              </Grid.Container>
            ) : (
              <>
                <Grid.Container alignItems="center">
                  <Grid xs={12}>
                    <Grid.Container
                      alignItems="center"
                      css={{ color: "$primary", cursor: "pointer" }}
                      onClick={onCopy}
                    >
                      {jettonAddress.slice(0, 4)}
                      ...
                      {jettonAddress.slice(-4)}
                      <Spacer x={0.4} />
                      <Copy
                        style={{
                          fill: "currentColor",
                          fontSize: 18,
                        }}
                      />
                    </Grid.Container>
                  </Grid>
                  <Grid>
                    <ARR58
                      style={{
                        fill: "currentColor",
                        fontSize: 32,
                      }}
                    />
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid>
                    <Text
                      size={24}
                      css={{
                        textGradient: "45deg, $primary -20%, $secondary 100%",
                      }}
                      weight="bold"
                    >
                      {metadata?.total_supply
                        ?.slice(
                          0,
                          metadata?.total_supply.length - metadata?.decimals
                        )
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </Text>
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid>
                    <Text size={18}>{metadata?.symbol}</Text>
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid>
                    (
                    <Text size={18} b>
                      {results?.total}
                    </Text>{" "}
                    {t("holders")})
                  </Grid>
                </Grid.Container>
                <Text css={{ overflowWrap: "anywhere" }}>
                  {metadata?.description}
                </Text>
                {metadata.websites?.map((site, i) => (
                  <Link key={i} href={site} target="_blank">
                    {site}
                  </Link>
                ))}
                {metadata.social?.map((social, i) => (
                  <Link key={i} href={social} target="_blank">
                    {social}
                  </Link>
                ))}
              </>
            )}
          </Card.Body>
        </Card>
      </Grid>
      <Grid xs={12}>
        <Card variant="flat">
          <Card.Body css={{ p: 0 }}>
            <Table aria-label="Example table with static content">
              <Table.Header>
                <Table.Column>{t("address")}</Table.Column>
                <Table.Column>{jetton.symbol}</Table.Column>
              </Table.Header>
              <Table.Body>
                {results?.holders?.map((result, i) => {
                  return (
                    <Table.Row key={i}>
                      <Table.Cell css={{ overflow: "visible" }}>
                        <Link href={`/wallet/${result.holder_address}`}>
                          {infoAddress[result.holder_address] ? (
                            <Badge
                              placement="bottom-right"
                              content={infoAddress[result.holder_address].text}
                              color={infoAddress[result.holder_address].color}
                              css={{ bottom: -10 }}
                            >
                              <div className="holder-address">
                                {result.holder_address.slice(0, 4)}
                                ...
                                {result.holder_address.slice(-4)}
                              </div>
                            </Badge>
                          ) : result.holder_address ===
                            jetton?.dedust_swap_address ? (
                            <Badge
                              placement="bottom-right"
                              content={t("addressLP")}
                              color="primary"
                              css={{ bottom: -10 }}
                            >
                              <div className="holder-address">
                                {result.holder_address.slice(0, 4)}
                                ...
                                {result.holder_address.slice(-4)}
                              </div>
                            </Badge>
                          ) : (
                            <div className="holder-address">
                              {result.holder_address.slice(0, 4)}
                              ...
                              {result.holder_address.slice(-4)}
                            </div>
                          )}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        {parseFloat(
                          normalize(result.balance, jetton?.decimals).toFixed(
                            jetton?.decimals
                          )
                        ).toLocaleString()}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
              <Table.Pagination
                shadow
                noMargin
                align="center"
                rowsPerPage={5}
              />
            </Table>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  );
};

const infoAddress = {
  EQALyrWQNCxR3RFcape5ZMxClDHpySrEO93lQiaM9ZWUnAjW: {
    color: "secondary",
    text: "Development",
  },
  "EQAPbP-3ZEMDWJmhRuoy9mWq5ili0iLGyS3BBgG2kioWGkQf": {
    color: "secondary",
    text: "Marketing",
  },
};
