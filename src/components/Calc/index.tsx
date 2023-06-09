import { Key, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Spacer,
  Input,
  Dropdown,
  Button,
  Text,
  Badge,
  Loading,
} from "@nextui-org/react";
import cookie from "react-cookies";
import { useQuery } from "@tanstack/react-query";
import { Address } from "ton-core";
import axios from "axios";
import { AppContext } from "contexts";
import { TimeScale } from "pages";
import { calculatePriceImpact, normalize } from "utils";
import { ARR58 } from "assets/icons";

export const Calc: React.FC = () => {
  const { t } = useTranslation();
  const { ton, jettons } = useContext(AppContext);

  const [from, setFrom] = useState<Key>("TON");
  const [to, setTo] = useState<Key>("SCALE");

  const [valueX, setValueX] = useState("1");
  const [valueY, setValueY] = useState("1");

  const listVerified = useMemo(
    () =>
      [...(jettons || [])]
        ?.filter((i) => i.verified)
        ?.sort((x, y) => y.stats.promoting_points - x.stats.promoting_points)
        .slice(0, 14),
    [jettons]
  );

  const jetton = listVerified.find((i) =>
    from !== "TON" ? i.symbol === from : i.symbol === to
  );

  const { data, isLoading } = useQuery({
    queryKey: ["analytics-calc"],
    queryFn: ({ signal }) => {
      return axios
        .get(`https://api.dedust.io/v2/pools`, { signal })
        .then(({ data }) => data);
    },
  });

  const priceImpact = useMemo(() => {
    const dedust = data?.find(
      ({ address }) => address === jetton?.dedust_lp_address
    );
    const tradeFee = parseFloat(dedust?.tradeFee) / 100;
    const liquidityTON = normalize(dedust?.reserves[0]?.toString(), 9);
    const liquidityJetton = normalize(
      dedust?.reserves[1]?.toString(),
      jetton?.decimals || 9
    );

    const amountTON = parseFloat(from === "TON" ? valueX : valueY);

    return {
      liquidityJetton,
      liquidityTON,
      priceImpact: calculatePriceImpact(
        liquidityTON,
        liquidityJetton,
        amountTON,
        tradeFee
      ),
      tradeFee,
    };
  }, [data, valueX, valueY, from, jetton]);

  const displayCalcValue = useMemo(() => {
    const val = (
      (ton?.market_data?.current_price?.usd || 1) *
      (from === "TON" ? parseInt(valueX) : parseInt(valueY))
    ).toFixed(2);

    return parseFloat(
      (!isNaN(parseFloat(val))
        ? parseFloat(val) - 0.01 * parseFloat(from === "TON" ? valueX : valueY)
        : 0
      ).toFixed(9)
    );
  }, [ton, valueX, valueY, from, to]);

  const onSwap = () => {
    setTo(from);
    setFrom(to);
  };

  const dataJettons = useMemo(
    () =>
      jettons
        ?.filter((i) => i.verified)
        .slice(0, 14)
        ?.reduce((acc, curr) => {
          acc[curr.symbol] = curr;

          return acc;
        }, {}) || [],
    [jettons]
  );

  useEffect(() => {
    if (data) {
      const val =
        to === "TON"
          ? parseInt(valueX) *
            (priceImpact.liquidityTON / priceImpact.liquidityJetton || 1)
          : parseInt(valueX) /
            (priceImpact.liquidityTON / priceImpact.liquidityJetton || 1);

      setValueY((val - (val / 100) * priceImpact.priceImpact).toString());
    }
  }, [data, valueX, from, to, priceImpact]);

  return (
    <>
      <Grid.Container direction="column">
        <Grid>
          <Grid.Container justify="space-between">
            <Grid>
              <Text
                size={32}
                css={{
                  textGradient: "45deg, $primary -20%, $secondary 50%",
                  marginTop: -16,
                  lineHeight: 1,
                  pr: 130,
                }}
                weight="bold"
              >
                {t("buyTrade")}
              </Text>
              <Spacer y={0.5} />
              <Text
                size={32}
                color="light"
                weight="bold"
                css={{
                  marginTop: -16,
                }}
              >
                TON network
              </Text>
            </Grid>
          </Grid.Container>
        </Grid>
        <Spacer y={1} />
        <Grid>
          <Grid.Container
            wrap="nowrap"
            alignItems="center"
            justify="space-between"
          >
            <Grid>
              <Grid.Container gap={1} wrap="wrap" css={{ width: "auto" }}>
                <Grid>
                  <Input
                    value={!isNaN(parseFloat(valueX)) ? valueX : ""}
                    clearable
                    underlined
                    color="primary"
                    labelPlaceholder={t("send") || ""}
                    width="75px"
                    size="sm"
                    onChange={(e) => {
                      setValueX(e.target.value);
                      setValueY(
                        (to === "TON"
                          ? parseInt(e.target.value) *
                            (data[dataJettons[from].id]?.price || 1)
                          : parseInt(e.target.value) /
                            (data[dataJettons[to].id]?.price || 1)
                        ).toString()
                      );
                    }}
                  />
                </Grid>

                <Grid>
                  {from === "TON" ? (
                    <Badge isSquared color="primary" variant="bordered">
                      {from}
                    </Badge>
                  ) : (
                    <Dropdown>
                      <Dropdown.Button color="gradient" size="sm">
                        {from}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Static Actions"
                        onAction={setFrom}
                      >
                        {[
                          ...(to !== "TON" && from !== "TON"
                            ? [{ symbol: "TON" }]
                            : []),
                          ...(listVerified || []),
                        ]
                          ?.filter(({ symbol }) => symbol !== from)
                          ?.map(({ symbol }) => (
                            <Dropdown.Item key={symbol}>{symbol}</Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Grid>
              </Grid.Container>
            </Grid>
            <Grid>
              <Button
                flat
                size="sm"
                css={{ minWidth: "auto", p: 4 }}
                onPress={onSwap}
              >
                <ARR58
                  style={{
                    fill: "currentColor",
                    fontSize: 32,
                  }}
                />
              </Button>
            </Grid>
            <Grid>
              <Grid.Container
                gap={1}
                wrap="wrap"
                css={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Grid>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <Input
                      value={!isNaN(parseFloat(valueY)) ? valueY : ""}
                      clearable
                      underlined
                      color="primary"
                      labelPlaceholder={t("get") || ""}
                      width="75px"
                      size="sm"
                      onChange={(e) => {
                        setValueY(e.target.value);
                      }}
                    />
                  )}
                </Grid>

                <Grid>
                  {to === "TON" ? (
                    <Badge isSquared color="primary" variant="bordered">
                      {to}
                    </Badge>
                  ) : (
                    <Dropdown>
                      <Dropdown.Button color="gradient" size="sm">
                        {to}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Static Actions"
                        onAction={setTo}
                      >
                        {[
                          ...(to !== "TON" && from !== "TON"
                            ? [{ symbol: "TON" }]
                            : []),
                          ...(listVerified || []),
                        ]
                          ?.filter(({ symbol }) => symbol !== to)
                          ?.map(({ symbol }) => (
                            <Dropdown.Item key={symbol}>{symbol}</Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Grid>
              </Grid.Container>
            </Grid>
          </Grid.Container>
        </Grid>
        <Spacer x={0.4} />
        <Grid>
          <Grid.Container>
            <Grid xs={12}>
              <Grid.Container justify="space-between">
                <Grid>{t("rate")}</Grid>
                <Grid>
                  1 {from === "TON" ? to : from} ≈{" "}
                  {parseFloat(
                    (
                      displayCalcValue /
                        ton?.market_data?.current_price?.usd /
                        parseFloat(from === "TON" ? valueY : valueX) || 0
                    ).toFixed(9)
                  )}{" "}
                  TON
                </Grid>
              </Grid.Container>
            </Grid>
            <Grid xs={12}>
              <Grid.Container justify="space-between">
                <Grid>{t("networkFee")}</Grid>
                <Grid>⋜ {0.01} TON</Grid>
              </Grid.Container>
            </Grid>
            <Grid xs={12}>
              <Grid.Container justify="space-between">
                <Grid>{t("exchangeFee")}</Grid>
                <Grid>≈ {priceImpact.tradeFee} TON</Grid>
              </Grid.Container>
            </Grid>
            <Grid xs={12}>
              <Grid.Container justify="space-between">
                <Grid>{t("priceImpact")}</Grid>
                <Grid
                  css={{
                    color:
                      priceImpact.priceImpact >= 2 &&
                      priceImpact.priceImpact <= 3
                        ? "$warning"
                        : priceImpact.priceImpact >= 2 &&
                          priceImpact.priceImpact > 3
                        ? "$error"
                        : "$success",
                  }}
                >
                  ≈ {priceImpact.priceImpact || 0}%
                </Grid>
              </Grid.Container>
            </Grid>
          </Grid.Container>
        </Grid>
        <Spacer x={0.4} />
        <Grid css={{ w: "auto" }}>
          <Grid.Container alignItems="center" justify="flex-end">
            <Grid xs={12}>
              <Button
                flat
                color="secondary"
                css={{
                  minWidth: "100%",
                  overflow: "visible",
                }}
                onPress={() =>
                  globalThis.open(
                    `https://dedust.io/swap/${
                      from !== "TON"
                        ? Address.parseRaw(dataJettons[from].address).toString()
                        : "TON"
                    }/${
                      to !== "TON"
                        ? Address.parseRaw(dataJettons[to].address).toString()
                        : "TON"
                    }`,
                    "_blank"
                  )
                }
                disabled={displayCalcValue < 0}
              >
                {t("swapFor")}
                <Spacer x={0.4} />
                {displayCalcValue}$
                <Spacer x={0.4} />
                <img
                  src="/img/dedust.webp"
                  alt="DeDust.io"
                  style={{
                    height: 24,
                  }}
                />
              </Button>
            </Grid>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </>
  );
};
