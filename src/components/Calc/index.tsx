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
import { ARR58 } from "assets/icons";
import { AppContext } from "contexts";
import { TimeScale } from "pages";
import { Key, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Address } from "ton-core";

export const Calc: React.FC = () => {
  const { t } = useTranslation();
  const { ton, jettons, theme } = useContext(AppContext);
  const [timescale, setTimescale] = useState<TimeScale>(
    (cookie.load("timescale") as any) || "1D"
  );

  const listVerified = useMemo(
    () => [...(jettons || [])]?.filter((i) => i.verified).slice(0, 14),
    [jettons]
  );

  const [from, setFrom] = useState<Key>("TON");
  const [to, setTo] = useState<Key>("SCALE");

  const [valueX, setValueX] = useState("1");
  const [valueY, setValueY] = useState("1");

  const { data, isLoading } = useQuery({
    queryKey: ["analytics-calc"],
    queryFn: ({ signal }) => {
      return axios
        .get(
          `https://api.fck.foundation/api/v2/analytics?jetton_ids=${listVerified
            ?.map(({ id }) => id)
            .join(",")}&time_min=${Math.floor(
            Date.now() / 1000 - 1000
          )}&time_max=${Math.floor(Date.now() / 1000)}&timescale=${300}`,
          { signal }
        )
        .then(
          ({ data: { data } }) => data?.sources?.DeDust?.jettons
          // [jetton?.id?.toString()]?.prices
        );
    },
    enabled: !!listVerified?.length,
  });

  const displayCalcValue = useMemo(() => {
    const val = (
      (ton?.market_data?.current_price?.usd || 1) *
      (from === "TON" ? parseInt(valueX) : parseInt(valueY))
    ).toFixed(2);

    return !isNaN(parseFloat(val)) ? val : 0;
  }, [ton, valueX, valueY]);

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
        }, {}),
    [jettons]
  );

  useEffect(() => {
    if (data)
      setValueY(
        (to === "TON"
          ? parseInt(valueX) *
            (data[dataJettons[from].id]?.prices?.pop()?.price_close || 1)
          : parseInt(valueX) /
            (data[dataJettons[to].id]?.prices?.pop()?.price_close || 1)
        ).toString()
      );
  }, [data, valueX, from, to]);

  return (
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
                      setValueX(
                        (to !== "TON"
                          ? parseInt(e.target.value) *
                            (data[to]?.prices?.pop()?.price_close || 1)
                          : parseInt(e.target.value) /
                            (data[from]?.prices?.pop()?.price_close || 1)
                        ).toString()
                      );
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
                    <Dropdown.Menu aria-label="Static Actions" onAction={setTo}>
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
          <Grid css={{ w: "auto" }}>
            <Grid.Container alignItems="center" justify="flex-end">
              <Grid>
                <Button
                  flat
                  color="secondary"
                  css={{
                    minWidth: "auto",
                    overflow: "visible",
                  }}
                  onPress={() =>
                    globalThis.open(
                      `https://dedust.io/swap/${
                        from !== "TON"
                          ? Address.parseRaw(
                              dataJettons[from].address
                            ).toString()
                          : "TON"
                      }/${
                        to !== "TON"
                          ? Address.parseRaw(dataJettons[to].address).toString()
                          : "TON"
                      }`,
                      "_blank"
                    )
                  }
                >
                  {t("swap")}
                  <Spacer x={0.4} />
                  {displayCalcValue}$
                  <img
                    src="/img/dedust.webp"
                    alt="DeDust.io"
                    style={{ height: 32, position: 'absolute', bottom: -16, right: -16 }}
                  />
                </Button>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
};
