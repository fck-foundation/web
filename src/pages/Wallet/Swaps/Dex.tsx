import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  Badge,
  Button,
  Card,
  Grid,
  Link,
  Loading,
  Spacer,
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
  GEN02,
  GEN04,
  GEN17,
  Tonscan,
} from "assets/icons";
import { AppContext } from "contexts";

const actions = {
  buy: <ARR09 className="text-2xl" style={{ fill: "#1ac964" }} />,
  sell: <ARR10 className="text-2xl" style={{ fill: "#f31260" }} />,
  liquidity_deposit: <ARR28 className="text-2xl" style={{ fill: "#1ac964" }} />,
  liquidity_withdraw: (
    <ARR25 className="text-2xl" style={{ fill: "#f31260" }} />
  ),
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

export const Dex: React.FC<Props> = ({ isLoading, selected, swaps }) => {
  const { t } = useTranslation();
  const { authorized, jettons } = useContext(AppContext);

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
                <GEN17 className="text-current text-2xl" />
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
                                <ARR33 className="text-current text-xl" />
                              ) : swap.type === "liquidity_withdraw" ? (
                                <ARR36 className="text-current text-xl" />
                              ) : (
                                <ARR37 className="text-current text-xl" />
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
                            <Tonscan className="text-current text-xl" />
                            <Text className="text-sm font-bold">Tonscan</Text>
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
          <GEN04 className="text-current text-xl" />
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
            <GEN02 className="text-current text-2xl" /> <Spacer x={0.4} />{" "}
            {t("walletInfo")}
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
