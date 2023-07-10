import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  Spacer,
  Container,
  Button,
  Dropdown,
  Loading,
} from "@nextui-org/react";
import cookie from "react-cookies";
import { FCard, Promote } from "components";
import { fck } from "api/fck";
import { GEN02, GEN11, GRA12, Trophy } from "assets/icons";
import { getList } from "utils/analytics";

import { AppContext } from "../../contexts";
import { pagination } from "../Analytics";

import { TimeScale } from "pages/Landing";
import axios from "axios";
import { usePairs } from "hooks";

export function Tokens() {
  const { t } = useTranslation();
  const {
    jettons,
    currency,
    page,
    timescale,
    setPage,
    isBottom,
    setIsBottom,
    setTimescale,
  } = useContext(AppContext);
  const [voteId, setVoteId] = useState<number>();
  const [tab, setTab] = useState<"top" | "trending" | "new">("top");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([]);
    setPage(1);

    return () => {
      setData([]);
      setPage(1);
    };
  }, [tab, timescale]);

  useEffect(() => {
    if (isBottom) {
      setPage((i) => i + 1);
    }
  }, [isBottom]);

  const { data: dataPromo, isLoading: isLoadingPromo } = useQuery({
    queryKey: ["promo-jettons", page],
    queryFn: async ({ signal }) =>
      await fck.getPromoting(signal, 10, (page - 1) * 10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    select: (response) => response?.data?.map(({ id }) => id),
  });

  const { data: dataTrending, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending-jettons", page],
    queryFn: async ({ signal }) =>
      await fck.getTrending(signal, 10, (page - 1) * 10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    select: (response) => response?.data?.map(({ id }) => id),
  });

  const { data: dataRecently, isLoading: isLoadingRecently } = useQuery({
    queryKey: ["recently-jettons", page],
    queryFn: async ({ signal }) =>
      await fck.getRecentlyAdded(signal, 10, (page - 1) * 10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    select: (response) => response?.data?.map(({ id }) => id),
  });

  const pairsPromo = usePairs("promo", dataPromo);
  const pairsTrending = usePairs("trending", dataTrending);
  const pairsRecently = usePairs("recently", dataRecently);

  const { isLoading: isLoadingStatsPromo } = useQuery({
    queryKey: ["stats-promo", timescale, currency, pairsPromo],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v3/analytics?pairs=${pairsPromo
            .map((list) => list.id)
            .join(",")}&period=${pagination[timescale]}&currency=${currency}`,
          { signal }
        )
        .then(({ data }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!pairsPromo?.length && !!jettons?.length && tab === "top",
    onSuccess: (results) => {
      setData((prevData) => [
        ...prevData,
        ...getList(results.data, jettons, pairsPromo),
      ]);

      if (page % 2) {
        setPage((i) => i + 1);
      } else {
        setIsBottom(false);
      }
    },
  });

  console.log(
    "timescale, currency, pairsTrending",
    timescale,
    currency,
    pairsTrending
  );
  const { isLoading: isLoadingStatsTrending } = useQuery({
    queryKey: ["stats-trending", timescale, currency, pairsTrending],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v3/analytics?pairs=${pairsTrending
            .map((list) => list.id)
            .join(",")}&period=${pagination[timescale]}&currency=${currency}`,
          { signal }
        )
        .then(({ data }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!pairsTrending?.length && !!jettons?.length && tab === "trending",
    onSuccess: (results) => {
      setData((prevData) => [
        ...prevData,
        ...getList(results.data, jettons, pairsTrending),
      ]);

      if (page % 2) {
        setPage((i) => i + 1);
      } else {
        setIsBottom(false);
      }
    },
  });

  const { isLoading: isLoadingStatsRecently } = useQuery({
    queryKey: ["stats-recently", timescale, currency, pairsRecently],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://api.fck.foundation/api/v3/analytics?pairs=${pairsRecently
            .map((list) => list.id)
            .join(",")}&period=${pagination[timescale]}&currency=${currency}`,
          { signal }
        )
        .then(({ data }) => data),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!pairsRecently?.length && !!jettons?.length && tab === "new",
    onSuccess: (results) => {
      setData((prevData) => [
        ...prevData,
        ...getList(results.data, jettons, pairsRecently),
      ]);

      if (page % 2) {
        setPage((i) => i + 1);
      } else {
        setIsBottom(false);
      }
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
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        auto
                        size="sm"
                        flat={tab !== "top"}
                        css={{ padding: "$0 $4" }}
                        onPress={() => setTab("top")}
                      >
                        <Trophy className="text-2xl fill-current" />
                        <Spacer x={0.4} /> {t("topVoted")}
                      </Button>
                      <Button
                        auto
                        size="sm"
                        flat={tab !== "trending"}
                        css={{ padding: "$0 $4" }}
                        onPress={() => setTab("trending")}
                      >
                        <GEN02 className="text-2xl fill-current" />
                        <Spacer x={0.4} /> {t("trending")}
                      </Button>
                      <Button
                        auto
                        size="sm"
                        flat={tab !== "new"}
                        css={{ padding: "$0 $4" }}
                        onPress={() => setTab("new")}
                      >
                        <GEN11 className="text-2xl fill-current" />
                        <Spacer x={0.4} /> {t("recentlyAdded")}
                      </Button>
                      <Dropdown isBordered>
                        <Dropdown.Button
                          flat
                          size="sm"
                          color="secondary"
                          css={{ padding: 10 }}
                        >
                          <GRA12 className="text-lg fill-current" />
                          <Spacer x={0.4} />
                          {timescale}
                        </Dropdown.Button>
                        <Dropdown.Menu
                          variant="flat"
                          color="primary"
                          selectedKeys={[timescale]}
                          selectionMode="single"
                          onSelectionChange={(key) =>
                            key && setTimescale(Object.values(key)[0])
                          }
                          css={{ minWidth: 50 }}
                        >
                          {[
                            // "1M", FIX THIS
                            "5M",
                            "15M",
                            "30M",
                            "1H",
                            "4H",
                            "1D",
                            "3D",
                            "7D",
                            "14D",
                            "30D",
                            "90D",
                            "180D",
                            "1Y",
                          ].map((n) => (
                            <Dropdown.Item key={n}>{t(n)}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
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
              {(isLoadingPromo ||
                isLoadingRecently ||
                isLoadingTrending ||
                isLoadingStatsPromo ||
                isLoadingStatsRecently ||
                isLoadingStatsTrending) && (
                <Grid xs={12} className="flex justify-center py-4">
                  <Loading />
                </Grid>
              )}
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Container>
      <Spacer y={0.4} />
    </>
  );
}
