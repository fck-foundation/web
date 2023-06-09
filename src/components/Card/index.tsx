import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import {
  Card,
  Grid,
  Image,
  Text,
  Spacer,
  Badge,
} from "@nextui-org/react";
import { ARR20, GEN03 } from "assets/icons";

import { FJetton } from "../Jetton";

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
  setVoteId,
}) => {
  return (
    <Card css={{ p: "$6" }}>
      <Card.Header>{title}</Card.Header>
      <Card.Body css={{ p: 0, overflow: "hidden" }}>
        <Grid.Container gap={0.8}>
          {isLoading ? (
            <Grid.Container gap={0.8}>
              {new Array(9).fill(null).map((_, i) => (
                <Grid key={i} xs={4}>
                  <Skeleton
                    count={1}
                    borderRadius={20}
                    height={75}
                    width={75}
                  />
                </Grid>
              ))}
            </Grid.Container>
          ) : (
            list?.map(
              (
                {
                  id,
                  name,
                  image,
                  price,
                  volume,
                  percent,
                  color,
                  chart,
                  stats,
                  decimals,
                  verified,
                },
                i
              ) => (
                <Grid key={i} xs={4} sm={6} md={4}>
                  <Link
                    to={`/analytics/price/${name}`}
                    style={{ width: "100%" }}
                  >
                    <Card
                      isHoverable
                      isPressable
                      variant="flat"
                      className="card"
                    >
                      <Card.Header>
                        <Grid.Container
                          wrap="nowrap"
                          justify="space-between"
                          alignItems="center"
                        >
                          <Grid>
                            {verified ? (
                              <Badge
                                size="xs"
                                css={{
                                  p: 0,
                                  background: "transparent",
                                  right: "unset",
                                  left: "$2",
                                }}
                                content={
                                  <ARR20
                                    style={{
                                      fill: "var(--nextui-colors-primary)",
                                      fontSize: 16,
                                      borderRadius: 100,
                                      overflow: "hidden",
                                    }}
                                  />
                                }
                              >
                                <Image
                                  src={image}
                                  width={24}
                                  style={{ borderRadius: 100 }}
                                />
                              </Badge>
                            ) : (
                              <Image
                                src={image}
                                width={24}
                                style={{ borderRadius: 100 }}
                              />
                            )}
                          </Grid>
                          <Spacer x={0.4} />
                          <Grid>
                            <Badge size="xs" css={{ background: color }}>
                              {(percent || 0)?.toFixed(2)}%
                            </Badge>
                          </Grid>
                        </Grid.Container>
                      </Card.Header>
                      <Card.Body className="card-body">
                        <FJetton
                          index={i}
                          data={
                            chart?.length > 1
                              ? chart.map((v) => ({ pv: v.value }))
                              : [{ pv: 0 }, { pv: 0 }]
                          }
                          height={32}
                          color={color}
                        />
                        <Grid.Container
                          justify="space-between"
                          alignItems="center"
                          gap={1}
                          wrap="nowrap"
                        >
                          <Grid
                            css={{
                              maxWidth: "60%",
                              "@xs": { maxWidth: "80%" },
                            }}
                          >
                            <Text
                              css={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  maxWidth: "100%",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {name}
                              </div>
                            </Text>
                          </Grid>
                          <Grid css={{ position: 'absolute', right: 0 }}>
                            <Badge
                              size="xs"
                              variant="flat"
                              color="primary"
                              css={{
                                flexWrap: "nowrap",
                                p: "$0 $4 $0 $1",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setVoteId(id);
                              }}
                            >
                              <GEN03
                                style={{
                                  fill: "currentColor",
                                  fontSize: 18,
                                }}
                              />
                              <Spacer x={0.4} />
                              {stats?.promoting_points || 0}
                            </Badge>
                          </Grid>
                        </Grid.Container>
                        {/* <Text
                          color="primary"
                          css={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                            overflow: "hidden",
                            lineHeight: "var(--nextui-lineHeights-md)",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate3d(-50%, -50%, 0)",
                          }}
                        >
                          <div>{parseFloat(price.toFixed(decimals))}</div> TON
                        </Text> */}
                      </Card.Body>
                    </Card>
                  </Link>
                </Grid>
              )
            )
          )}
        </Grid.Container>
      </Card.Body>
    </Card>
  );
};
