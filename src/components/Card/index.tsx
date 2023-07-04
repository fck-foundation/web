import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Card, Grid, Image, Text, Spacer, Badge } from "@nextui-org/react";
import { ARR10, ARR12, ARR20, GEN03 } from "assets/icons";

import { FJetton } from "../Jetton";

import "./index.scss";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AppContext } from "contexts";

export type Item = {
  id?: number;
  name: string;
  image: string;
  price: number;
  chart: { value: number }[];
  volume: number;
  percent: number;
  decimals: number;
  color: string;
  stats?: { promoting_points: number };
  verified?: boolean;
};

interface Props {
  title: React.ReactNode;
  list: Item[];
  isLoading: boolean;
  setVoteId: (value?: number) => void;
}

export const FCard: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  list,
  isLoading,
  // setVoteId,
}) => {
  const { jettonCurrency } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <Card>
      <Card.Header css={{ pb: "$4" }}>{title}</Card.Header>
      <Card.Body css={{ pt: 0, overflow: "hidden" }}>
        <Grid.Container gap={!isLoading ? 0.8 : 0} css={{ h: "100%" }}>
          <Grid xs={12}>
            <Card>
              <Card.Header css={{ p: 0 }}>
                <Grid.Container
                  wrap="nowrap"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid xs={3}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("token")}
                      </div>
                    </Text>
                  </Grid>
                  <Grid xs={3}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("price")} ({jettonCurrency?.symbol})
                      </div>
                    </Text>
                  </Grid>
                  <Grid xs={1}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("votes")}
                      </div>
                    </Text>
                  </Grid>
                  <Grid xs={1}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("verified")}
                      </div>
                    </Text>
                  </Grid>
                  <Grid xs={3}>
                    <Text className="text-xs" css={{ width: "100%" }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {t("analytics")}
                      </div>
                    </Text>
                  </Grid>
                </Grid.Container>
              </Card.Header>
            </Card>
          </Grid>
          {list?.map(
            (
              {
                // id,
                name,
                image,
                price,
                // volume,
                percent,
                color,
                chart,
                stats,
                decimals,
                verified,
              },
              i
            ) => (
              <Grid key={i} xs={12}>
                <Link to={`/analytics/price/${name}`} className="w-full">
                  <Card isHoverable isPressable variant="flat" className="card">
                    <Card.Header css={{ p: 0 }}>
                      <Grid.Container
                        wrap="nowrap"
                        justify="space-between"
                        alignItems="center"
                      >
                        <Grid xs={3}>
                          <Grid.Container wrap="nowrap" alignItems="center">
                            <Grid css={{ pl: "$4" }}>
                              <Image
                                src={image}
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
                                <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full text-sm">
                                  {name}
                                </div>
                              </Text>
                            </Grid>
                          </Grid.Container>
                        </Grid>
                        <Grid xs={3}>
                          <Text className="overflow-hidden whitespace-nowrap text-ellipsis text-sm">
                            {parseFloat(price.toFixed(decimals))}
                          </Text>
                        </Grid>
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
                              borderColor: "transparent !important",
                              color: "$primary",
                            }}
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   e.preventDefault();
                            //   setVoteId(id);
                            // }}
                          >
                            <GEN03 className="fill-current text-xs" />
                            <Spacer x={0.2} />
                            {stats?.promoting_points || 0}
                          </Badge>
                        </Grid>
                        <Grid xs={1}>
                          <Badge
                            size="xs"
                            css={{
                              p: 0,
                              background: verified
                                ? "var(--nextui-colors-primary)"
                                : "var(--nextui-colors-accents3)",
                              right: "unset",
                              left: "$2",
                            }}
                          >
                            {verified ? (
                              <ARR12
                                className="overflow-hidden text-xs rounded-full"
                                style={{
                                  fill: "var(--nextui-colors-accents0)",
                                }}
                              />
                            ) : (
                              <ARR10
                                className="overflow-hidden text-xs rounded-full"
                                style={{
                                  fill: "var(--nextui-colors-accents0)",
                                }}
                              />
                            )}
                          </Badge>
                        </Grid>
                        <Grid xs={3}>
                          <Grid.Container className="relative">
                            <Grid xs={12}>
                              <FJetton
                                index={i}
                                data={
                                  chart?.length > 1
                                    ? chart.map((v) => ({ pv: v.value }))
                                    : [{ pv: 0 }, { pv: 0 }]
                                }
                                height={40}
                                color={color}
                              />
                            </Grid>
                            <Grid
                              css={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate3d(-50%, -50%, 0)",
                              }}
                            >
                              <Badge
                                size="xs"
                                css={{
                                  background: color,
                                  border: "none",
                                  p: "2px 4px",
                                }}
                              >
                                {(percent || 0)?.toFixed(2)}%
                              </Badge>
                            </Grid>
                          </Grid.Container>
                        </Grid>
                      </Grid.Container>
                    </Card.Header>
                  </Card>
                </Link>
              </Grid>
            )
          )}
        </Grid.Container>
      </Card.Body>
    </Card>
  );
};
