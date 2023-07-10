import { Grid, Card, Image, Spacer, Text, Button, Badge } from "@nextui-org/react";
import { ARR12, ARR16, Info, TransparentTon } from "assets/icons";
import { FJetton } from "components/Jetton";
import { JType } from "contexts";
import React from "react";

interface Props {
  index: number;
  isDrag?: boolean;
  jetton: JType;
  column: Record<string, any>;
  isStatic?: boolean;
  onPress: (value: JType) => void;
  setInfo: React.Dispatch<string>;
}

export const Token: React.FC<Props> = ({
  index,
  isStatic,
  isDrag,
  jetton,
  column,
  onPress,
  setInfo,
}) => {
  return (
    <Grid className="jetton-card" xs={12}>
      <Card
        isHoverable={!isStatic}
        isPressable={!isDrag && !isStatic}
        css={{
          bg:
            !isStatic && location.pathname.includes(jetton.symbol)
              ? "$border"
              : "transparent",
        }}
        onClick={() => onPress(jetton)}
      >
        <Card.Header css={{ p: isStatic ? 0 : undefined }}>
          <Grid.Container justify="space-between" alignItems="center">
            <Grid xs={12} css={{ mb: "$4" }}>
              <Grid.Container
                wrap="nowrap"
                alignItems="center"
                justify="space-between"
              >
                <Grid
                  style={{
                    maxWidth: "calc(100% - 100px)",
                  }}
                >
                  <Grid.Container alignItems="center" wrap="nowrap">
                    <Grid>
                      <Image
                        src={column?.jetton?.image || ""}
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
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-[100px]">
                          {column?.jetton?.name}
                        </div>
                      </Text>
                    </Grid>
                    <Spacer x={0.4} />
                    <Grid
                      css={
                        {
                          // transform: 'translate3d(-50%, 0, 0)'
                        }
                      }
                    >
                      <Text className="text-xs" color="$accents7">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
                          {column?.jetton?.symbol}
                        </div>
                      </Text>
                    </Grid>{" "}
                    {/* <Grid>
                                                <Badge
                                                  size="xs"
                                                  variant="flat"
                                                  color="primary"
                                                  css={{
                                                    flexWrap: "nowrap",
                                                    p: "$0",
                                                    cursor: "pointer",
                                                    background: "transparent",
                                                    borderColor:
                                                      "transparent !important",
                                                    color: "$primary",
                                                  }}
                                                  // onClick={(e) => {
                                                  //   e.stopPropagation();
                                                  //   e.preventDefault();
                                                  //   setVoteId(id);
                                                  // }}
                                                >
                                                  <GEN03 className="text-xs fill-current" />
                                                  <Spacer x={0.2} />
                                                  {column.jetton?.stats
                                                    ?.promoting_points || 0}
                                                </Badge>
                                              </Grid>*/}
                    <Spacer x={0.4} />
                    <Grid>
                      <Text
                        size="xs"
                        className="flex"
                        css={{
                          fill: column.jetton.verified
                            ? "var(--nextui-colors-primary)"
                            : "var(--nextui-colors-accents3)",
                        }}
                      >
                        {column.jetton.verified ? (
                          <Badge
                            color="primary"
                            variant="flat"
                            className="flex"
                            css={{ p: 0, border: 'none' }}
                          >
                            <ARR16 className="overflow-hidden rounded-full text-2xl fill-current" />
                          </Badge>
                        ) : null}
                      </Text>
                    </Grid>
                  </Grid.Container>
                </Grid>
                <Spacer x={0.4} />
                <Grid className="flex place-items-center justify-end w-[100px]">
                  <Text
                    css={{
                      color:
                        !isNaN(column?.percent) && column?.percent !== 0
                          ? column?.percent > 0
                            ? "#1ac964"
                            : "#F54244"
                          : "gray",
                      border: "none",
                      p: "2px 4px",
                    }}
                  >
                    {(column?.percent || 0)?.toFixed(2)}%
                  </Text>
                  <Spacer x={0.4} />
                  <Button
                    size="xs"
                    css={{
                      p: 0,
                      minWidth: "auto",
                      bg: "transparent",
                      color: "$accents9",
                    }}
                    onPress={() => setInfo(jetton.address)}
                  >
                    <Info className="text-base" />
                  </Button>
                </Grid>
              </Grid.Container>
            </Grid>
            <Grid xs={12} className="flex justify-between place-items-end">
              <Text className="flex place-items-center overflow-hidden whitespace-nowrap text-ellipsis text-2xl">
                <TransparentTon
                  className="text-5xl"
                  style={{
                    margin: "-14.2px",
                  }}
                />
                <Spacer x={0.4} />
                <div className="mt-1">
                  {parseFloat(
                    column?.dataJetton[column?.dataJetton?.length - 1]?.pv ||
                      "0"
                  )
                    .toFixed(
                      column?.dataJetton[column?.dataJetton?.length - 1]?.pv >
                        0.01
                        ? 2
                        : 9
                    )
                    .toLocaleString()}
                </div>
              </Text>
              <FJetton
                index={index}
                data={
                  column.dataChart?.length > 1
                    ? column.dataChart
                    : [{ pv: 0 }, { pv: 0 }]
                }
                height={40}
                className="max-w-[100px]"
                color={
                  !isNaN(column?.percent) && column?.percent !== 0
                    ? column?.percent > 0
                      ? "#1ac964"
                      : "#F54244"
                    : "gray"
                }
              />
            </Grid>
          </Grid.Container>
        </Card.Header>
      </Card>
    </Grid>
  );
};
