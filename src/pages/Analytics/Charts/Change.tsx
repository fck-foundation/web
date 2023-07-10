import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  Tooltip as ReTooltip,
} from "recharts";
import { Button, Card, Grid, Popover, Spacer } from "@nextui-org/react";
import { _ } from "utils";
import { colors } from "colors";
import { GEN15 } from "assets/icons";
import { useContext, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { pagination } from "..";
import { useTranslation } from "react-i18next";
import { AppContext } from "contexts";
import { CustomTooltip } from "../Tooltip";

export const Change = () => {
  const { t } = useTranslation();
  // const [present] = useIonActionSheet();
  const { theme, timescale, list, page, jettons, currency } =
    useContext(AppContext);

  const pageList = useMemo(() => {
    const dataList = list?.slice((page - 1) * 10, page * 10);
    return jettons.length
      ? dataList.map((address) => ({
          ...jettons.find((jetton) => jetton.address === address),
        }))
      : [];
  }, [jettons, list, page]);

  const { data: dataStats } = useQuery({
    queryKey: ["jettons-analytics", timescale, page, currency],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v3/analytics?pairs=${pageList
            .map(({ id }) => id)
            .join(",")}&period=${pagination[timescale]}&currency=${currency}`,
          { signal }
        )
        .then(({ data: { data } }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!pageList.length,
  });

  const renderList = pageList.map((jetton) => {
    const dataJetton =
      (jetton.data =
        jetton?.id &&
        dataStats[
          jetton?.id?.toString()
        ]?.prices?.map((item) => ({
          ...item,
          pv: _(item.price_close),
        }))) || [];
    const dataChart = [...dataJetton].map((d, i) => ({
      ...d,
      pv:
        i > 0 && d.pv && dataJetton[i - 1].pv && dataJetton[i - 1].pv !== d.pv
          ? dataJetton[i - 1].pv < d.pv
            ? d.pv && d.pv - 100
            : d.pv && d.pv + 100
          : dataJetton[dataJetton.length - 1].pv < d.pv
          ? d.pv && d.pv + 100 * 10
          : d.pv && d.pv - 100 * 2,
    }));

    const volume = dataJetton && dataJetton[dataJetton.length - 1]?.pair2_volume;
    const percent =
      dataJetton && !!dataJetton[dataJetton.length - 1]?.pv
        ? ((dataJetton[dataJetton.length - 1]?.pv -
            dataJetton[dataJetton.length - 3]?.pv) /
            dataJetton[0]?.pv) *
          100
        : 0;

    return { jetton, dataJetton, dataChart, percent, volume };
  });

  const dataPercent = useMemo(
    () =>
      renderList
        .filter(({ percent }) => percent)
        .sort((x, y) => x?.percent - y?.percent)
        .map(({ jetton, percent }) => ({
          name: jetton.symbol,
          uv: percent,
        })),
    [renderList]
  );

  return (
    <Card css={{ height: "fit-content" }}>
      <Card.Header>
        <Grid.Container justify="space-between">
          <Grid>{t("change")}</Grid>
          <Spacer x={0.4} />
          <Grid>
            <Popover>
              <Popover.Trigger>
                <Button
                  auto
                  flat
                  size="xs"
                  icon={
                    <GEN15 className="text-2xl text-current" />
                  }
                  css={{ minWidth: "auto", p: "$0" }}
                />
              </Popover.Trigger>
              <Popover.Content>info content</Popover.Content>
            </Popover>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body
        css={{
          pt: 0,
          pb: 0,
          overflow: "hidden",
          height: 140,
          width: 300,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart width={300} height={140} data={dataPercent}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" scale="auto" />
            <YAxis scale="auto" />
            <ReTooltip content={<CustomTooltip symbol="%" />} />
            <Area
              type="monotone"
              dataKey="uv"
              stroke={colors[theme.color].primary}
              fill={colors[theme.color].primary}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};
