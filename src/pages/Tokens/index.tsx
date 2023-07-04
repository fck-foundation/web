import { useContext, useEffect, useState } from "react";
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

export function Tokens() {
  const { t } = useTranslation();
  const { jettons, currency, page, setPage, isBottom, setIsBottom } =
    useContext(AppContext);
  const [timescale] = useState<TimeScale>(cookie.load("timescale") || "1D");
  const [voteId, setVoteId] = useState<number>();
  const [tab, setTab] = useState<"top" | "trending" | "new">("top");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([]);
    setPage(1);
  }, [tab]);

  useEffect(() => {
    if (isBottom) {
      setPage((i) => i + 1);
    }
  }, [isBottom]);

  const { isLoading: isLoadingRecently } = useQuery({
    queryKey: ["new-jettons", currency, page],
    queryFn: async ({ signal }) =>
      await fck.getRecentlyAdded(
        page,
        Math.floor(Date.now() / 1000 - pagination[timescale]),
        pagination[timescale] / 4,
        currency,
        signal
      ),
    enabled: tab === "new",
    refetchOnMount: false,
    refetchOnReconnect: false,
    onSuccess: (results) => {
      results = results.data.sources.DeDust.jettons;

      setData((prevData) => [
        ...prevData,
        ...getList(
          Object.keys(results).reduce((acc, curr) => {
            acc[curr] = results[curr]?.prices || [];
            return acc;
          }, {}),
          jettons
        ),
      ].filter((v,i,a)=>a.findIndex(v2=>(v2.name===v.name))===i));
      setIsBottom(false);
    },
  });

  const { isLoading: isLoadingPromo } = useQuery({
    queryKey: ["promo-jettons", currency, page],
    queryFn: async ({ signal }) =>
      await fck.getPromoting(
        page,
        Math.floor(Date.now() / 1000 - pagination[timescale]),
        pagination[timescale] / 4,
        currency,
        signal
      ),
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: tab === "top",
    onSuccess: (results) => {
      results = results.data.sources.DeDust.jettons;

      setData((prevData) => [
        ...prevData,
        ...getList(
          Object.keys(results).reduce((acc, curr) => {
            acc[curr] = results[curr]?.prices || [];
            return acc;
          }, {}),
          jettons
        ),
     ].filter((v,i,a)=>a.findIndex(v2=>(v2.name===v.name))===i));
      setIsBottom(false);
    },
  });

  const { data: dataTrending, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending-jettons", currency, page],
    queryFn: async ({ signal }) =>
      await fck.getTrending(
        page,
        Math.floor(Date.now() / 1000 - pagination[timescale]),
        pagination[timescale] / 4,
        currency,
        signal
      ),
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: tab === "trending",
    onSuccess: (results) => {
      results = results.data.sources.DeDust.jettons;

      setData((prevData) => [
        ...prevData,
        ...getList(
          Object.keys(results).reduce((acc, curr) => {
            acc[curr] = results[curr]?.prices || [];
            return acc;
          }, {}),
          jettons
        ),
     ].filter((v,i,a)=>a.findIndex(v2=>(v2.name===v.name))===i));
      setIsBottom(false);
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
                  isLoading={false}
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
                    data?.sort(
                      (x, y) =>
                        (y.stats?.promoting_points || 0) -
                        (x.stats?.promoting_points || 0)
                    ) || []
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
