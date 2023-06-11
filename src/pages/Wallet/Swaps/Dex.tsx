import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useTonAddress } from "@tonconnect/ui-react";
import TonProofApi from "TonProofApi";
import moment from "moment";
import {
  Badge,
  Button,
  Card,
  Grid,
  Link,
  Loading,
  Spacer,
  Table,
  Text,
} from "@nextui-org/react";
import {
  ARR09,
  ARR10,
  ARR25,
  ARR28,
  ARR33,
  ARR36,
  ARR37,
  ARR42,
  GEN02,
  GEN04,
  GEN17,
  Tonscan,
  Tonviewer,
} from "assets/icons";
import axios from "axios";
import { AppContext } from "contexts";
import { _ } from "utils";
import Skeleton from "react-loading-skeleton";

const actions = {
  buy: <ARR09 style={{ fill: "#1ac964", fontSize: 24 }} />,
  sell: <ARR10 style={{ fill: "#f31260", fontSize: 24 }} />,
  liquidity_deposit: <ARR28 style={{ fill: "#1ac964", fontSize: 24 }} />,
  liquidity_withdraw: <ARR25 style={{ fill: "#f31260", fontSize: 24 }} />,
};

const colorType = {
  buy: "#1ac964",
  sell: "#f31260",
  liquidity_deposit: "#1ac964",
  liquidity_withdraw: "#f31260",
};

interface Props {
  selected?: number;
  isLoading?: boolean;
  swaps?: Record<string, any>[];
  setSwaps: React.Dispatch<Record<string, any>[]>;
}

export const Dex: React.FC<Props> = ({
  isLoading,
  selected,
  swaps,
  setSwaps,
}) => {
  const tonAddress = useTonAddress();
  const { t } = useTranslation();
  const { authorized, jettons, ton } = useContext(AppContext);

  const dataJettons = useMemo(
    () =>
      jettons?.reduce((acc, curr) => {
        acc[curr.id] = curr;

        return acc;
      }, {}),
    [jettons]
  );

  return authorized || !selected ? (
    selected || !Array.isArray(swaps) || isLoading ? (
      <Grid.Container>
        {isLoading ? (
          <Grid
            xs={12}
            css={{
              display: "flex",
              justifyContent: "center",
              minHeight: 150,
              alignItems: "center",
            }}
          >
            <Loading />
          </Grid>
        ) : !swaps?.length ? (
          <Grid xs={12}>
            <Grid.Container gap={1} justify="center" alignItems="center">
              <Grid>
                <GEN17 style={{ fill: "currentColor", fontSize: 24 }} />
              </Grid>
              <Spacer x={0.4} />
              <Grid>
                <Text>{t("emptySwaps")}</Text>
              </Grid>
            </Grid.Container>
          </Grid>
        ) : (
          swaps.map((swap, i) => {
            return (
              <Grid key={i} xs={12}>
                <Grid.Container
                  alignItems="center"
                  justify="space-between"
                  css={{
                    w: "100%",
                    borderBottom:
                      i !== swaps.length - 1
                        ? "var(--nextui--navbarBorderWeight) solid var(--nextui--navbarBorderColor)"
                        : undefined,
                  }}
                >
                  <Grid>
                    <Grid.Container gap={1} alignItems="center">
                      <Grid css={{ display: "flex" }}>
                        {actions[swap.type]}
                      </Grid>
                      <Spacer x={0.4} />
                      <Grid css={{ display: "flex" }}>
                        <Badge css={{ background: colorType[swap.type] }}>
                          {t(swap.type)}
                        </Badge>
                      </Grid>
                      <Grid css={{ display: "flex" }}>
                        <Grid.Container gap={1} alignItems="center">
                          <Grid css={{ display: "flex" }}>
                            {parseFloat(swap.ton) ? (
                              <>
                                {[
                                  "buy",
                                  "liquidity_deposit",
                                  "liquidity_withdraw",
                                ].includes(swap.type)
                                  ? `${parseFloat(
                                      parseFloat(swap.ton).toFixed(2)
                                    )} TON`
                                  : swap.type === "sell"
                                  ? `${parseFloat(
                                      parseFloat(swap.jettons).toFixed(
                                        dataJettons[selected as number].decimals
                                      )
                                    )} 
                  ${dataJettons[selected as number].symbol}`
                                  : null}
                              </>
                            ) : null}
                          </Grid>
                          <Grid css={{ display: "flex" }}>
                            {parseFloat(swap.ton) ? (
                              ["sell", "buy"].includes(swap.type) ? (
                                <ARR33
                                  style={{
                                    fill: "currentColor",
                                    fontSize: 20,
                                  }}
                                />
                              ) : swap.type === "liquidity_withdraw" ? (
                                <ARR36
                                  style={{
                                    fill: "currentColor",
                                    fontSize: 20,
                                  }}
                                />
                              ) : (
                                <ARR37
                                  style={{
                                    fill: "currentColor",
                                    fontSize: 20,
                                  }}
                                />
                              )
                            ) : null}
                          </Grid>
                          <Grid css={{ display: "flex" }}>
                            {swap.type === "sell" ? (
                              `${parseFloat(
                                parseFloat(swap.ton).toFixed(2)
                              )} TON`
                            ) : (
                              <>
                                {parseFloat(
                                  parseFloat(swap.jettons).toFixed(
                                    dataJettons[selected as number].decimals
                                  )
                                )}{" "}
                                {dataJettons[selected as number].symbol}
                              </>
                            )}
                          </Grid>
                        </Grid.Container>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                  <Grid>
                    <Grid.Container gap={1} alignItems="center">
                      <Grid>
                        {moment(new Date(swap.time * 1000)).format(
                          "DD.MM.YY HH:mm"
                        )}
                      </Grid>
                      <Grid>
                        <Link>
                          <Link
                            href={`https://tonscan.org/tx/${swap.hash}`}
                            target="_blank"
                          >
                            <Tonscan
                              style={{
                                fill: "currentColor",
                                fontSize: 20,
                              }}
                            />
                            <Text size={12} css={{ fontWeight: "bold" }}>
                              Tonscan
                            </Text>
                          </Link>
                        </Link>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                </Grid.Container>
              </Grid>
            );
          })
        )}
      </Grid.Container>
    ) : (
      <Grid.Container justify="center" alignItems="center">
        <Grid>
          <GEN04 style={{ fill: "currentColor", fontSize: 20 }} />
        </Grid>
        <Spacer x={0.4} />
        <Grid>{t("emptySwaps")}</Grid>
      </Grid.Container>
    )
  ) : (
    <Grid.Container justify="center">
      <Grid xs={12} css={{ height: "fit-content" }}>
        <Card>
          <Card.Header>
            <GEN02 style={{ fill: "currentColor", fontSize: 24 }} />{" "}
            <Spacer x={0.4} /> {t("walletInfo")}
          </Card.Header>
          <Card.Body css={{ p: "$0" }}>
            <Button
              css={{ borderRadius: 0 }}
              onPress={() =>
                (
                  Array.from(
                    document.getElementsByTagName("tc-root")[0]?.childNodes
                  )[0] as any
                )?.click()
              }
            >
              {t("connectWallet")}
            </Button>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  );
};
