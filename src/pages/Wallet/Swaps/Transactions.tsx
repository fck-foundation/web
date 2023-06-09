import { Divider, Grid, Link, Spacer, Text } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { TonProofApi } from "TonProofApi";
import { Announcement } from "assets/icons";
import { ARR01, ARR36, Arrowright, Link as LinkIcon } from "assets/icons";
import axios from "axios";
import { AppContext } from "contexts";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Address } from "ton-core";
import { normalize } from "utils";

export const Transactions = () => {
  const wallet = location.pathname?.split("/").pop();
  const { t } = useTranslation();
  const { isBottom, setIsBottom } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [type, setType] = useState<"all" | "balance">("all");

  useEffect(() => {
    setData([]);
    setPage(1);
  }, [wallet]);

  useEffect(() => {
    if (isBottom) {
      setPage((i) => i + 1);
    }
  }, [isBottom]);

  const { isLoading } = useQuery({
    queryKey: ["wallet-transactions", page],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://tonapi.io/v2/accounts/${wallet}/events?limit=1000&start_date=${
            Math.ceil(Date.now() / 1000) - page * 86400
          }&end_date=${Math.ceil(Date.now() / 1000) - (page - 1) * 86400}`, //(page - 1) * 28
          {
            signal,
            headers: {
              Authorization:
                "Bearer AH37NT7ALSCI34QAAAAIT52HPNNNR4VPZMUOMHX5MAYFGICKO3NXP46UZPMZ37C7P2QCQWQ",
            },
          }
        )
        .then(({ data }) => data?.events),
    refetchOnWindowFocus: false,
    onSuccess: (reponse) => {
      setData((prevData) => [...prevData, ...(reponse || [])]);

      if (reponse?.length) {
        setIsBottom(false);
      }
    },
  });

  // "TonTransfer"
  // "NftItemTransfer"
  // "SmartContractExec"
  // "JettonTransfer"

  return (
    <Grid.Container>
      {data?.map((event, i) => (
        <>
          <Grid key={i} xs={12}>
            <Grid.Container alignItems="center">
              <Grid>
                <Grid.Container wrap="nowrap" alignItems="center">
                  <Grid>
                    <Link
                      href={`https://tonscan.org/tx/${event?.event_id}`}
                      target="_blank"
                      css={{ display: "flex" }}
                    >
                      <LinkIcon
                        style={{ fill: "currentColor", fontSize: 18 }}
                      />
                    </Link>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Text css={{ whiteSpace: "nowrap" }}>
                      {moment(event?.timestamp * 1000).format("DD.MM.YY HH:mm")}
                    </Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer x={1} />
              <Grid>
                <Grid.Container direction="column" justify="center">
                  {event?.actions?.map((item, y) => {
                    const sender =
                      item[item?.type as any]?.sender?.address &&
                      Address.parseRaw(
                        item[item?.type as any]?.sender?.address
                      ).toString();
                    const recipient =
                      item[item?.type as any]?.recipient?.address &&
                      Address.parseRaw(
                        item[item?.type as any]?.recipient?.address
                      ).toString();
                    return (
                      <>
                        <Grid key={y}>
                          <Grid.Container
                            justify="center"
                            alignItems="center"
                          >
                            <Grid>
                              <Grid.Container wrap="nowrap" alignItems="center">
                                {item?.type === "SmartContractExec" && (
                                  <Grid>
                                    <Text>{item.simple_preview?.name}</Text>
                                  </Grid>
                                )}
                                {sender && (
                                  <Grid>
                                    <Link
                                      href={`https://tonviewer.com/${sender}`}
                                      target="_blank"
                                    >
                                      {item[item?.type as any]?.sender?.name
                                        ? item[item?.type as any]?.sender?.name
                                        : `${sender.slice(
                                            0,
                                            4
                                          )}...${sender.slice(-4)}`}
                                    </Link>
                                  </Grid>
                                )}
                                {recipient && (
                                  <>
                                    <Spacer x={1} />
                                    <Grid>
                                      <Arrowright
                                        style={{
                                          fill: "currentColor",
                                          fontSize: 24,
                                        }}
                                      />
                                    </Grid>
                                    <Spacer x={1} />
                                    <Grid>
                                      <Link
                                        href={`https://tonviewer.com/${recipient}`}
                                        target="_blank"
                                      >
                                        {item[item?.type as any]?.recipient
                                          ?.name
                                          ? item[item?.type as any]?.recipient
                                              ?.name
                                          : `${recipient?.slice(
                                              0,
                                              4
                                            )}...${recipient?.slice(-4)}`}
                                      </Link>
                                    </Grid>
                                  </>
                                )}
                              </Grid.Container>
                            </Grid>
                            {item[item?.type as any]?.comment && (
                              <>
                                <Spacer x={1} />
                                <Grid>
                                  <Grid.Container
                                    wrap="nowrap"
                                    alignItems="center"
                                  >
                                    <Grid>
                                      <Announcement
                                        style={{
                                          fill: "currentColor",
                                          fontSize: 18,
                                        }}
                                      />
                                    </Grid>
                                    <Spacer x={0.4} />
                                    <Grid>
                                      <Text>
                                        {item[item?.type as any]?.comment ||
                                          "-"}
                                      </Text>
                                    </Grid>
                                  </Grid.Container>
                                </Grid>
                              </>
                            )}
                            {(item[item?.type as any]?.jetton || item[item?.type as any]?.nft) && (
                              <>
                                <Spacer x={1} />
                                <Grid>
                                  <Text>
                                    {item[item?.type as any]?.jetton ? (
                                      <>
                                        {parseFloat(
                                          normalize(
                                            item[item?.type as any]?.amount,
                                            item[item?.type as any]?.jetton
                                              ? item[item?.type as any]?.jetton
                                                  ?.decimals
                                              : 9
                                          ).toFixed(
                                            item[item?.type as any]?.jetton
                                              ? item[item?.type as any]?.jetton
                                                  ?.decimals
                                              : 9
                                          )
                                        )}{" "}
                                        {item[item?.type as any]?.jetton
                                          ? item[item?.type as any]?.jetton
                                              ?.symbol
                                          : "TON"}
                                      </>
                                    ) : (
                                      item[item?.type as any]?.nft && (
                                        <Link
                                          href={`https://getgems.io/nft/${Address.parseRaw(
                                            item[item?.type as any].nft
                                          ).toString()}`}
                                          target="_blank"
                                        >
                                          {item.simple_preview.value}
                                        </Link>
                                      )
                                    )}
                                  </Text>
                                </Grid>
                              </>
                            )}
                          </Grid.Container>
                        </Grid>
                      </>
                    );
                  })}
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </Grid>

          {i !== data.length - 1 && (
            <Grid xs={12}>
              <Divider />
            </Grid>
          )}
        </>
      ))}
    </Grid.Container>
  );
};
