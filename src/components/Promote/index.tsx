import {
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  Grid,
  Input,
  Loading,
  Modal,
  Popover,
  Spacer,
  Text,
  User,
} from "@nextui-org/react";
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { toast } from "react-toastify";
import { ARR09, ARR10, ARR22, Heart, Payment } from "assets/icons";
import { AppContext } from "contexts";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cookie from "react-cookies";
import { JettonMaster } from "ton";
import { Address } from "ton-core";
import { normalize, payJetton } from "utils";
import moment from "moment";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { fck } from "api";
import { OrderStatus } from "types";

import "./index.scss";

export const Promote: React.FC<{
  voteId?: number;
  hideTrigger?: boolean;
  trigger?: React.ReactNode;
  setVoteId: (value?: number) => void;
}> = ({ hideTrigger, voteId, trigger, setVoteId }) => {
  const { t } = useTranslation();
  const address = useTonAddress();
  const wallet = useTonWallet();
  const {
    jettons,
    client,
    enabled,
    page,
    setPage,
    orders,
    price,
    setOrders,
    refetchJettons,
  } = useContext(AppContext);
  const [tonConnectUi] = useTonConnectUI();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<{ id: number; amount: number }[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [isBottom, setIsBottom] = useState(false);
  const [processing, setProcessing] = useState(
    cookie.load("processing") ? (cookie.load("processing") as any) : []
  );

  useEffect(() => {
    cookie.save("processing", processing, { path: "/" });
  }, [processing]);

  const {
    data: dataOrder,
    mutate: mutateOrder,
    isLoading: isLoadingOrder,
  } = useMutation(fck.getOrder, {
    onSuccess: (response) => {
      if (response.order.status === OrderStatus.Success) {
        setVisible(false);
        toast.success(t("voteSuccess"), {
          position: toast.POSITION.TOP_RIGHT,
          theme: enabled ? "dark" : "light",
        });

        refetchJettons();

        setOrders([]);

        setProcessing([]);
      }
    },
  });

  useEffect(() => {
    const verify = setInterval(() => {
      processing.forEach((id) => {
        if (!dataOrder || dataOrder?.order.uuid !== id) {
          !isLoadingOrder && mutateOrder({ id });
        } else {
          clearInterval(verify);
        }
      });
    }, 15000);

    if (!processing.length) {
      clearInterval(verify);
      cookie.remove("processing");
      setSelected([]);
    }

    return () => clearInterval(verify);
  }, [processing, isLoadingOrder]);

  const { mutate, isLoading } = useMutation(fck.generateOrder, {
    onSuccess: (response) => {
      setOrders((prevOrders) => [...prevOrders, response.data]);
    },
  });

  const { data: dataFCK, isLoading: isLoadingJettons } = useQuery({
    queryKey: ["wallet-jettons", address],
    queryFn: async ({ signal }) =>
      await axios.get(`https://tonapi.io/v2/accounts/${address}/jettons`, {
        signal,
      }),
    enabled: !!address,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) =>
      normalize(
        response.data.balances?.find(
          ({ jetton }) => jetton.address === price.jetton.address
        )?.balance,
        5
      ),
  });

  if (orders.some((order) => moment(order.order.expires_at).isBefore())) {
    setOrders(
      orders.filter((order) => !moment(order.order.expires_at).isBefore())
    );
  }

  useEffect(() => {
    setPage(1);
  }, [wallet]);

  useEffect(() => {
    if (isBottom) {
      setPage((i) => i + 1);
    }
  }, [isBottom]);

  useEffect(() => {
    const next = jettons
      ?.sort((x, y) => y.verified - x.verified)
      ?.sort((x, y) => y.stats.promoting_points - x.stats.promoting_points)
      ?.slice((page - 1) * 9, 9 * page);

    if (next.length) {
      setList((prevState) => [...(page === 1 ? [] : prevState), ...next]);
      setIsBottom(false);
    }
  }, [jettons, page]);

  useEffect(() => {
    if (!visible) {
      setPage(1);
      setSelected([]);
      setVoteId(undefined);

      if (!orders.some((i) => i.order.status !== OrderStatus.Success)) {
        setOrders([]);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (voteId) {
      setVisible(true);
      setPage(1);
      setSelected([{ id: voteId, amount: 1 }]);
    }
  }, [voteId]);
  const onPromote = () => {
    setPage(1);

    setVisible(true);
  };
  const onClose = () => {
    setPage(1);

    setVisible(false);
  };
  const onVote = () => {
    if (!address && document.getElementsByTagName("tc-root")) {
      (
        Array.from(
          document.getElementsByTagName("tc-root")[0]?.childNodes
        )[0] as any
      )?.click();
    } else {
      if (wallet) {
        selected.forEach((curr) => {
          mutate({ amount: curr.amount, jetton_id: curr.id });
        });
      }
    }
  };

  const onPay = () => {
    if (!address && document.getElementsByTagName("tc-root")) {
      (
        Array.from(
          document.getElementsByTagName("tc-root")[0]?.childNodes
        )[0] as any
      )?.click();
    } else {
      if (wallet) {
        const jetton = Address.parseRaw(price.jetton.address);
        const masterContract = JettonMaster.create(jetton);
        const master = client.open(masterContract);

        master
          .getWalletAddress(Address.parseRaw(wallet.account.address))
          .then((addr) => {
            tonConnectUi
              .sendTransaction(
                payJetton({
                  selected: orders.map((order) => ({
                    id: order.order.uuid,
                    amount: order.order.amount,
                  })),
                  address: addr,
                  forward: address,
                  coin: "FCK",
                  to: "EQBjTg5KAKakMQ_BT_DVkUWMGhhiqW0ADppVOLnF3m7sNv5P",
                })
              )
              .finally(() => {
                setProcessing(orders.map((order) => order.order.uuid));
              });
          });
      }
    }
  };

  const onScroll = (e) => {
    setIsBottom(
      e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight
    );
  };

  const toPay = selected.reduce((acc, curr) => (acc += curr.amount), 0);

  return (
    <>
      {trigger ? (
        <div onClick={onPromote}>{trigger}</div>
      ) : (
        !hideTrigger && (
          <Button flat size="sm" onPress={onPromote} css={{ minWidth: "auto" }}>
            <Grid.Container wrap="nowrap" alignItems="center">
              {processing?.wait ? (
                <>
                  <Grid css={{ display: "flex" }}>
                    <Loading size="xs" />
                  </Grid>
                  <Spacer x={0.4} />
                </>
              ) : (
                <>
                  <Grid css={{ display: "flex" }}>
                    <Heart className="text-lg text-current text-red-500 fill-red-500" />
                  </Grid>
                  <Spacer x={0.4} />
                </>
              )}
              <Grid>
                {t(processing?.wait ? "voteProcessing" : "promoteToken")}
              </Grid>
            </Grid.Container>
          </Button>
        )
      )}
      <Modal
        closeButton
        className="promote"
        aria-labelledby="modal-title"
        open={visible}
        scroll={true}
        onClose={onClose}
        css={{ pt: 0 }}
      >
        <Modal.Header
          css={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            background: "var(--nextui-colors-accents0)",
          }}
        >
          <Grid.Container alignItems="center">
            {!!orders?.length && (
              <>
                <Grid>
                  <Button
                    flat
                    auto
                    size="xs"
                    css={{ px: "$2" }}
                    onPress={() => {
                      setOrders([]);
                      setProcessing([]);
                    }}
                  >
                    <ARR22 className="text-lg fill-current" />
                  </Button>
                </Grid>
                <Spacer x={0.5} />
              </>
            )}
            <Grid>
              <Text className="text-lg">{t("promoteToken")}</Text>{" "}
            </Grid>
            <Spacer x={0.5} />
            <Grid>
              <Popover placement="top" isBordered>
                <Popover.Trigger>
                  <Button auto flat size="xs" css={{ minWidth: "auto" }}>
                    ?
                  </Button>
                </Popover.Trigger>
                <Popover.Content>
                  <div style={{ maxWidth: 400 }}>
                    <Collapse.Group>
                      <Collapse title="" subtitle={t("promoteVote1")}>
                        <Text>
                          <Text className="text-base">
                            {t("voteDisclamer")}
                          </Text>
                        </Text>
                      </Collapse>
                      <Collapse title="" subtitle={t("promoteVote2")}>
                        <Text>
                          <Text className="text-base">
                            {t("promoteInfo").replace(
                              "$1",
                              moment(Date.now() + 86400 * 30).format(
                                "DD.MM.YY HH:mm"
                              )
                            )}
                          </Text>
                        </Text>
                      </Collapse>
                      <Collapse title="" subtitle={t("promoteVote3")}>
                        <Text>
                          <Text className="text-base">
                            {t("promoteInfo2").replace(
                              "$1",
                              moment(Date.now() + 86400 * 7).format(
                                "DD.MM.YY HH:mm"
                              )
                            )}
                          </Text>
                        </Text>
                      </Collapse>
                      <Collapse title="" subtitle={t("promoteVote3")}>
                        <Text>
                          <Text className="text-base">
                            {t("promoteInfo3").replace(
                              "$1",
                              moment(Date.now() + 86400 * 7).format(
                                "DD.MM.YY HH:mm"
                              )
                            )}
                          </Text>
                        </Text>
                      </Collapse>
                    </Collapse.Group>
                  </div>
                </Popover.Content>
              </Popover>
            </Grid>
          </Grid.Container>
        </Modal.Header>
        <Modal.Body
          onScroll={onScroll}
          css={{
            background: "var(--nextui--navbarBlurBackgroundColor)",
            backdropFilter: "saturate(180%) blur(var(--nextui--navbarBlur))",
          }}
        >
          {isLoading ? (
            <Grid.Container
              justify="center"
              alignItems="center"
              css={{ height: "100%" }}
            >
              <Grid>
                <Loading />
              </Grid>
            </Grid.Container>
          ) : orders?.length ? (
            <Grid.Container
              gap={1}
              css={{ m: "-16px", width: "calc(100% + 32px)" }}
              alignItems="flex-end"
              justify="space-between"
            >
              {orders.map((order) => (
                <>
                  <Grid xs={12}>
                    <Grid.Container
                      alignItems="flex-end"
                      justify="space-between"
                    >
                      <Grid>
                        <User
                          src={
                            jettons.find(
                              (i) =>
                                i.symbol ===
                                order.order.comment.split("Voting for ").pop()
                            )?.image
                          }
                          className="merchant-user"
                          name={`${order.order.comment}`}
                          description={`${
                            order.order.amount / (price?.price || 1)
                          } ${t("points")}`}
                        />
                      </Grid>
                    </Grid.Container>
                  </Grid>
                </>
              ))}
              <Grid
                xs={12}
                css={{
                  bg: "$accents1",
                  m: "$4 -$16 0 -$16",
                  minWidth: "calc(100% + 64px)",
                  p: "$2 $8 $2 $16",
                }}
              >
                <Grid.Container justify="space-between" alignItems="center">
                  <Grid>
                    <Grid.Container>
                      <Grid>
                        <Text size="$xs" color="var(--nextui-colors-accents7)">
                          {t("toPay")}
                        </Text>
                        <Text weight="bold">
                          {" "}
                          {orders.reduce(
                            (acc, curr) => (acc += curr.order.amount),
                            0
                          )}{" "}
                          FCK
                        </Text>
                      </Grid>
                      <Spacer x={1} />
                      <Grid>
                        <Text size="$xs" color="var(--nextui-colors-accents7)">
                          {t("expires")}
                        </Text>
                        <Text weight="bold">
                          {moment(orders[0].order.expires_at).fromNow()}
                        </Text>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                  <Grid className="flex">
                    {!!processing.length && (
                      <>
                        <Loading />
                        <Spacer x={0.4} />
                      </>
                    )}
                    <Button auto size="sm" onPress={() => onPay()}>
                      {t(processing.length ? "processing" : "pay")}
                    </Button>
                  </Grid>
                </Grid.Container>
              </Grid>
            </Grid.Container>
          ) : (
            <>
              <Grid.Container justify="space-between" gap={1}>
                <Grid xs={12}>
                  <Input
                    value={search}
                    placeholder={t("searchToken") || ""}
                    css={{ w: "100%" }}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Grid>
                {(search || voteId ? jettons : list)
                  ?.filter(({ id, address, name, symbol }) =>
                    voteId && !search
                      ? id === voteId
                      : search
                      ? address.toLowerCase().includes(search.toLowerCase()) ||
                        symbol.toLowerCase().includes(search.toLowerCase()) ||
                        name.toLowerCase().includes(search.toLowerCase())
                      : true
                  )
                  ?.map((jetton, i) => {
                    const item = selected.find(
                      ({ id /*, amount */ }) => id === jetton.id
                    );

                    return (
                      <Grid key={i} xs={6}>
                        <Grid.Container wrap="nowrap" alignItems="center">
                          <Grid xs={12}>
                            <Card
                              color="primary"
                              variant={item?.amount ? "bordered" : undefined}
                              isPressable
                              isHoverable
                              onClick={() =>
                                (item || selected.length < 4) &&
                                setSelected((prevState) =>
                                  prevState.some(({ id }) => id === jetton.id)
                                    ? prevState.filter(
                                        (i) => i.id !== jetton.id
                                      )
                                    : [
                                        ...prevState,
                                        { id: jetton.id, amount: 1 },
                                      ]
                                )
                              }
                            >
                              <Card.Body css={{ pt: "$8", pb: "$8" }}>
                                <Grid.Container
                                  alignItems="center"
                                  justify="center"
                                  direction="column"
                                >
                                  <Grid css={{ display: "flex" }}>
                                    <User
                                      src={jetton.image}
                                      name={
                                        <div
                                          className="overflow-hidden text-ellipsis whitespace-nowrap"
                                          style={{
                                            maxWidth: 50,
                                          }}
                                        >
                                          {jetton.symbol}
                                        </div>
                                      }
                                    />
                                  </Grid>
                                  <Spacer y={0.8} />
                                  <Grid className="flex flex-nowrap place-items-center justify-center">
                                    {!!item?.amount && (
                                      <>
                                        <Button
                                          css={{ minWidth: "auto" }}
                                          flat
                                          size="sm"
                                          onPress={() =>
                                            setSelected((prevState) =>
                                              jetton?.amount <= 1
                                                ? prevState.filter(
                                                    (sel) => sel.id !== item.id
                                                  )
                                                : prevState.map((sel) => ({
                                                    ...sel,
                                                    ...(sel.id === item.id && {
                                                      amount: item?.amount - 1,
                                                    }),
                                                  }))
                                            )
                                          }
                                          icon={
                                            <ARR10 className="text-lg fill-current" />
                                          }
                                        />
                                        <Spacer x={0.4} />
                                      </>
                                    )}
                                    <Badge
                                      style={{
                                        borderRadius: 8,
                                        background: "transparent",
                                      }}
                                    >
                                      <Heart className="text-lg text-red-500 fill-red-500" />
                                      <Spacer x={0.4} />
                                      <Text className="text-xs">
                                        {item?.amount
                                          ? item?.amount
                                          : jetton.stats.promoting_points}
                                      </Text>
                                    </Badge>
                                    {!!item?.amount && (
                                      <>
                                        <Spacer x={0.4} />
                                        <Button
                                          css={{ minWidth: "auto" }}
                                          flat
                                          size="sm"
                                          onPress={() =>
                                            setSelected((prevState) =>
                                              prevState.map((sel) => ({
                                                ...sel,
                                                ...(sel.id === item.id && {
                                                  amount: item?.amount + 1,
                                                }),
                                              }))
                                            )
                                          }
                                          icon={
                                            <ARR09 className="text-lg fill-current" />
                                          }
                                        />
                                      </>
                                    )}
                                  </Grid>
                                </Grid.Container>
                              </Card.Body>
                            </Card>
                          </Grid>
                        </Grid.Container>
                      </Grid>
                    );
                  })}
              </Grid.Container>
            </>
          )}
        </Modal.Body>
        {!!toPay && !orders.length && (
          <Modal.Footer
            css={{
              position: "sticky",
              zIndex: 2,
              bottom: 0,
              background: "var(--nextui-colors-accents0)",
            }}
          >
            <Grid.Container justify="space-between" alignItems="center">
              {!!toPay && (
                <>
                  <Grid>
                    <Grid.Container alignItems="center">
                      <Grid>
                        <Badge color="primary" variant="flat">
                          <Heart className="text-lg text-current text-red-500 fill-red-500" />
                          <Spacer x={0.4} />
                          {toPay} {t("Points")}
                        </Badge>
                      </Grid>
                      <Spacer x={0.4} />
                      <Grid>
                        <Text color="primary" weight="bold">
                          ~{(toPay * (price?.price || 1)).toFixed(2)} FCK
                        </Text>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                  <Spacer x={0.4} />
                </>
              )}
              <Grid></Grid>
              <Spacer x={0.4} />

              <Grid>
                {!isLoadingJettons && !(dataFCK || 0) ? (
                  t("insufficientFunds")
                ) : (
                  <Button
                    size="sm"
                    flat
                    css={{ minWidth: "auto" }}
                    onPress={() => (!processing?.wait ? onVote() : undefined)}
                    disabled={
                      !!wallet &&
                      (!toPay ||
                        !dataFCK ||
                        toPay * (price?.price || 1) > dataFCK)
                    }
                  >
                    <Grid.Container alignItems="center">
                      {processing?.wait ? (
                        <>
                          <Grid css={{ display: "flex" }}>
                            <Loading size="xs" />
                          </Grid>
                          <Spacer x={0.4} />
                        </>
                      ) : (
                        <>
                          <Grid>
                            <Payment className="text-lg text-current" />
                          </Grid>
                          <Spacer x={0.4} />
                        </>
                      )}
                      <Grid>
                        {t(processing?.wait ? "voteProcessing" : "pay")}
                      </Grid>
                    </Grid.Container>
                  </Button>
                )}
              </Grid>
            </Grid.Container>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};
