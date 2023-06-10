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
  Image,
} from "@nextui-org/react";
import cookie from "react-cookies";
import { useQuery } from "@tanstack/react-query";
import { Address } from "ton-core";
import axios from "axios";
import { AppContext } from "contexts";
import { TimeScale } from "pages";
import { calculatePriceImpact, normalize } from "utils";
import { ARR58, Ton } from "assets/icons";

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

  const dedust = data?.find(
    ({ address }) => address === jetton?.dedust_lp_address
  );

  const priceImpact = useMemo(() => {
    const liquidityTON = normalize(dedust?.reserves[0]?.toString(), 9);
    const liquidityJetton = normalize(
      dedust?.reserves[1]?.toString(),
      jetton?.decimals || 9
    );

    const amountTON = parseFloat(from === "TON" ? valueX : valueY);
    const tradeFee = amountTON * parseFloat(dedust?.tradeFee) * 0.01;

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
  }, [data, valueX, valueY, from, jetton, dedust]);

  const displayCalcValue = useMemo(() => {
    const val = (
      (ton?.market_data?.current_price?.usd || 1) *
      (from === "TON" ? parseInt(valueX) : parseInt(valueY))
    ).toFixed(2);

    return parseFloat(
      (!isNaN(parseFloat(val))
        ? parseFloat(val) -
          (from === "TON" ? 0.1 : 0.15) -
          0.01 * parseFloat(from === "TON" ? valueX : valueY)
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
      let val =
        to === "TON"
          ? parseInt(valueX) *
            (priceImpact.liquidityTON / priceImpact.liquidityJetton || 1)
          : parseInt(valueX) /
            (priceImpact.liquidityTON / priceImpact.liquidityJetton || 1);

      val = val - (val / 100) * priceImpact.priceImpact;

      setValueY(val.toString());
    }
  }, [data, from, to, priceImpact]);

  const onXChange = (e) => {
    const val = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    setValueX(val);
    setValueY(
      (to === "TON"
        ? parseFloat(val) * (data[dataJettons[from].id]?.price || 1)
        : parseFloat(val) / (data[dataJettons[to].id]?.price || 1)
      ).toString()
    );
  };

  const onYChange = (e) => {
    const val = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    setValueY(val);
    setValueX(
      (from !== "TON"
        ? parseFloat(valueY) * (data[dataJettons[from].id]?.price || 1)
        : parseFloat(val) * (data[dataJettons[to].id]?.price || 1)
      ).toString()
    );
  };

  return (
    <>
      <Grid.Container direction="column" className="dcalc">
        <Grid>
          <Grid.Container justify="space-between">
            <Grid>
              <Text
                size={32}
                css={{
                  textGradient: "45deg, $primary -20%, $secondary 50%",
                  marginTop: -16,
                  lineHeight: 1,
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
            alignItems="center"
            justify="space-between"
            css={{ width: "100%" }}
          >
            <Grid xs={12} sm={5} css={{ position: "relative" }}>
              <Grid.Container wrap="wrap" css={{ width: "100%" }}>
                <Grid xs={12}>
                  <Input
                    value={!isNaN(parseFloat(valueX)) ? valueX : ""}
                    clearable
                    bordered
                    width="100%"
                    color="primary"
                    labelPlaceholder={t("send") || ""}
                    onChange={onXChange}
                    contentRight={
                      <>
                        {from === "TON" ? (
                          <Badge
                            isSquared
                            color="primary"
                            size="lg"
                            variant="bordered"
                            css={{
                              border: "none",
                              minHeight: 40,
                              mr: 2,
                              borderRadius: "var(--nextui--inputBorderRadius)",
                            }}
                          >
                            TON
                          </Badge>
                        ) : (
                          <Dropdown>
                            <Dropdown.Button
                              color="gradient"
                              size="xs"
                              css={{
                                height: 40,
                                borderRadius:
                                  "var(--nextui--inputBorderRadius)",
                              }}
                            >
                              {jetton?.image && (
                                <>
                                  <Image
                                    src={jetton?.image}
                                    height={24}
                                    width={24}
                                    alt=""
                                    css={{
                                      borderRadius: 100,
                                      minHeight: 24,
                                      minWidth: 24,
                                    }}
                                  />
                                  <Spacer x={0.4} />
                                </>
                              )}
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
                                  <Dropdown.Item key={symbol}>
                                    {symbol}
                                  </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </>
                    }
                  />
                </Grid>
              </Grid.Container>
            </Grid>
            <Grid
              xs={12}
              sm={2}
              css={{ display: "flex", justifyContent: "center", padding: "$8" }}
            >
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
            <Grid xs={12} sm={5} css={{ position: "relative" }}>
              <Grid.Container
                wrap="wrap"
                css={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Grid xs={12}>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <Input
                      value={!isNaN(parseFloat(valueY)) ? valueY : ""}
                      clearable
                      bordered
                      width="100%"
                      color="primary"
                      labelPlaceholder={t("get") || ""}
                      onChange={onYChange}
                      contentRight={
                        <>
                          {to === "TON" ? (
                            <Badge
                              isSquared
                              color="primary"
                              size="lg"
                              variant="bordered"
                              css={{
                                border: "none",
                                minHeight: 40,
                                mr: 2,
                                borderRadius:
                                  "var(--nextui--inputBorderRadius)",
                              }}
                            >
                              TON
                            </Badge>
                          ) : (
                            <Dropdown>
                              <Dropdown.Button
                                color="gradient"
                                size="xs"
                                css={{
                                  height: 40,
                                  borderRadius:
                                    "var(--nextui--inputBorderRadius)",
                                }}
                              >
                                {jetton?.image && (
                                  <>
                                    <Image
                                      src={jetton?.image}
                                      height={24}
                                      width={24}
                                      alt=""
                                      css={{
                                        borderRadius: 100,
                                        minHeight: 24,
                                        minWidth: 24,
                                      }}
                                    />
                                    <Spacer x={0.4} />
                                  </>
                                )}
                                {to}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Static Actions"
                                onAction={setTo}
                              >
                                {[
                                  ...(to !== "TON" && from !== "TON"
                                    ? [{ symbol: "TON", image: "" }]
                                    : []),
                                  ...(listVerified || []),
                                ]
                                  ?.filter(({ symbol }) => symbol !== to)
                                  ?.map(({ symbol, image }) => (
                                    <Dropdown.Item key={symbol}>
                                      <Grid.Container alignItems="center">
                                        <Grid>
                                          <Image
                                            src={image}
                                            height={18}
                                            width={18}
                                            alt=""
                                            css={{
                                              borderRadius: 100,
                                              minHeight: 18,
                                            }}
                                          />
                                        </Grid>
                                        <Spacer x={0.4} />
                                        <Grid>{symbol}</Grid>
                                      </Grid.Container>
                                    </Dropdown.Item>
                                  ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                        </>
                      }
                    />
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
                <Grid>⋜ {from === "TON" ? 0.1 : 0.15} TON</Grid>
              </Grid.Container>
            </Grid>
            <Grid xs={12}>
              <Grid.Container justify="space-between">
                <Grid>{t("exchangeFee")}</Grid>
                <Grid>≈ {priceImpact.tradeFee || 0} TON</Grid>
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
                color="gradient"
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
