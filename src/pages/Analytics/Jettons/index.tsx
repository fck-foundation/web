/* eslint-disable @next/next/no-img-element */
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cookie from "react-cookies";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { arrayMoveImmutable } from "array-move";
import {
  Badge,
  Button,
  Card,
  Grid,
  Pagination,
  Spacer,
  User,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import axios from "libs/axios";
import { _ } from "utils/time";
import { useQuery } from "@tanstack/react-query";
import { DroppableItems } from "components/DND/DroppableItems";
import { useLocation, useNavigate } from "react-router-dom";
import { ARR20, ARR35 } from "assets/icons";
import { AppContext } from "contexts";
import Skeleton from "react-loading-skeleton";
import { useTonAddress } from "@tonconnect/ui-react";
import { pagination } from "..";
import { JettonChart } from "../Charts";

interface Props {
  isDrag: boolean;
  setIsDrag: Dispatch<SetStateAction<boolean>>;
}

export const Jettons: React.FC<Props> = ({ isDrag, setIsDrag }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const address = useTonAddress();
  // const [present] = useIonActionSheet();
  const { timescale, open, list, page, jettons, setOpen, setList, setPage } =
    useContext(AppContext);

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (
      destination?.index !== null &&
      typeof destination?.index !== undefined &&
      typeof source?.index !== undefined &&
      source?.index !== null
    ) {
      setList((prevList) =>
        arrayMoveImmutable(prevList, source.index, destination.index)
      );
    }
  };

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
      (jetton.data =
        jetton?.id &&
        dataStats?.sources?.DeDust?.jettons[
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

  return (
    <Grid.Container gap={0.4} css={{ height: "fit-content" }}>
      {/* <Grid xs={12}>
                  <Button.Group size="sm">
                    <Button>{t("tokens")}</Button>
                    <Button flat>{t("statistics")}</Button>
                  </Button.Group>
                </Grid> */}
      <Grid xs={12} css={{ display: "flex", flexDirection: "column" }}>
        <div
          className={`jettons-list ${
            location.pathname.includes("price") ||
            location.pathname.includes("volume")
              ? "side"
              : undefined
          } ${open ? "open" : ""}`}
          onClick={() => {
            setOpen(false);
            setIsDrag(false);
          }}
        >
          <div>
            <AnimatePresence>
              <DragDropContext onDragEnd={onDragEnd}>
                {renderList.map((column, i) => (
                  <DroppableItems
                    key={i}
                    column={column?.jetton?.address}
                    id={i}
                    data={
                      jettons
                        .filter(
                          (jetton) => jetton?.address === column.jetton.address
                        )
                        .map((jetton, key) => {
                          return {
                            key,
                            address: jetton.address,
                            children: (
                              <motion.div
                                key={`${key}-${jetton.symbol}`}
                                style={{ width: "100%" }}
                              >
                                <Grid className="jetton-card" xs={12}>
                                  <Card
                                    variant={
                                      location.pathname.includes(jetton.symbol)
                                        ? undefined
                                        : "bordered"
                                    }
                                    isHoverable
                                    isPressable={!isDrag}
                                    css={{
                                      bg: location.pathname.includes(
                                        jetton.symbol
                                      )
                                        ? "$border"
                                        : undefined,
                                    }}
                                    onClick={() =>
                                      !isDrag &&
                                      navigate(
                                        `/analytics/price/${jetton.symbol}`
                                      )
                                    }
                                  >
                                    <Card.Header style={{ padding: 8 }}>
                                      <Grid.Container
                                        wrap="nowrap"
                                        gap={1}
                                        alignItems="center"
                                        justify="space-between"
                                      >
                                        <Grid>
                                          <Grid.Container
                                            wrap="nowrap"
                                            gap={1}
                                            alignItems="center"
                                            css={{
                                              position: "relative",
                                            }}
                                          >
                                            {isDrag && (
                                              <Button
                                                size="sm"
                                                flat
                                                icon={
                                                  <ARR35
                                                    style={{
                                                      fill: "currentColor",
                                                      fontSize: 18,
                                                    }}
                                                  />
                                                }
                                                css={{
                                                  minWidth: "auto",
                                                  pointerEvents: "none",
                                                  position: "absolute",
                                                  zIndex: 101,
                                                  left: 12,
                                                  width: 40,
                                                  height: 40,
                                                  top: "50%",
                                                  transform:
                                                    "translate3d(0, -50%, 0)",
                                                  margin: "-2px -1px",
                                                  borderRadius: "100%",
                                                  opacity: 0.9,
                                                }}
                                              />
                                            )}
                                            <Grid
                                              css={{
                                                textAlign: "center",
                                              }}
                                            >
                                              <User
                                                bordered
                                                src={jetton.image}
                                                name={
                                                  <div>
                                                    {jetton.symbol}{" "}
                                                    {!!jetton?.verified && (
                                                      <Badge
                                                        size="xs"
                                                        css={{
                                                          p: 0,
                                                          background:
                                                            "transparent",
                                                          right: "unset",
                                                          left: "$8",
                                                        }}
                                                      >
                                                        <ARR20
                                                          style={{
                                                            fill: "var(--nextui-colors-primary)",
                                                            fontSize: 16,
                                                            borderRadius: 100,
                                                            overflow: "hidden",
                                                          }}
                                                        />
                                                      </Badge>
                                                    )}
                                                  </div>
                                                }
                                                description={(!!column
                                                  .dataJetton[
                                                  column.dataJetton.length - 1
                                                ]?.pv
                                                  ? 1 /
                                                    column.dataJetton[
                                                      column.dataJetton.length -
                                                        1
                                                    ]?.pv
                                                  : 0
                                                ).toFixed(2)}
                                                css={{ padding: 0 }}
                                              />
                                            </Grid>
                                          </Grid.Container>
                                        </Grid>
                                        <Grid
                                          className="jetton-chart"
                                          css={{
                                            padding: 0,
                                            overflow: "hidden",
                                            w: "100%",
                                          }}
                                        >
                                          {isLoadingStats ? (
                                            <Skeleton
                                              count={1}
                                              height={35}
                                              width={250}
                                            />
                                          ) : column.dataChart.length ? (
                                            <JettonChart
                                              index={column.jetton.id}
                                              data={
                                                column.dataChart.length < 2
                                                  ? [
                                                      ...column.dataChart.map(
                                                        (i) => ({
                                                          ...i,
                                                          pv: i.open,
                                                        })
                                                      ),
                                                      ...column.dataChart,
                                                    ]
                                                  : column.dataChart
                                              }
                                              height={
                                                ["FCK"].includes(jetton.symbol)
                                                  ? 36
                                                  : 36
                                              }
                                              color={
                                                !isNaN(column.percent) &&
                                                column.percent !== 0
                                                  ? column.percent > 0
                                                    ? "#1ac964"
                                                    : "#f31260"
                                                  : "gray"
                                              }
                                            />
                                          ) : null}
                                        </Grid>
                                        <Grid>
                                          {isDrag ? (
                                            <Button
                                              size="sm"
                                              flat
                                              color="error"
                                              icon={
                                                <ARR35
                                                  style={{
                                                    fill: "currentColor",
                                                    fontSize: 18,
                                                  }}
                                                />
                                              }
                                              css={{
                                                minWidth: "auto",
                                              }}
                                            />
                                          ) : (
                                            <Grid.Container
                                              direction="column"
                                              alignItems="flex-end"
                                            >
                                              <Grid>
                                                <Badge
                                                  color={
                                                    !isNaN(column.percent) &&
                                                    column.percent !== 0
                                                      ? column.percent > 0
                                                        ? "success"
                                                        : "error"
                                                      : "default"
                                                  }
                                                  size="xs"
                                                  css={{
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {!isNaN(column.percent) &&
                                                  column.percent !== 0
                                                    ? parseFloat(
                                                        Math.abs(
                                                          column.percent
                                                        ).toFixed(2)
                                                      )
                                                    : 0}{" "}
                                                  %
                                                </Badge>
                                              </Grid>
                                              <Spacer y={0.4} />
                                              <Grid
                                                css={{
                                                  display: "flex",
                                                  flexWrap: "nowrap",
                                                  whiteSpace: "nowrap",
                                                  alignItems: "center",
                                                  fontSize: 14,
                                                }}
                                              >
                                                {(column.volume || 0).toFixed(
                                                  0
                                                )}{" "}
                                                TON
                                              </Grid>
                                            </Grid.Container>
                                          )}
                                        </Grid>
                                      </Grid.Container>
                                    </Card.Header>
                                  </Card>
                                </Grid>
                                <Spacer y={0.4} />
                              </motion.div>
                            ),
                          };
                        })[0]
                    }
                  />
                ))}
              </DragDropContext>
            </AnimatePresence>
          </div>
        </div>
      </Grid>
      {Math.ceil(list.length / 15) > 1 && (
        <Grid xs={12}>
          <Pagination
            loop
            color="success"
            total={Math.ceil(list.length / 15)}
            page={page}
            onChange={setPage}
          />
        </Grid>
      )}
    </Grid.Container>
  );
};