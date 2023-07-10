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
import Swaps from "./Swaps";
import { usePairs } from "hooks";

export const Wallet = () => {
  const location = useLocation();
  const tonAddress = useTonAddress();
  const { t } = useTranslation();
  const { ton, jettons, currency, walletJettons, isLoadingWalletJettons } =
    useContext(AppContext);
  const [swaps, setSwaps] = useState<Record<string, any>[]>();
  const [selected, setSelected] = useState<number>();
  const [page, setPage] = useState(1);
  const [isBalance, setIsBalance] = useState(true);
  const [tab, setTab] = useState("transactions");

  const wallet = location.pathname.split("/").pop();

  useEffect(() => {
    setPage(1);
  }, [wallet]);

  useQuery({
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
        walletJettons?.some(({ jetton }) => jetton.address === address)
      ),
    [jettons, walletJettons]
  );

  const pageList = useMemo(() => {
    const dataList = dataSelected?.slice((page - 1) * 10, page * 10);
    return jettons?.length
      ? dataList?.map(({ address }) => ({
          ...jettons.find((jetton) => jetton.address === address),
        }))
      : [];
  }, [jettons, dataSelected, page]);

  const pairsWallet = usePairs(
    "wallet",
    pageList.map(({ id }) => id as number)
  );

  const { data: dataChart, isLoading: isLoadingChart } = useQuery({
    queryKey: [
      "jettons-analytics-profile",
      pageList,
      page,
      currency,
      pairsWallet,
    ],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v3/analytics?pairs=${pairsWallet
            .map(({ id }) => id)
            .join(",")}&period=d1&currency=${currency}`,
          { signal }
        )
        .then(({ data: { data } }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!dataSelected?.length && !!pairsWallet.length,
    cacheTime: 60 * 1000,
    select: (response) =>
      dataSelected.map((jetton: any) => {
        const id = pairsWallet
          ?.find(
            ({ jetton1_id }) => jetton1_id.toString() === jetton.id.toString()
          )
          ?.id?.toString() as string;
        jetton.data = response[id] || [];
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
          ...((jetton.data || [])?.map((item) => ({
            name: jettons.find(({ id }) => id === selected)?.symbol,
            pv:
              _(item.price_close) ||
              _(item.price_high) ||
              _(item.price_low) ||
              _(item.price_open),
            volume: _(item.pair2_volume),
          })) as any),
        ];
        const dataChart = [...dataJetton].filter((i) => i.pv);

        const volume = [...dataJetton].reduce(
          (acc, i) => (acc += i?.volume),
          0
        );
        const percent = dataJetton[dataJetton.length - 1]?.pv
          ? ((dataJetton[dataJetton.length - 1]?.pv - dataJetton[0]?.pv) /
              dataJetton[0]?.pv) *
            100
          : 0;

        return { jetton, dataJetton, dataChart, percent, volume };
      }),
  });

  useEffect(() => {
    if (!selected) {
      const list = walletJettons?.filter((balance) =>
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
  }, [walletJettons, selected, jettons, dataChart]);

  useQuery({
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
      selected &&
        setSwaps(response.data.data.sources.DeDust.jettons[selected].swaps);
    },
  });

  return (
    <>
      <Helmet>
        <title>{t("wallet")}</title>
        <meta property="og:title" content={t("wallet") || ""}></meta>
        <meta property="og:image" content="/img/wallet.png"></meta>
      </Helmet>
      <Container md css={{ minHeight: "70vh", py: "$2", px: "$4" }}>
        <Grid.Container gap={1}>
          <Grid xs={12}>
            <Header selected={selected} setSwaps={setSwaps} />
          </Grid>
          <Grid xs={12} css={{ h: "fit-content" }}>
            <Grid.Container gap={0}>
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
                  isBalance={isBalance}
                  isLoading={
                    !!wallet && (isLoadingWalletJettons || isLoadingChart)
                  }
                  selected={selected}
                  swaps={swaps}
                  setSwaps={setSwaps}
                  tab={tab}
                  page={page}
                  setTab={setTab}
                  dataSelected={dataSelected}
                  setSelected={setSelected}
                  setPage={setPage}
                  setIsBalance={setIsBalance}
                />
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Container>
    </>
  );
};
