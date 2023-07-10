import { useContext, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from "recharts";
import { Button, Card, Grid, Popover, Spacer } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import axios from "libs/axios";
import { useQuery } from "@tanstack/react-query";
import { GEN15 } from "assets/icons";
import { colors } from "colors";
import { AppContext } from "contexts";
import { CustomTooltip } from "../Tooltip";
import { pagination } from "..";

export const Transactions = () => {
  const { t } = useTranslation();
  // const [present] = useIonActionSheet();
  const { theme, timescale, page, list, jettons } = useContext(AppContext);

  const pageList = useMemo(() => {
    const dataList = list?.slice((page - 1) * 15, page * 15);
    return jettons.length
      ? dataList.map((address) => ({
          ...jettons.find((jetton) => jetton.address === address),
        }))
      : [];
  }, [jettons, list, page]);

  const { data: transactions } = useQuery({
    queryKey: ["analytics-transactions", timescale, page],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v2/analytics/swaps/count?jetton_ids=${pageList
            .map(({ id }) => id)
            .join(",")}&time_min=${Math.floor(
            Date.now() / 1000 - pagination[timescale]
          )}`,
          { signal }
        )
        .then(({ data: { data } }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!pageList.length,
  });

  const dataTransactions = Object.keys(
    transactions?.sources?.DeDust?.jettons || {}
  )
    ?.filter((jetton) => transactions?.sources?.DeDust?.jettons[jetton]?.count)
    .map((id) => ({
      name: pageList.find((jetton) => jetton.id === parseInt(id))?.symbol,
      count: transactions?.sources?.DeDust?.jettons[id].count,
    }))
    .sort((x, y) => x.count - y.count)
    ?.slice(-15);

  return (
    <Card css={{ height: "fit-content" }}>
      <Card.Header>
        <Grid.Container justify="space-between">
          <Grid>{t("transactionsCount")}</Grid>
          <Spacer x={0.4} />
          <Grid>
            <Popover>
              <Popover.Trigger>
                <Button
                  auto
                  flat
                  size="xs"
                  icon={<GEN15 className="text-2xl text-current" />}
                  css={{ minWidth: "auto", p: "$0" }}
                />
              </Popover.Trigger>
              <Popover.Content>info content</Popover.Content>
            </Popover>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ pt: 0, pb: 0, overflow: "hidden" }}>
        <ResponsiveContainer width={300} height={140}>
          <ComposedChart layout="vertical" data={dataTransactions}>
            <XAxis type="category" className="text-sm" />
            <YAxis dataKey="name" type="category" scale="auto" className="text-sm" />
            <Bar
              dataKey="count"
              barSize={5}
              fill={colors[theme.color].primary}
            />
            <Tooltip content={<CustomTooltip decimals={0} color="warning" />} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};
