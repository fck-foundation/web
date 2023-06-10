/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import cookie from "react-cookies";
import {
  ResponsiveContainer,
  RadialBarChart,
  Tooltip,
  RadialBar,
} from "recharts";
import { Button, Card, Grid, Popover, Spacer } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import axios from "libs/axios";
import { _ } from "utils";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "contexts";
import TonProofApi, {  } from "TonProofApi";
import { useTonAddress } from "@tonconnect/ui-react";
import { pagination } from "..";
import { GEN15 } from "assets/icons";
import { CustomTooltip } from "../Tooltip";

export const Volume = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const address = useTonAddress();
  // const [present] = useIonActionSheet();
  const { theme, timescale, page, jettons, list, setList, setJettons } =
    useContext(AppContext);
  const [isInformed, setIsInformed] = useState(
    cookie.load("informed") === "true" ? true : false
  );

  useEffect(() => {
    cookie.save("informed", JSON.stringify(isInformed), { path: "/" });
  }, [isInformed]);

  useEffect(() => {
    cookie.save("tokens", list, { path: "/" });
  }, [list]);

  useEffect(() => {
    cookie.save("timescale", timescale, { path: "/" });
  }, [timescale]);

  useEffect(() => {
    if (
      !location.pathname.includes("price") &&
      !location.pathname.includes("volume")
    ) {
      navigate("/analytics/price/FCK");
    }
  }, [location.pathname]);

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

  const dataVolume = useMemo(() => {
    return [
      {
        name: "Sell",
        value: 25,
        color: "#f31260",
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

  const dataPie = useMemo(() => {
    const dailyVolume = Object.keys(dataStats?.sources?.DeDust?.jettons || {})
      .map((jettonId, i) => {
        return {
          name: pageList.find(({ id }) => parseInt(jettonId) === id)?.symbol,
          pv: dataStats.sources.DeDust.jettons[jettonId].prices.reduce(
            (acc, curr) => (acc += curr.volume),
            0
          ),
        };
      })
      .sort((x, y) => y.pv - x.pv)
      .map((item, i) => {
        const color =
          dataVolume[
            i < 3
              ? dataVolume.length - 1
              : i < 6
              ? dataVolume.length - 2
              : i < 9
              ? dataVolume.length - 3
              : dataVolume.length - 4
          ].color;
        return {
          ...item,
          fill: `${color}`,
        };
      });
    return {
      top: dailyVolume.slice(0, 9),
      others: dailyVolume.slice(9, dailyVolume.length - 1),
    };
  }, [dataStats, theme]);

  return (
    <Card css={{ height: "fit-content", overflow: "visible", zIndex: 2 }}>
      <Card.Header>
        <Grid.Container justify="space-between">
          <Grid>{t("volume")}</Grid>
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
      <Card.Body css={{ pt: 0, pb: 0, overflow: "visible" }}>
        <ResponsiveContainer width={250} height={140}>
          <RadialBarChart
            cx="20%"
            cy="70%"
            innerRadius="0%"
            outerRadius="300%"
            barSize={10}
            data={[
              ...dataPie.top,
              dataPie.others.reduce((acc, curr) => {
                acc.name = t("others");
                acc.pv = (acc.pv || 0) + curr.pv;
                acc.fill = curr.fill;

                return acc;
              }, {} as any),
            ]}
            style={{ marginTop: -10 }}
          >
            <RadialBar
              startAngle={15}
              dataKey="pv"
              label={{
                fontSize: 12,
                dataKey: "name",
                position: "end",
              }}
            />
            <Tooltip content={<CustomTooltip symbol="TON" />} />
          </RadialBarChart>
          {/* <PieChart width={120} height={120}>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={(args) =>
                          renderActiveShape({
                            ...args,
                            color: colors[theme.color],
                          })
                        }
                        data={dataPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={60}
                        stroke="none"
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                      />
                    </PieChart> */}
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};
