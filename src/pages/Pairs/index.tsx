import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Grid, Spacer, Container } from "@nextui-org/react";
import cookie from "react-cookies";
import { FCard, Promote } from "components";
import { fck } from "api/fck";
import { GEN02, Trophy } from "assets/icons";
import { getList } from "utils/analytics";

import { AppContext } from "../../contexts";
import { pagination } from "../Analytics";

import { TimeScale } from "pages/Landing";

export function Pairs() {
  const { t } = useTranslation();
  const { jettons, currency } = useContext(AppContext);
  const [timescale] = useState<TimeScale>(cookie.load("timescale") || "1D");
  const [voteId, setVoteId] = useState<number>();

  // const { data: dataRecently, isLoading: isLoadingRecently } = useQuery({
  //   queryKey: ["new-jettons"],
  //   queryFn: async ({ signal }) =>
  //     await fck.getRecentlyAdded(
  //       9,
  //       Math.floor(Date.now() / 1000 - pagination[timescale]),
  //       pagination[timescale] / 4,
  //       signal
  //     ),
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   select: (results) => {
  //     results = results.data.sources.DeDust.jettons;

  //     return getList(
  //       Object.keys(results).reduce((acc, curr) => {
  //         acc[curr] = results[curr]?.prices || [];
  //         return acc;
  //       }, {}),
  //       jettons
  //     );
  //   },
  // });

  const { data: dataPromo, isLoading: isLoadingPromo } = useQuery({
    queryKey: ["promo-jettons", currency],
    queryFn: async ({ signal }) =>
      await fck.getPromoting(
        9,
        Math.floor(Date.now() / 1000 - pagination[timescale]),
        pagination[timescale] / 4,
        currency,
        signal
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
    queryKey: ["trending-jettons", currency],
    queryFn: async ({ signal }) =>
      await fck.getTrending(
        9,
        Math.floor(Date.now() / 1000 - pagination[timescale]),
        pagination[timescale] / 4,
        currency,
        signal
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

  const loading = isLoadingPromo || isLoadingTrending;

  return (
    <>
      <Container md css={{ p: 0 }}>
        <Grid.Container
          gap={1}
          justify="center"
          css={{ minHeight: "70vh", pt: 16, pb: 32, pl: 0, pr: 0 }}
        >
          <Grid xs={12} sm={8}>
            <Grid.Container
              gap={1}
              justify="space-between"
              css={{ m: "-$8", width: "calc(100% + $16)" }}
            >
              <Grid xs={12} sm={6}>
                <FCard
                  isLoading={loading}
                  title={
                    <Grid.Container justify="space-between" wrap="nowrap">
                      <Grid.Container wrap="nowrap" css={{ minWidth: "auto" }}>
                        <Trophy
                          className="text-2xl"
                          style={{
                            fill: "var(--nextui-colors-link)",
                          }}
                        />
                        <Spacer x={0.4} /> {t("topVoted")} <Spacer x={0.4} />
                      </Grid.Container>
                      <Grid>
                        <Promote voteId={voteId} setVoteId={setVoteId} />
                      </Grid>
                    </Grid.Container>
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
              <Grid xs={12} sm={6}>
                <FCard
                  isLoading={loading}
                  title={
                    <>
                      <GEN02
                        className="text-2xl"
                        style={{
                          fill: "var(--nextui-colors-link)",
                        }}
                      />
                      <Spacer x={0.4} /> {t("trending")}
                    </>
                  }
                  list={
                    dataTrending
                      ?.sort((x, y) => y.volume - x.volume)
                      ?.slice(0, 9) || []
                  }
                  setVoteId={setVoteId}
                />
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Container>
      <Spacer y={0.4} />
    </>
  );
}
