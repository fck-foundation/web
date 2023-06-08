import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Card,
  Grid,
  Pagination,
  Spacer,
  Table,
  Text,
  User,
} from "@nextui-org/react";
import { GEN17 } from "assets/icons";
import axios from "axios";
import { useTonAddress } from "@tonconnect/ui-react";
import { AppContext } from "contexts";
import qrcode from "qrcode-generator";
import { useQuery } from "@tanstack/react-query";
import { _, normalize } from "utils";
import { useTranslation } from "react-i18next";
import { Address, address } from "ton-core";
import Skeleton from "react-loading-skeleton";
import { TonProofApi } from "TonProofApi";

interface Props {
  isBalance: boolean;
  page: number;
  isLoading?: boolean;
  selected?: number;
  setSelected: React.Dispatch<number>;
  setSwaps: (value?: any) => void;
  setPage: (value?: any) => void;
  setIsBalance: (value?: any) => void;
}

const WalletSwaps: React.FC<Props> = ({
  isBalance,
  page,
  isLoading,
  selected,
  setSelected,
  setSwaps,
  setPage,
  setIsBalance,
}) => {
  const location = useLocation();
  const tonAddress = useTonAddress();
  const { t } = useTranslation();
  const { jettons, ton } = useContext(AppContext);

  const wallet = location.pathname.split("/").pop();

  const { data, isLoading: isLoadingJettons } = useQuery({
    queryKey: ["wallet-jettons", wallet],
    queryFn: async () =>
      await axios.get(`https://tonapi.io/v2/accounts/${wallet}/jettons`),
    enabled: !!wallet,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) => response.data.balances,
  });

  const dataSelected = useMemo(
    () =>
      jettons?.filter(({ address }) =>
        data
          ?.filter(({ balance }) => (isBalance ? parseFloat(balance) : true))
          ?.some(({ jetton }) => jetton.address === address)
      ),
    [jettons, data, isBalance]
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
    queryKey: ["jettons-analytics-profile", dataSelected, page],
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

  useEffect(() => {
    if (TonProofApi.accessToken) {
      if (selected && tonAddress) {
        axios
          .get(
            `https://api.fck.foundation/api/v2/user/swaps?address=${wallet}&jetton_id=${selected}&count=100`,
            {
              headers: {
                Authorization: `Bearer ${TonProofApi.accessToken}`,
              },
            }
          )
          .then((response) => {
            setSwaps(response.data.data.sources.DeDust.jettons[selected].swaps);
          });
      }
    }
  }, [tonAddress, selected, wallet]);

  return (
    <Card variant="bordered">
      <Card.Header>
        <Grid.Container justify="space-between" alignItems="center">
          <Grid>{t("tokens")}</Grid>
          <Grid>
            <Button.Group size="sm">
              <Button flat={isBalance} onPress={() => setIsBalance(false)}>
                {t("all")}
              </Button>
              <Button flat={!isBalance} onPress={() => setIsBalance(true)}>
                {t("isBalance")}
              </Button>
            </Button.Group>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ p: "$0" }}>
        <Table
          className="chart-table"
          compact
          css={{
            height: "auto",
            minWidth: "100%",
            p: 0,
          }}
        >
          <Table.Header>
            <Table.Column>jetton</Table.Column>
            <Table.Column>price</Table.Column>
          </Table.Header>
          <Table.Body>
            {isLoading ||
            isLoadingJettons ||
            (!!dataSelected?.length && isLoadingChart) ? (
              new Array(3).fill(null).map((_, i) => (
                <Table.Row key={i}>
                  <Table.Cell>
                    <Grid.Container>
                      <Grid>
                        <Skeleton
                          width={28}
                          height={28}
                          style={{ borderRadius: 100 }}
                        />
                      </Grid>
                      <Spacer x={0.4} />
                      <Grid>
                        <Grid.Container direction="column">
                          <Grid>
                            <Skeleton width={30} height={18} />
                          </Grid>
                          <Grid>
                            <Skeleton width={40} height={18} />
                          </Grid>
                        </Grid.Container>
                      </Grid>
                    </Grid.Container>
                  </Table.Cell>
                  <Table.Cell>
                    <Grid.Container direction="column">
                      <Grid>
                        <Skeleton width={130} height={18} />
                      </Grid>
                      <Grid>
                        <Skeleton width={130} height={18} />
                      </Grid>
                    </Grid.Container>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : !dataChart?.length ? (
              <Table.Row key="empty">
                <Table.Cell>
                  <Grid.Container justify="center">
                    <Grid>
                      <GEN17 style={{ fill: "currentColor", fontSize: 24 }} />
                    </Grid>
                    <Spacer x={0.4} />
                    <Grid>
                      <Text>{t("notFoundTokens")}</Text>
                    </Grid>
                  </Grid.Container>
                </Table.Cell>
                <Table.Cell css={{ display: "none" }}>empty</Table.Cell>
              </Table.Row>
            ) : (
              data
                ?.filter((balance) =>
                  pageList.some(
                    ({ symbol }) => symbol === balance.jetton.symbol
                  )
                )
                ?.filter((balance) =>
                  dataChart?.find(
                    ({ jetton }) => jetton.symbol === balance.jetton.symbol
                  )
                )
                ?.map((balance, i) => {
                  const info = dataChart?.find(
                    ({ jetton }) => jetton.symbol === balance.jetton.symbol
                  );
                  const lastPrice = info?.dataJetton.pop()?.pv;
                  const jCount = normalize(
                    balance.balance,
                    balance.jetton.decimals
                  );

                  return (
                    <Table.Row
                      key={i}
                      css={{
                        background:
                          selected === info?.jetton.id
                            ? "var(--nextui--navbarBorderColor)"
                            : undefined,
                      }}
                    >
                      <Table.Cell>
                        <User
                          color="primary"
                          size="sm"
                          src={balance.jetton.image}
                          name={balance.jetton.symbol}
                          description={
                            lastPrice &&
                            `$${(
                              lastPrice * ton?.market_data?.current_price?.usd
                            ).toFixed(2)}`
                          }
                          css={{ p: 0, cursor: "pointer" }}
                          onClick={() => setSelected(info?.jetton.id)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Grid.Container direction="column">
                          <Grid>{jCount.toFixed(balance.jetton.decimals)}</Grid>
                          <Grid>
                            <Text color="primary">
                              {lastPrice
                                ? `≈ $${(
                                    jCount *
                                    lastPrice *
                                    ton?.market_data?.current_price?.usd
                                  ).toFixed(2)}`
                                : ""}
                            </Text>
                          </Grid>
                        </Grid.Container>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
            )}
          </Table.Body>
        </Table>

        {Math.ceil(dataSelected?.length / 15) > 1 && (
          <Pagination
            loop
            color="success"
            css={{ m: "$4" }}
            total={Math.ceil(dataSelected?.length / 15)}
            page={page}
            onChange={setPage}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default WalletSwaps;
