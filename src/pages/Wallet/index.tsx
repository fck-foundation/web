import { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { Address } from "ton-core";
import { Container, Grid } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useTonAddress } from "@tonconnect/ui-react";
import axios from "axios";
import { _, normalize } from "utils";
import TonProofApi from "TonProofApi";
import { AppContext } from "contexts";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import Jettons from "./Jettons";
import Swaps from "./Swaps";

export const Wallet = () => {
  const location = useLocation();
  const tonAddress = useTonAddress();
  const { t } = useTranslation();
  const { ton, theme, jettons } = useContext(AppContext);
  const [swaps, setSwaps] = useState<Record<string, any>[]>();
  const [selected, setSelected] = useState<number>();
  const [page, setPage] = useState(1);
  const [isBalance, setIsBalance] = useState(true);
  const [tab, setTab] = useState("transactions");

  const wallet = location.pathname.split("/").pop();

  useEffect(() => {
    setPage(1);
  }, [wallet]);

  const { data, isLoading } = useQuery({
    queryKey: ["wallet-jettons", wallet],
    queryFn: async ({ signal }) =>
      await axios.get(`https://tonapi.io/v2/accounts/${wallet}/jettons`, {
        signal,
      }),
    enabled: !!wallet,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) => response.data.balances,
  });

  const { data: dataTON, isLoading: isLoadingTON } = useQuery({
    queryKey: ["wallet-ton", tonAddress],
    queryFn: async ({ signal }) =>
      await axios.get(
        `https://tonapi.io/v1/blockchain/getAccount?account=${Address.parse(
          tonAddress
        ).toRawString()}`,
        { signal }
      ),
    enabled: !!tonAddress,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) => ({
      ton: normalize(response.data.balance, 9).toFixed(2),
      usd: (
        normalize(response.data.balance, 9) *
        ton?.market_data?.current_price?.usd
      ).toFixed(2),
    }),
  });

  const dataSelected = useMemo(
    () =>
      jettons?.filter(({ address }) =>
        data?.some(({ jetton }) => jetton.address === address)
      ),
    [jettons, data]
  );

  const pageList = useMemo(() => {
    const dataList = dataSelected?.slice((page - 1) * 15, page * 15);
    return jettons?.length
      ? dataList?.map(({ address }) => ({
          ...jettons.find((jetton) => jetton.address === address),
        }))
      : [];
  }, [jettons, dataSelected, page]);

  const { data: dataChart, isLoading: isLoadingChart } = useQuery({
    queryKey: ["jettons-analytics-profile", pageList, page],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v2/analytics?jetton_ids=${pageList
            .map(({ id }) => id)
            .join(",")}&time_min=${Math.floor(
            Date.now() / 1000 - 86400 * 7
          )}&timescale=${86400}`,
          { signal }
        )
        .then(({ data: { data } }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!dataSelected?.length,
    cacheTime: 60 * 1000,
    select: (response) =>
      dataSelected.map((jetton: any, key) => {
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
              name: jettons.find(({ id }) => id === selected)?.symbol,
              pv:
                _(item.price_close) ||
                _(item.price_high) ||
                _(item.price_low) ||
                _(item.price_open),
              volume: _(item.volume),
            };
          }),
        ];
        const dataChart = [...dataJetton].filter((i) => i.pv);

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

  useEffect(() => {
    if (!selected) {
      const list = data?.filter((balance) =>
        dataChart?.find(
          ({ jetton }) =>
            (isBalance ? parseFloat(balance.balance) : true) &&
            jetton.symbol === balance.jetton.symbol
        )
      );

      if (list?.length) {
        setSelected(
          jettons?.find(({ address }) => address === list[0].jetton.address)?.id
        );
      }
    }
  }, [data, selected, jettons, dataChart]);

  const { isLoading: isLoadingSwaps } = useQuery({
    queryKey: ["wallet-swaps", selected, TonProofApi.accessToken],
    queryFn: ({ signal }) =>
      axios.get(
        `https://api.fck.foundation/api/v2/user/swaps?address=${wallet}&jetton_id=${selected}&count=100`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${TonProofApi.accessToken}`,
          },
        }
      ),
    enabled: !!TonProofApi.accessToken && !!selected,
    refetchOnMount: false,
    refetchOnReconnect: false,
    onSuccess: (response) => {
      setSwaps(response.data.data.sources.DeDust.jettons[selected!].swaps);
    },
  });

  const selectedValue = useMemo(
    () =>
      data
        ?.filter((balance) =>
          dataChart?.find(
            ({ jetton }) =>
              jetton.symbol === balance.jetton.symbol && jetton.id === selected
          )
        )
        ?.map((balance, i) =>
          normalize(balance.balance, balance.jetton.decimals)
        )
        .pop(),
    [data, selected]
  );

  return (
    <>
      <Helmet>
        <title>{t("whitePaper")}</title>
        <meta property="og:title" content={t("wallet") || ""}></meta>
        <meta property="og:image" content="/img/wallet.png"></meta>
      </Helmet>
      <Container css={{ minHeight: "70vh", p: "$8" }}>
        <Grid.Container gap={1}>
          <Grid xs={12}>
            <Header selected={selected} setSwaps={setSwaps} />
          </Grid>
          {tab === "dex" && (
            <Grid xs={12} sm={4} css={{ h: "fit-content" }}>
              {
                <Jettons
                  isBalance={isBalance}
                  page={page}
                  isLoading={!!dataSelected?.length && isLoadingChart}
                  selected={selected}
                  setSelected={setSelected}
                  setSwaps={setSwaps}
                  setPage={setPage}
                  setIsBalance={setIsBalance}
                />
              }
            </Grid>
          )}
          <Grid xs={12} sm={tab === "dex" ? 8 : 12} css={{ h: "fit-content" }}>
            <Grid.Container>
              {/* {selected && (
              <Grid xs={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    width={500}
                    height={400}
                    data={
                      dataChart?.length
                        ? dataChart
                            ?.find(({ jetton }) => jetton.id === selected)
                            ?.dataChart?.map((item, i) => ({
                              ...item,
                              pv:
                                item.pv *
                                ton?.market_data.current_price.usd *
                                selectedValue,
                              volume: i,
                            }))
                        : [{ pv: 0 }, { pv: 0 }]
                    }
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="pv"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
            )} */}
              <Grid xs={12}>
                <Swaps
                  isLoading={!!wallet && !!tonAddress && isLoading}
                  selected={selected}
                  swaps={swaps}
                  setSwaps={setSwaps}
                  tab={tab}
                  setTab={setTab}
                />
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Container>
    </>
  );
};
