import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import cn from "classnames";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Badge,
  Button,
  Card,
  Grid,
  Image,
  Link,
  Loading,
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
import {
  ARR01,
  ARR02,
  ARR10,
  ARR12,
  ARR20,
  ARR58,
  Copy,
  GEN03,
  Info,
  TG,
  Ton,
  TransparentTon,
  Web,
} from "assets/icons";
import { AppContext, JType } from "contexts";
import Skeleton from "react-loading-skeleton";
import { FJetton, Search, Token } from "components";

import { pagination } from "..";
import { toast } from "react-toastify";
import { arrayMove, copyTextToClipboard } from "utils";
import { usePairs } from "hooks";
import { DraggableItem } from "components/DND/DraggableItem";

const icon = {
  t: <TG className="text-2xl" />,
  ton: (
    <Image
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAMAAAAocOYLAAAAgVBMVEVHcEwAVX4AUnoAUnoAic4Ai9EASm8AUnoAhssAgcMAUnoAi9EAUnoAi9EARmkAUnoAi9EAhssATXMAhMcAYZEAUnoAc64AUnoAgMEAgcIAY5QAY5QAW4cAgcIAgcIAfr4AY5QAY5QAfb0AgcIAfb0AY5QAOVcAOVcAOVcAOVcAOVfKfszsAAAAK3RSTlMAVP9fXf8j2OQup7N2gkPs90e/0TuOE/PC/27mLpH+bP/K/549/tr/mK1hVipfTAAAAONJREFUeAHN0VVihDAAANHB3X3d7f4HLGGzaao/1cF5OHxnhmlhOzbv53rm5I4f8E6hOSZ8LHqjsWkqFyXopZmpuygvUJWmYtQBTqW89iZtgBZIJvYL/c06s2xH7YdeLCInt5XN5jWwAJbDahiGJRCIyV/ffbPZuoAtcGqNuNRu9/CxBcvhuSXBbkzzmr3mew7/zD9//nn95v2DSvnRAFyQl1jKrUK6KD2d9e9fmlmKCvd0Fl3k/2tMkbdQfj3LboBhykr0y8sDFHcpereHW3eOed1F8xAt/SmFqyd7Uzq5wTf2BFoUJwyW6Y19AAAAAElFTkSuQmCC"
      css={{ width: "$12" }}
    />
  ),
};

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
    enabled,
    jetton: selectedJetton,
    setOpen,
    setList,
    setHideList,
    setPage,
  } = useContext(AppContext);
  const [info, setInfo] = useState<string>();
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  useEffect(() => {
    if (info) {
      axios
        .get(`https://tonapi.io/v1/jetton/getInfo?account=${info}`)
        .then(({ data: { metadata, total_supply, mintable } }) => {
          setMetadata({ ...metadata, total_supply, mintable });
        });
    }
  }, [info]);

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (
      typeof destination?.index === "number" &&
      typeof source?.index === "number"
    ) {
      setList((prevList) =>
        arrayMove(prevList, source.index, destination.index)
      );
    }
  };

  const pageList = useMemo(() => {
    const dataList = list?.slice((page - 1) * 10, page * 10);
    return jettons.length
      ? dataList.map((address) => ({
          ...jettons.find((jetton) => jetton.address === address),
        }))
      : [];
  }, [jettons, list, page]);

  const pairJetton = usePairs(
    "jettons",
    pageList?.map(({ id }) => id as number) || []
  );

  const { data: dataStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["jettons-analytics", timescale, page, currency, pairJetton],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v3/analytics?pairs=${pairJetton
            .map(({ id }) => id)
            .join(",")}&period=${pagination[timescale]}&currency=${currency}`,
          { signal }
        )
        .then(({ data: { data } }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!pageList.length && !!pairJetton.length,
  });

  const renderList = useMemo(
    () =>
      pageList.map((jetton) => {
        const pairId = pairJetton.find((x) => x.jetton1_id === jetton.id)?.id;
        const dataJetton =
          (jetton.data =
            pairId &&
            dataStats &&
            dataStats[pairId]
              ?.sort(
                (x, y) =>
                  new Date(x.period).getTime() - new Date(y.period).getTime()
              )
              ?.map((item) => ({
                ...item,
                pv: item.price_close,
              }))) || [];
        const dataChart = [...dataJetton].map((d, i) => ({
          ...d,
          pv: d.pv,
        }));

        const volume = dataJetton[dataJetton.length - 1]?.pair2_volume;
        const percent =
          ((dataJetton[dataJetton.length - 1]?.pv -
            dataJetton[dataJetton.length - 3]?.pv) /
            dataJetton[dataJetton.length - 3]?.pv) *
          100;

        return { jetton, dataJetton, dataChart, percent, volume };
      }),
    [pageList, pairJetton, dataStats]
  );

  const onRemove = (jetton: JType) => {
    setList((prevList) => prevList.filter((i) => i !== jetton.address));
    setHideList((prevList) => [...prevList, jetton.address]);
  };

  const onCopy = () => {
    copyTextToClipboard(info);
    toast.success(t("copied"), {
      position: toast.POSITION.TOP_RIGHT,
      theme: enabled ? "dark" : "light",
    });
  };

  const onPress = (value) => {
    if (!isDrag) {
      navigate(`/analytics/price/${value.symbol}`);
      setInfo(value.address);
    }
  };

  return info ? (
    !metadata?.total_supply ? (
      <Grid.Container justify="center">
        <Grid>
          <Loading />
        </Grid>
      </Grid.Container>
    ) : (
      <Grid.Container direction="column" gap={0.4}>
        <Grid>
          <Button
            onPress={() => setInfo(undefined)}
            css={{
              p: 0,
              minWidth: "auto",
              bg: "transparent",
              color: "$accents9",
            }}
          >
            <ARR02 className="text-2xl fill-current" />
            <Spacer x={0.4} />
            {t("seeAll")}
          </Button>
        </Grid>
        <Grid>
          <Token
            index={-1}
            column={
              renderList?.find(
                ({ jetton }) => jetton.id === selectedJetton.id
              ) || {}
            }
            jetton={selectedJetton as JType}
            onPress={onPress}
            setInfo={setInfo}
            isStatic
          />
        </Grid>
        <Grid>
          <Grid.Container alignItems="center">
            <Grid>
              <Text
                className="text-2xl"
                css={{
                  textGradient: "45deg, $primary -20%, $secondary 100%",
                }}
                weight="bold"
              >
                {metadata?.total_supply
                  ?.slice(0, metadata?.total_supply.length - metadata?.decimals)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
              </Text>
            </Grid>
            <Spacer x={0.4} />
            <Grid>
              <Text className="text-lg">{metadata?.symbol}</Text>
            </Grid>
            <Spacer x={0.8} />
            <Grid css={{ m: "$4 0" }}>
              <Button flat auto>
                <Grid.Container
                  alignItems="center"
                  css={{ color: "$primary", cursor: "pointer" }}
                  onClick={onCopy}
                >
                  {info?.slice(0, 4)}
                  ...
                  {info?.slice(-4)}
                  <Spacer x={0.4} />
                  <Copy className="text-lg text-current" />
                </Grid.Container>
              </Button>
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid>
          <Text css={{ overflowWrap: "anywhere" }}>
            {metadata?.description}
          </Text>
        </Grid>
        <Spacer y={0.4} />
        <Grid>
          {metadata.websites?.map((site, i) => (
            <Link key={i} href={site} target="_blank">
              <Button flat size="md" css={{ minWidth: "auto" }}>
                {icon[site.split("//")[1].split(".")[0]] || (
                  <Web className="text-2xl" />
                )}{" "}
                <Spacer x={0.4} />
                {site.split("/").pop()}
              </Button>
            </Link>
          ))}
        </Grid>
        <Spacer y={0.4} />
        <Grid className="flex gap-3 w-full flex-wrap">
          {metadata.social?.map((social, i) => {
            return (
              <Link key={i} href={social} target="_blank">
                <Button size="md" css={{ minWidth: "auto" }}>
                  {icon[social.split("//")[1].split(".")[0]] || (
                    <Web className="text-2xl" />
                  )}{" "}
                  <Spacer x={0.4} />
                  {social.split("/").pop()}
                </Button>
              </Link>
            );
          })}
        </Grid>
      </Grid.Container>
    )
  ) : (
    <Grid.Container gap={0.4} css={{ height: "fit-content" }}>
      {/* <Grid xs={12}>
                  <Button.Group size="sm">
                    <Button>{t("tokens")}</Button>
                    <Button flat>{t("statistics")}</Button>
                  </Button.Group>
                </Grid> */}
      <Grid xs={12}>
        <Search isCompact />
      </Grid>
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
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {renderList?.map((column, i) => (
                          <div key={i}>
                          <Draggable
                            key={column.jetton.id}
                            draggableId={column.jetton.address}
                            index={i}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={cn("draggable", {
                                  "is-active": snapshot.isDragging,
                                })}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Token
                                  index={column.jetton.id as number}
                                  isDrag={isDrag}
                                  column={column}
                                  jetton={column.jetton as JType}
                                  onPress={onPress}
                                  setInfo={setInfo}
                                />
                              </div>
                            )}
                          </Draggable>
                          </div>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
              {Math.ceil(list.length / 10) > 1 && (
                <Pagination
                  css={{
                    m: "$8",
                    display: "block !important",
                    "@smMin": { display: "none  !important" },
                  }}
                  loop
                  color="success"
                  total={Math.ceil(list.length / 10)}
                  page={page}
                  onChange={setPage}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </Grid>
      {Math.ceil(list.length / 10) > 1 && (
        <Grid
          xs={12}
          css={{
            display: "none !important",
            "@smMin": { display: "block  !important" },
          }}
        >
          <Pagination
            loop
            color="success"
            total={Math.ceil(list.length / 10)}
            page={page}
            onChange={setPage}
          />
        </Grid>
      )}
    </Grid.Container>
  );
};
