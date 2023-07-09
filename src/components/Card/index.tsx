import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import {
  Card,
  Grid,
  Image,
  Text,
  Spacer,
  Badge,
  Loading,
} from "@nextui-org/react";
import { ARR10, ARR12, ARR20, GEN03, Heart } from "assets/icons";

import { FJetton } from "../Jetton";

import "./index.scss";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
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
  const [animate, setAnimate] = useState<{ i: number; value: number }[]>([]);
  const [values, setValue] = useState<Item[]>([]);

  useEffect(() => {
    if (values.length) {
      list.forEach((item, i) => {
        if (item.percent > values[i].percent) {
          setAnimate((prevState) => [
            ...prevState,
            {
              i,
              value:
                item.percent > values[i].percent
                  ? 1
                  : item.percent < values[i].percent
                  ? -1
                  : 0,
            },
          ]);
        }
      });
    }

    setValue(list);
  }, [list]);

  useEffect(() => {
    setTimeout(() => setAnimate([]), 3000);
  }, [animate]);

  return (
    <Card variant={title ? "bordered" : undefined}>
      {title && (
        <Card.Header
          className="flex place-items-center"
          css={{ pb: title ? "$4" : 0, h: 50 }}
        >
          {title}
        </Card.Header>
      )}
      <Card.Body css={{ p: 0, overflow: "hidden" }}>
        <Grid.Container gap={!isLoading ? 0.8 : 0} css={{ h: "100%" }}>
          <Grid xs={12}>
            <Card>
              <Card.Header>
                <Grid.Container
                  wrap="nowrap"
                  alignItems="center"
                  justify="space-between"
                >
                  <Grid xs={4}>
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
                      <div className="overflow-hidden text-base text-ellipsis whitespace-nowrap w-full">
                        <Heart />
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
          {isLoading
            ? Array(9)
                .fill(null)
                .map((_, i) => (
                  <Grid
                    key={i}
                    xs={12}
                    className="flex justify-center place-items-center"
                  >
                    <Grid.Container
                      wrap="nowrap"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid xs={4}>
                        <Grid.Container wrap="nowrap" alignItems="center">
                          <Grid css={{ pl: "$4" }}>
                            <Skeleton
                              width={28}
                              height={28}
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
                            <Skeleton width={50} height={18} />
                          </Grid>
                          <Spacer x={0.4} />
                          <Grid></Grid>
                        </Grid.Container>
                      </Grid>
                      <Grid xs={3}>
                        <Skeleton width={90} height={18} />
                      </Grid>
                      <Grid xs={1}>
                        <Skeleton width={18} height={18} />
                      </Grid>
                      <Grid xs={3}>
                        <Skeleton width={90} height={36} />
                      </Grid>
                    </Grid.Container>
                  </Grid>
                ))
            : values?.map(
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
                ) => {
                  const highlight =
                    animate.find(({ i: x }) => x === i)?.value || 0;

                  return (
                    <Grid key={i} xs={12} className="card__item">
                      <Link to={`/analytics/price/${name}`} className="w-full">
                        <Card
                          isHoverable
                          isPressable
                          variant="flat"
                          className="card"
                        >
                          <Card.Header css={{ p: 0 }}>
                            <Grid.Container
                              wrap="nowrap"
                              justify="space-between"
                              alignItems="center"
                            >
                              <Grid xs={4}>
                                <Grid.Container
                                  wrap="nowrap"
                                  alignItems="center"
                                >
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
                                  <Spacer x={0.4} />
                                  <Grid className="flex place-items-center">
                                    <Text className="flex text-lg">
                                      {verified ? (
                                        <ARR12
                                          className="overflow-hidden rounded-full"
                                          style={{
                                            fill: "var(--nextui-colors-primary)",
                                          }}
                                        />
                                      ) : null}
                                    </Text>
                                  </Grid>
                                </Grid.Container>
                              </Grid>
                              <Grid xs={3}>
                                <Text className="overflow-hidden whitespace-nowrap text-ellipsis text-sm">
                                  {price.toFixed(decimals).toLocaleString()}
                                </Text>
                              </Grid>
                              <Grid xs={1}>
                                <Text
                                  className="text-xs"
                                  // onClick={(e) => {
                                  //   e.stopPropagation();
                                  //   e.preventDefault();
                                  //   setVoteId(id);
                                  // }}
                                >
                                  {stats?.promoting_points || 0}
                                </Text>
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
                                      color={
                                        highlight < 0
                                          ? "#9a1444"
                                          : highlight > 0
                                          ? "#188246"
                                          : color
                                      }
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
                                        transition: "all 300ms",
                                      }}
                                      className={`${
                                        highlight < 0 || highlight > 0
                                          ? `highlight-${highlight}`
                                          : ""
                                      }`}
                                    >
                                      {(percent || 0).toFixed(2)}%
                                    </Badge>
                                  </Grid>
                                </Grid.Container>
                              </Grid>
                            </Grid.Container>
                          </Card.Header>
                        </Card>
                      </Link>
                    </Grid>
                  );
                }
              )}
        </Grid.Container>
      </Card.Body>
    </Card>
  );
};
