import { useContext, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Badge,
  Button,
  Card,
  Grid,
  Popover,
  Spacer,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import axios from "libs/axios";
import { _ } from "utils";
import { useQuery } from "@tanstack/react-query";
import { GEN15 } from "assets/icons";
import { colors } from "colors";
import { AppContext } from "contexts";
import { pagination } from "..";

const RADIAN = Math.PI / 180;
const cx = 85;
const cy = 85;
const iR = 70;
const oR = 80;

const needle = (value, list, cx, cy, iR, oR, color) => {
  let total = 0;
  list.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key={value} cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path
      key={value}
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="#none"
      fill={color}
    />,
  ];
};

export const FearGreedIndex = () => {
  const { t } = useTranslation();
  // const [present] = useIonActionSheet();
  const { theme, timescale, list, page, jettons, currency } =
    useContext(AppContext);

  const pageList = useMemo(() => {
    const dataList = list?.slice((page - 1) * 15, page * 15);
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

  const totals = useMemo(() => {
    let countJetton = 0,
      countTon = 0;

    Object.keys(dataStats?.sources?.DeDust?.jettons || {}).forEach((i) => {
      dataStats?.sources?.DeDust?.jettons[i].prices.forEach((price) => {
        countJetton += _(price.pair1_volume) * _(price.price_close);
        countTon += _(price.pair2_volume);
      });
    });

    return { ton: countTon, jettons: countJetton };
  }, [dataStats]);

  const dataVolume = useMemo(() => {
    return [
      {
        name: "Sell",
        value: 25,
        color: "#F54244",
      },
      {
        name: "Sell",
        value: 20,
        color: "#f46a1b",
      },
      {
        name: "Sell",
        value: 10,
        color: "#d29902",
      },
      {
        name: "Sell",
        value: 20,
        color: "#9ebd04",
      },
      {
        name: "Buy",
        value: 25,
        color: "#1ac964",
      },
    ];
  }, []);

  return (
    <Card css={{ height: "fit-content" }}>
      <Card.Header css={{ whiteSpace: "nowrap" }}>
        <Grid.Container justify="space-between">
          <Grid>{t("fearGreedIndex")}</Grid>
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
          dflex: true,
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <ResponsiveContainer width={180} height={105}>
          <PieChart>
            <Pie
              label={false}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={dataVolume}
              cx={cx}
              cy={cy}
              innerRadius={iR}
              outerRadius={oR}
              fill={colors[theme.color].primary}
              stroke="none"
            >
              {dataVolume.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {needle(
              parseFloat(
                (
                  (totals.jettons / (totals.jettons + totals.ton)) *
                  100
                ).toFixed(2)
              ),
              dataVolume,
              cx,
              cy,
              iR,
              oR,
              colors[theme.color].primary
            )}
          </PieChart>
        </ResponsiveContainer>
      </Card.Body>
      <Card.Footer css={{ display: "flex", justifyContent: "center", pt: 0 }}>
        <Badge size="xs">
          {Math.ceil(
            (totals.jettons / (totals.jettons + totals.ton || 1)) * 100
          )}
        </Badge>
      </Card.Footer>
    </Card>
  );
};
