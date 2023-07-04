import { Dispatch, SetStateAction, useContext, useMemo } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Badge,
  Button,
  Card,
  Grid,
  Image,
  Pagination,
  Spacer,
  Text,
  User,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import axios from "libs/axios";
import { useQuery } from "@tanstack/react-query";
import { DroppableItems } from "components/DND/DroppableItems";
import { useLocation, useNavigate } from "react-router-dom";
import { ARR10, ARR12, ARR20, GEN03 } from "assets/icons";
import { AppContext, JType } from "contexts";
import Skeleton from "react-loading-skeleton";
import { FJetton } from "components";

import { pagination } from "..";

interface Props {
  isDrag: boolean;
  setIsDrag: Dispatch<SetStateAction<boolean>>;
}

export const Jettons: React.FC<Props> = ({ isDrag }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // const [present] = useIonActionSheet();
  const {
    timescale,
    open,
    list,
    page,
    jettons,
    currency,
    jettonCurrency,
    setOpen,
    setList,
    setHideList,
    setPage,
  } = useContext(AppContext);

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (
      typeof destination?.index === "number" &&
      typeof source?.index === "number"
    ) {
      setList((prevList) => {
        prevList.splice(
          destination.index,
          0,
          prevList.splice(source.index, 1)[0]
        );

        return prevList;
      });
    }
  };

  const pageList = useMemo(() => {
    const dataList = list?.slice((page - 1) * 15, page * 15);
    return jettons.length
      ? dataList.map((address) => ({
          ...jettons.find((jetton) => jetton.address === address),
        }))
      : [];
  }, [jettons, list, page]);

  const { data: dataStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["jettons-analytics", timescale, page, currency],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v2/analytics?jetton_ids=${pageList
            .map(({ id }) => id)
            .join(",")}&time_min=${Math.floor(
            Date.now() / 1000 - pagination[timescale]
          )}&timescale=${pagination[timescale] / 4}&currency=${currency}`,
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
        i > 0 &&
        d.pv &&
        dataJetton[i - 1].value &&
        dataJetton[i - 1].value !== d.pv
          ? dataJetton[i - 1].value < d.pv
            ? d.pv && d.pv - 10
            : d.pv && d.pv + 10
          : dataJetton[dataJetton.length - 1].value < d.pv
          ? d.pv && d.pv + 10 * 10
          : d.pv && d.pv - 10 * 2,
    }));

    const volume = dataJetton[dataJetton.length - 1]?.volume;
    const percent = dataJetton[dataJetton.length - 1]?.pv
      ? ((dataJetton[dataJetton.length - 1]?.pv - dataJetton[0]?.pv) /
          dataJetton[0]?.pv) *
        100
      : 0;

    return { key, jetton, dataJetton, dataChart, percent, volume };
  });

  const onRemove = (jetton: JType) => {
    setList((prevList) => prevList.filter((i) => i !== jetton.address));
    setHideList((prevList) => [...prevList, jetton.address]);
  };

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
          }}
        >
          <div>
            <AnimatePresence>
              <DragDropContext onDragEnd={onDragEnd}>
                <Grid.Container wrap="nowrap">
                  <Grid xs={3}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("token")}
                      </div>
                    </Text>
                  </Grid>
                  <Spacer x={0.8} />
                  <Grid xs={3}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("price")} ({jettonCurrency?.symbol})
                      </div>
                    </Text>
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid xs={1}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("votes")}
                      </div>
                    </Text>
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid xs={1}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("verified")}
                      </div>
                    </Text>
                  </Grid>
                  <Spacer x={0.4} />
                  <Grid xs={3}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("analytics")}
                      </div>
                    </Text>
                  </Grid>
                </Grid.Container>
                {!renderList?.length ? (
                  <Grid.Container justify="center">
                    <Grid xs={12}>
                      <Card>
                        <Card.Body>
                          <Grid.Container justify="center" alignItems="center">
                            <GEN03
                              className="text-lg"
                              style={{
                                fill: "var(--nextui-colors-primary)",
                              }}
                            />
                            <Spacer x={0.4} /> {t("empty")}
                          </Grid.Container>
                        </Card.Body>
                      </Card>
                    </Grid>
                  </Grid.Container>
                ) : (
                  renderList?.map((column, i) => (
                    <DroppableItems
                      key={column?.jetton?.address}
                      column={column?.jetton?.address}
                      id={column?.jetton?.id || i}
                      data={
                        jettons
                          .filter(
                            (jetton) =>
                              jetton?.address === column.jetton.address
                          )
                          .map((jetton, key) => {
                            return {
                              key,
                              address: jetton.address,
                              children: (
                                <motion.div
                                  key={`${key}-${jetton.symbol}`}
                                  className="w-full"
                                >
                                  <Grid className="jetton-card" xs={12}>
                                    <Card
                                      className="card"
                                      variant={
                                        location.pathname.includes(
                                          jetton.symbol
                                        )
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
                                      <Card.Header style={{ padding: 0 }}>
                                        <Grid.Container
                                          wrap="nowrap"
                                          justify="space-between"
                                          alignItems="center"
                                        >
                                          <Grid xs={3}>
                                            <Grid.Container
                                              wrap="nowrap"
                                              alignItems="center"
                                            >
                                              <Grid css={{ pl: "$4" }}>
                                                <Image
                                                  src={
                                                    column?.jetton?.image || ""
                                                  }
                                                  width={24}
                                                  className="rounded-full"
                                                />
                                              </Grid>
                                              <Spacer x={0.4} />
                                              <Grid
                                                css={
                                                  {
                                                    // transform: 'translate3d(-50%, 0, 0)'
                                                  }
                                                }
                                              >
                                                <Text>
                                                  <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                                                    {column?.jetton?.symbol}
                                                  </div>
                                                </Text>
                                              </Grid>
                                            </Grid.Container>
                                          </Grid>
                                          <Spacer x={0.8} />
                                          <Grid xs={3}>
                                            <Text className="overflow-hidden whitespace-nowrap text-ellipsis text-sm">
                                              {parseFloat(
                                                parseFloat(
                                                  column?.dataJetton[
                                                    column?.dataJetton?.length -
                                                      1
                                                  ]?.pv || "0"
                                                ).toFixed(
                                                  column?.jetton?.decimals
                                                )
                                              )}
                                            </Text>
                                          </Grid>
                                          <Spacer x={0.4} />
                                          <Grid xs={1}>
                                            <Badge
                                              size="xs"
                                              variant="flat"
                                              color="primary"
                                              css={{
                                                flexWrap: "nowrap",
                                                p: "$0",
                                                cursor: "pointer",
                                                background: "transparent",
                                                borderColor:
                                                  "transparent !important",
                                                color: "$primary",
                                              }}
                                              // onClick={(e) => {
                                              //   e.stopPropagation();
                                              //   e.preventDefault();
                                              //   setVoteId(id);
                                              // }}
                                            >
                                              <GEN03 className="text-xs fill-current" />
                                              <Spacer x={0.2} />
                                              {column.jetton?.stats
                                                ?.promoting_points || 0}
                                            </Badge>
                                          </Grid>
                                          <Spacer x={0.4} />
                                          <Grid xs={1}>
                                            <Badge
                                              size="xs"
                                              css={{
                                                p: 0,
                                                background: column.jetton
                                                  .verified
                                                  ? "var(--nextui-colors-primary)"
                                                  : "var(--nextui-colors-accents3)",
                                                right: "unset",
                                                left: "$2",
                                              }}
                                            >
                                              {column.jetton.verified ? (
                                                <ARR12
                                                  className="text-base rounded-full overflow-hidden"
                                                  style={{
                                                    fill: "var(--nextui-colors-accents0)",
                                                  }}
                                                />
                                              ) : (
                                                <ARR10
                                                  className="text-base rounded-full overflow-hidden"
                                                  style={{
                                                    fill: "var(--nextui-colors-accents0)",
                                                  }}
                                                />
                                              )}
                                            </Badge>
                                          </Grid>
                                          <Spacer x={0.4} />
                                          <Grid xs={3}>
                                            <Grid.Container className="relative">
                                              <Grid xs={12}>
                                                <FJetton
                                                  index={i}
                                                  data={
                                                    column.dataChart?.length > 1
                                                      ? column.dataChart
                                                      : [{ pv: 0 }, { pv: 0 }]
                                                  }
                                                  height={40}
                                                  color={
                                                    !isNaN(column.percent) &&
                                                    column.percent !== 0
                                                      ? column.percent > 0
                                                        ? "#1ac964"
                                                        : "#f31260"
                                                      : "gray"
                                                  }
                                                />
                                              </Grid>
                                              <Grid
                                                css={{
                                                  position: "absolute",
                                                  left: "50%",
                                                  top: "50%",
                                                  transform:
                                                    "translate3d(-50%, -50%, 0)",
                                                }}
                                              >
                                                <Badge
                                                  size="xs"
                                                  css={{
                                                    background:
                                                      !isNaN(column.percent) &&
                                                      column.percent !== 0
                                                        ? column.percent > 0
                                                          ? "#1ac964"
                                                          : "#f31260"
                                                        : "gray",
                                                    border: "none",
                                                    p: "2px 4px",
                                                  }}
                                                >
                                                  {(
                                                    column.percent || 0
                                                  )?.toFixed(2)}
                                                  %
                                                </Badge>
                                              </Grid>
                                            </Grid.Container>
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
                  ))
                )}
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
