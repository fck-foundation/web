import { useContext, useEffect, useMemo, useState } from "react";
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
import axios from "axios";

export function Pairs() {
  const { t } = useTranslation();
  const { jettons, currency, isBottom, page, setPage, setIsBottom } =
    useContext(AppContext);
  const [timescale] = useState<TimeScale>(cookie.load("timescale") || "1D");
  const [voteId, setVoteId] = useState<number>();

  useEffect(() => {
    if (isBottom) {
      setPage((i) => i + 1);
    }
  }, [isBottom]);

  const { data: dataPairs, isLoading: isLoadingPairs } = useQuery({
    queryKey: ["pairs-jettons", currency, page],
    queryFn: async ({ signal }) =>
      await fck.getPairs({
        signal,
        limit: 10,
        offset: (page - 1) * 10,
      }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (results) => {
      return results.pairs;
    },
  });

  const { data: dataStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["pairs-stats", timescale, page, currency, dataPairs],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v3/analytics?pairs=${Object.keys(
            dataPairs
          ).join(",")}&period=${pagination[timescale]}`,
          { signal }
        )
        .then(({ data }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!Object.keys(dataPairs  || {})?.length,
    select: (results) => {
      results = results.data;

      return getList(
        Object.keys(results).reduce((acc, curr) => {
          acc[curr] = results[curr]?.prices || [];
          return acc;
        }, {}),
        jettons
      );
    },
  });

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
              <Grid xs={12}>
                <FCard
                  isLoading={isLoadingPairs || isLoadingStats}
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
                  list={dataStats || []}
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
