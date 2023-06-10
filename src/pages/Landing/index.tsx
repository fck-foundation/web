import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button, Grid, Spacer, Text, Card } from "@nextui-org/react";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import { Calc, FCard, Promote } from "components";
import { fck } from "api/fck";
import { ARR07, Arrowtechart, GEN02, GEN11, GEN20 } from "assets/icons";
import { getList } from "utils/analytics";

import { AppContext } from "../../contexts";
import { pagination } from "../Analytics";

export type TimeScale = "1M" | "5M" | "30M" | "1H" | "4H" | "1D" | "30D";

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { jettons, enabled, refetchJettons } = useContext(AppContext);
  const [timescale] = useState<TimeScale>(cookie.load("timescale") || "1D");
  const [voteId, setVoteId] = useState<number>();
  const [processing, setProcessing] = useState(
    cookie.load("processing")
      ? (cookie.load("processing") as any)
      : { before: 0, wait: 0 }
  );

  const { data: dataRecently, isLoading: isLoadingRecently } = useQuery({
    queryKey: ["new-jettons"],
    queryFn: async () =>
      await fck.getRecentlyAdded(
        9,
        Math.floor(Date.now() / 1000 - pagination[timescale] * 7),
        pagination[timescale]
      ),
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (results) => {
      results = results.data.sources.DeDust.jettons;

      return getList(
        Object.keys(results).reduce((acc, curr) => {
          acc[curr] = results[curr]?.prices || [];
          return acc;
        }, {}),
        jettons
      );
    },
  });

  const { data: dataPromo, isLoading: isLoadingPromo } = useQuery({
    queryKey: ["promo-jettons"],
    queryFn: async () =>
      await fck.getPromoting(
        9,
        Math.floor(Date.now() / 1000 - pagination[timescale] * 7),
        pagination[timescale]
      ),
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (results) => {
      results = results.data.sources.DeDust.jettons;

      return getList(
        Object.keys(results).reduce((acc, curr) => {
          acc[curr] = results[curr]?.prices || [];
          return acc;
        }, {}),
        jettons
      );
    },
  });

  const { data: dataTrending, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending-jettons"],
    queryFn: async () =>
      await fck.getTrending(
        9,
        Math.floor(Date.now() / 1000 - pagination[timescale] * 7),
        pagination[timescale]
      ),
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (results) => {
      results = results.data.sources.DeDust.jettons;

      return getList(
        Object.keys(results).reduce((acc, curr) => {
          acc[curr] = results[curr]?.prices || [];
          return acc;
        }, {}),
        jettons
      );
    },
  });

  useEffect(() => {
    const verify = setInterval(refetchJettons, 15000);

    if (processing.wait > 0) {
      const curr = jettons
        ?.map(({ stats }) => stats?.promoting_points || 0)
        ?.reduce((acc, curr) => (acc += curr), 0);

      if (processing.wait <= curr) {
        setProcessing({ wait: 0, curr: 0 });
        cookie.remove("processing");

        toast.success(t("voteSuccess"), {
          position: toast.POSITION.TOP_RIGHT,
          theme: enabled ? "dark" : "light",
        });

        clearInterval(verify);
      }
    } else {
      clearInterval(verify);
    }
  }, [processing, jettons]);

  const onSuccess = (value: number) => {
    const curr = jettons
      .map(({ stats }) => stats.promoting_points)
      .reduce((acc, curr) => (acc += curr), 0);

    setProcessing({ curr: curr, wait: curr + value });

    cookie.save(
      "processing",
      JSON.stringify({ before: curr, wait: curr + value }),
      { path: "/" }
    );

    toast.success(t("voteSent"), {
      position: toast.POSITION.TOP_RIGHT,
      theme: enabled ? "dark" : "light",
    });
  };

  const loading = isLoadingPromo || isLoadingRecently || isLoadingTrending;

  return (
    <>
      <Grid.Container
        gap={2}
        alignItems="center"
        justify="center"
        css={{ minHeight: "70vh" }}
      >
        <Grid xs={12} sm={6}>
          <Grid.Container gap={2} direction="column">
            <Grid>
              <Text size={16} color="success" weight="bold">
                {t("signUpToday")}
              </Text>
              <Text size={24} color="light" weight="bold">
                {t("header1")}
              </Text>

              <Text size={24} weight="bold">
                {t("header2")}
              </Text>
              <Text size={24} color="light" weight="bold">
                {t("header3")}
              </Text>
              <Text size={14} color="light">
                {t("headerDesc").replace(
                  "$1",
                  (jettons?.length || 0).toString()
                )}
              </Text>
            </Grid>
            <Grid>
              <Grid.Container wrap="nowrap">
                <Grid>
                  <Button
                    color="primary"
                    css={{ minWidth: "auto" }}
                    onPress={() => navigate("/analytics")}
                  >
                    {t("getStarted")}
                    <Spacer x={0.4} />
                    <ARR07
                      style={{
                        fill: "currentColor",
                        fontSize: 24,
                      }}
                    />
                  </Button>
                </Grid>
                {/* <Spacer x={1} />
                <Grid>
                  <Button
                    color="primary"
                    flat
                    size="lg"
                    css={{ minWidth: "auto" }}
                  >
                    <FIL21
                      style={{
                        fill: "var(--nextui-colors-link)",
                        fontSize: 24,
                      }}
                    />
                    <Spacer x={0.4} /> Download App
                  </Button>
                </Grid> */}
              </Grid.Container>
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card css={{ height: "fit-content" }}>
            <Card.Body>
              <Grid.Container gap={2} justify="space-between" css={{ pb: 0 }}>
                <Grid xs={12}>
                  <Calc />
                </Grid>
              </Grid.Container>
            </Card.Body>
          </Card>
        </Grid>
        <Grid xs={12} sm={4}>
          <FCard
            isLoading={loading}
            title={
              <>
                <GEN20
                  style={{ fill: "var(--nextui-colors-link)", fontSize: 24 }}
                />
                <Spacer x={0.4} /> {t("topVoted")}
              </>
            }
            list={
              dataPromo
                ?.sort(
                  (x, y) =>
                    (y.stats?.promoting_points || 0) -
                    (x.stats?.promoting_points || 0)
                )
                ?.slice(0, 9) || []
            }
            setVoteId={setVoteId}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <FCard
            isLoading={loading}
            title={
              <>
                <GEN02
                  style={{ fill: "var(--nextui-colors-link)", fontSize: 24 }}
                />
                <Spacer x={0.4} /> {t("trending")}
              </>
            }
            list={
              dataTrending?.sort((x, y) => y.volume - x.volume)?.slice(0, 9) ||
              []
            }
            setVoteId={setVoteId}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <FCard
            isLoading={loading}
            title={
              <>
                <GEN11
                  style={{ fill: "var(--nextui-colors-link)", fontSize: 24 }}
                />
                <Spacer x={0.4} /> {t("recentlyAdded")}
              </>
            }
            list={dataRecently?.slice(0, 9) || []}
            setVoteId={setVoteId}
          />
        </Grid>
        <Grid>
          <Promote
            voteId={voteId}
            processing={processing}
            onSuccess={onSuccess}
            setVoteId={setVoteId}
          />
          <Spacer y={1} />
        </Grid>
      </Grid.Container>
    </>
  );
}
