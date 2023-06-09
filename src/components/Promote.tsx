import {
  Badge,
  Button,
  Card,
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
import { GEN03, Payment } from "assets/icons";
import { AppContext } from "contexts";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { JettonMaster } from "ton";
import { Address } from "ton-core";
import { normalize, payJetton, whiteCoins } from "utils";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Promote: React.FC<{
  voteId?: number;
  hideTrigger?: boolean;
  processing?: Record<string, any>;
  onSuccess: (value: number) => void;
  setVoteId: (value?: number) => void;
}> = ({ hideTrigger, voteId, processing, onSuccess, setVoteId }) => {
  const { t } = useTranslation();
  const address = useTonAddress();
  const wallet = useTonWallet();
  const { jettons, client, page, setPage } = useContext(AppContext);
  const [tonConnectUi] = useTonConnectUI();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<{ id: number; amount: number }[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [isBottom, setIsBottom] = useState(false);

  const { data: dataFCK, isLoading: isLoadingJettons } = useQuery({
    queryKey: ["wallet-jettons", address],
    queryFn: async () =>
      await axios.get(`https://tonapi.io/v2/accounts/${address}/jettons`),
    enabled: !!address,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) =>
      normalize(
        response.data.balances?.find(
          ({ jetton }) => jetton.address === whiteCoins.FCK
        )?.balance,
        5
      ),
  });

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
      .slice((page - 1) * 10, 10 * page);

    if (next.length) {
      setList((prevState) => [...prevState, ...next]);
      setIsBottom(false);
    }
  }, [jettons, page]);

  useEffect(() => {
    if (!visible) {
      setSelected([]);
      setVoteId(undefined);
    }
  }, [visible]);

  useEffect(() => {
    if (voteId) {
      setVisible(true);
      setSelected([{ id: voteId, amount: 1 }]);
    }
  }, [voteId]);
  const onPromote = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const onVote = () => {
    if (!address) {
      (
        Array.from(
          document.getElementsByTagName("tc-root")[0]?.childNodes
        )[0] as any
      )?.click();
    } else {
      if (wallet) {
        const jetton = Address.parseRaw(whiteCoins["FCK"]);
        const masterContract = JettonMaster.create(jetton);
        const master = client.open(masterContract);

        master
          .getWalletAddress(Address.parseRaw(wallet.account.address))
          .then((addr) => {
            tonConnectUi
              .sendTransaction(
                payJetton({
                  selected,
                  address: addr,
                  forward: address,
                  coin: "FCK",
                  to: "EQBjTg5KAKakMQ_BT_DVkUWMGhhiqW0ADppVOLnF3m7sNv5P",
                })
              )
              .finally(() => {
                onSuccess(
                  selected.reduce((acc, curr) => (acc += curr.amount), 0)
                );
                setSelected([]);
                setVisible(false);
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
      {!hideTrigger && (
        <Button color="gradient" onPress={onPromote}>
          <Grid.Container alignItems="center">
            {!!processing?.wait ? (
              <>
                <Grid css={{ display: "flex" }}>
                  <Loading size="xs" />
                </Grid>
                <Spacer x={0.4} />
              </>
            ) : (
              <>
                <Grid css={{ display: "flex" }}>
                  <GEN03
                    style={{
                      fill: "currentColor",
                      fontSize: 18,
                    }}
                  />
                </Grid>
                <Spacer x={0.4} />
              </>
            )}
            <Grid>
              {t(processing?.wait ? "voteProcessing" : "promoteToken")}
            </Grid>
          </Grid.Container>
        </Button>
      )}
      <Modal
        closeButton
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
          <Grid.Container>
            <Grid>
              <Text size={18}>{t("promoteToken")}</Text>{" "}
            </Grid>
            <Spacer x={0.5} />
            <Grid>
              <Popover placement="top" isBordered>
                <Popover.Trigger>
                  <Button auto size="sm" css={{ minWidth: "auto" }}>
                    ?
                  </Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Text css={{ p: "$10" }}>{t("voteDisclamer")}</Text>
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
          <Grid.Container direction="column">
            <Grid>
              <Text size={16}>
                {t("promoteInfo").replace(
                  "$1",
                  moment(Date.now() + 86400 * 7).format("DD.MM.YY HH:mm")
                )}
              </Text>
            </Grid>
          </Grid.Container>
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
              ?.map((jetton) => {
                const item = selected.find(
                  ({ id, amount }) => id === jetton.id
                );

                return (
                  <Grid xs={12}>
                    <Grid.Container wrap="nowrap" alignItems="center">
                      <Grid xs={12}>
                        <Card
                          color="primary"
                          variant={
                            selected.some(({ id }) => id === jetton.id)
                              ? "bordered"
                              : undefined
                          }
                          isPressable
                          isHoverable
                          onClick={() =>
                            (item || selected.length < 4) &&
                            setSelected((prevState) =>
                              prevState.some(({ id }) => id === jetton.id)
                                ? prevState.filter((i) => i.id !== jetton.id)
                                : [...prevState, { id: jetton.id, amount: 1 }]
                            )
                          }
                        >
                          <Card.Body css={{ pl: 0, pt: "$4", pb: "$4" }}>
                            <Grid.Container
                              alignItems="center"
                              justify="space-between"
                              wrap="nowrap"
                            >
                              <Grid css={{ display: "flex" }}>
                                <User
                                  src={jetton.image}
                                  name={
                                    <div
                                      style={{
                                        maxWidth: 50,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {jetton.symbol}
                                    </div>
                                  }
                                />
                              </Grid>
                              <Grid>
                                {!item && (
                                  <Badge
                                    variant="flat"
                                    color="primary"
                                    css={{ flexWrap: "nowrap", p: "$2 $4" }}
                                  >
                                    <GEN03
                                      style={{
                                        fill: "currentColor",
                                        fontSize: 18,
                                      }}
                                    />
                                    <Spacer x={0.4} />
                                    {jetton.stats.promoting_points}
                                  </Badge>
                                )}
                              </Grid>
                            </Grid.Container>
                          </Card.Body>
                        </Card>
                      </Grid>
                      {item && (
                        <>
                          <Spacer x={0.4} />
                          <Grid>
                            <Grid.Container alignItems="center" wrap="nowrap">
                              <Grid>
                                <GEN03
                                  style={{
                                    fill: "var(--nextui-colors-primary)",
                                    fontSize: 18,
                                  }}
                                />
                              </Grid>
                              <Spacer x={0.4} />
                              <Grid>
                                <Input
                                  type="number"
                                  min={1}
                                  width="55px"
                                  value={item?.amount}
                                  onChange={(e) =>
                                    setSelected((prevState) =>
                                      prevState.map((sel, x) => ({
                                        ...sel,
                                        ...(sel.id === item.id && {
                                          amount: parseInt(
                                            e.currentTarget.value
                                          ),
                                        }),
                                      }))
                                    )
                                  }
                                />
                              </Grid>
                            </Grid.Container>
                          </Grid>
                        </>
                      )}
                    </Grid.Container>
                  </Grid>
                );
              })}
          </Grid.Container>
        </Modal.Body>
        <Modal.Footer
          css={{
            position: "sticky",
            zIndex: 2,
            bottom: 0,
            background: "var(--nextui-colors-accents0)",
          }}
        >
          <Grid.Container justify="center" alignItems="center">
            <Grid>
              <Badge>{toPay} FCK</Badge>
            </Grid>
            <Spacer x={0.4} />
            <Grid></Grid>
            <Spacer x={0.4} />
            <Grid>
              <Button
                size="sm"
                flat
                css={{ minWidth: "auto" }}
                onPress={() => (!processing?.wait ? onVote() : undefined)}
                disabled={!!wallet && (!toPay || !dataFCK || toPay > dataFCK)}
              >
                <Grid.Container alignItems="center">
                  {!!processing?.wait ? (
                    <>
                      <Grid css={{ display: "flex" }}>
                        <Loading size="xs" />
                      </Grid>
                      <Spacer x={0.4} />
                    </>
                  ) : (
                    <>
                      <Grid>
                        <Payment
                          style={{
                            fill: "currentColor",
                            fontSize: 18,
                          }}
                        />
                      </Grid>
                      <Spacer x={0.4} />
                    </>
                  )}
                  <Grid>{t(processing?.wait ? "voteProcessing" : "pay")}</Grid>
                </Grid.Container>
              </Button>
            </Grid>
            {!isLoadingJettons && !(dataFCK || 0) && (
              <>
                <Spacer x={0.4} />
                <Grid>{t("insufficientFunds")}</Grid>
              </>
            )}
          </Grid.Container>
        </Modal.Footer>
      </Modal>
    </>
  );
};
