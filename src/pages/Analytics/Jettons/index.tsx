import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
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
  Ton,
  TransparentTon,
} from "assets/icons";
import { AppContext, JType } from "contexts";
import Skeleton from "react-loading-skeleton";
import { FJetton, Search, Token } from "components";

import { pagination } from "..";
import { toast } from "react-toastify";
import { copyTextToClipboard } from "utils";

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
      console.log(destination, source);
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

  console.log("renderList", renderList);

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
            {t("Back")}
          </Button>
        </Grid>
        <Grid>
          <Token
            index={-1}
            column={renderList?.find(({ jetton }) => jetton.id === selectedJetton.id)!}
            jetton={selectedJetton as JType}
            onPress={onPress}
            setInfo={setInfo}
            isStatic
          />
        </Grid>
        <Grid>
          <Grid.Container alignItems="center">
            <Grid xs={12}>
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
            </Grid>
            <Grid>
              <ARR58 className="text-3xl fill-current" />
            </Grid>
            <Spacer x={0.4} />
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
          </Grid.Container>
        </Grid>
        <Grid>
          <Text css={{ overflowWrap: "anywhere" }}>
            {metadata?.description}
          </Text>
        </Grid>
        <Grid>
          {metadata.websites?.map((site, i) => (
            <Link key={i} href={site} target="_blank">
              {site}
            </Link>
          ))}
        </Grid>
        <Grid>
          {metadata.social?.map((social, i) => (
            <Link key={i} href={social} target="_blank">
              {social}
            </Link>
          ))}
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
              <DragDropContext onDragEnd={onDragEnd}>
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
                      key={i}
                      column={column?.jetton?.address}
                      id={i}
                      data={{
                        address: column.jetton.address as any,
                        children: (
                          <motion.div
                            key={`${i}-${column?.jetton.symbol}`}
                            className="w-full"
                          >
                            <Token
                              index={i}
                              isDrag={isDrag}
                              column={column}
                              jetton={column.jetton as JType}
                              onPress={onPress}
                              setInfo={setInfo}
                            />
                            <Spacer y={0.4} />
                          </motion.div>
                        ),
                      }}
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
