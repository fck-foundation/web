/* eslint-disable @next/next/no-img-element */
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  Tooltip as ReTooltip,
} from "recharts";
import { DropResult } from "react-beautiful-dnd";
import { Button, Card, Grid, Popover, Spacer } from "@nextui-org/react";
import { _ } from "utils/time";
import { colors } from "colors";
import { GEN15 } from "assets/icons";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { pagination } from "..";
import { arrayMoveImmutable } from "array-move";
import cookie from "react-cookies";
import { TonProofApi } from "TonProofApi";
import { useTonAddress } from "@tonconnect/ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "contexts";
import { CustomTooltip } from "../Tooltip";

export const Change = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const address = useTonAddress();
  // const [present] = useIonActionSheet();
  const { theme, timescale, list, page, jettons } = useContext(AppContext);

  const pageList = useMemo(() => {
    const dataList = list.slice((page - 1) * 15, page * 15);
    return jettons.length
      ? dataList.map((address) => ({
          ...jettons.find((jetton) => jetton.address === address),
        }))
      : [];
  }, [jettons, list, page]);

  const { data: dataStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["jettons-analytics", timescale, page],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v2/analytics?jetton_ids=${pageList
            .map(({ id }) => id)
            .join(",")}&time_min=${Math.floor(
            Date.now() / 1000 - pagination[timescale] * 21
          )}&timescale=${pagination[timescale]}`,
          { signal }
        )
        .then(({ data: { data } }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!pageList.length,
  });

  const renderList = pageList.map((jetton, key) => {
    const dataJetton =
      (jetton.data = jetton?.id && dataStats?.sources?.DeDust?.jettons[
        jetton?.id?.toString()
      ]?.prices?.map((item) => ({
        ...item,
        pv: item.price_close,
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

    const volume = dataJetton[dataJetton.length - 1]?.volume;
    const percent = !!dataJetton[dataJetton.length - 1]?.pv
      ? ((dataJetton[dataJetton.length - 1]?.pv -
          dataJetton[dataJetton.length - 2]?.pv) /
          dataJetton[0]?.pv) *
        100
      : 0;

    return { jetton, dataJetton, dataChart, percent, volume };
  });

  const dataPercent = useMemo(
    () =>
      renderList
        .filter(({ percent }) => percent)
        .sort((x, y) => x.percent - y.percent)
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
                    <GEN15 style={{ fill: "currentColor", fontSize: 24 }} />
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
