import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Grid,
  Spacer,
  Text,
  Card,
  Input,
  Container,
  Image,
  Divider,
  Link,
  Progress,
  Badge,
  Popover,
  Dropdown,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import { FCard, Promote, Search, ThemeSwitcher } from "components";
import { fck } from "api/fck";
import {
  ARR09,
  ARR10,
  Code,
  Copy,
  Diamond,
  Explore,
  GEN02,
  GEN03,
  GEN04,
  GEN16,
  GEN20,
  GRA12,
  Heart,
  Ton,
  Tools,
  Trophy,
  Trust,
} from "assets/icons";
import { getList } from "utils/analytics";
import { ReactComponent as FCK } from "assets/logo.svg";
import { ReactComponent as Arrow } from "assets/arrow.svg";

import { AppContext } from "../../contexts";
import { pagination } from "../Analytics";

import "./index.scss";
import { IDO, Swap } from "./components";
import { copyTextToClipboard } from "utils";
import { usePairs } from "hooks";
import axios from "axios";

export type TimeScale = "1M" | "5M" | "30M" | "1H" | "4H" | "1D" | "30D";

const TCard = ({ type = "primary", value, amount, title }) => (
  <Card
    variant="flat"
    css={{ background: type === "primary" ? "$primary" : "$accents1" }}
  >
    <Card.Body css={{ pt: "$4", pb: "$4" }}>
      <Grid.Container direction="column" className="relative">
        <Grid>
          <Text
            className="text-3xl"
            color={type === "primary" ? "$secondary" : "$accents5"}
          >
            {value}%
          </Text>
        </Grid>
        <Grid css={{ position: "absolute", right: 0, top: 0 }}>
          <Text
            className="text-xs"
            color={type === "primary" ? "$white" : "$accents8"}
          >
            ~{amount}
          </Text>
        </Grid>
        <Grid>
          <Text color={type === "primary" ? "$white" : "$accents7"}>
            {title}
          </Text>
        </Grid>
      </Grid.Container>
    </Card.Body>
  </Card>
);

export function Home() {
  const { t } = useTranslation();
  const { jettons, currency, enabled, timescale, setIsMenuOpen, setTimescale } =
    useContext(AppContext);
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
    queryKey: ["promo-jettons"],
    queryFn: async ({ signal }) => await fck.getPromoting(signal),
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) => response?.data?.map(({ id }) => id),
  });

  const { data: dataTrending, isLoading: isLoadingTrending } = useQuery({
    queryKey: ["trending-jettons"],
    queryFn: async ({ signal }) => await fck.getTrending(signal),
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) => response?.data?.map(({ id }) => id),
  });

  const pairsPromo = usePairs("promo", dataPromo);
  const pairsTrending = usePairs("trending", dataTrending);

  const { data: dataStatsPromo, isLoading: isLoadingStatsPromo } = useQuery({
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
    enabled: !!pairsPromo?.length && !!jettons?.length,
    select: (results) => getList(results.data, jettons, pairsPromo),
  });

  const { data: dataStatsTrending, isLoading: isLoadingStatsTrending } =
    useQuery({
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
      enabled: !!pairsTrending?.length && !!jettons?.length,
      select: (results) => getList(results.data, jettons, pairsTrending),
    });

  const onCopy = () => {
    copyTextToClipboard("EQA6TSGRCU46M9RgHvpRu1LcW6o1RRbhYrdwaVU4X4FEp_Z2");
    toast.success(t("copied"), {
      position: toast.POSITION.TOP_RIGHT,
      theme: enabled ? "dark" : "light",
    });
  };

  const loading =
    isLoadingPromo ||
    isLoadingTrending ||
    isLoadingStatsPromo ||
    isLoadingStatsTrending;

  return (
    <>
      <Container md css={{ px: "$8" }}>
        <Grid.Container
          gap={1}
          justify="center"
          css={{ minHeight: "70vh", pt: 16, pb: 32, pl: 0, pr: 0 }}
        >
          <Grid xs={12} sm={6} css={{ mb: "$8" }}>
            <Grid.Container gap={2} className="text-center">
              <Grid xs={12}>
                <Text
                  className="text-2xl w-full"
                  css={{
                    textGradient: "-180deg, $primary 25%, $secondary 125%",
                  }}
                  weight="bold"
                >
                  {t("bridgingBlockchain")}
                </Text>
              </Grid>
              <Grid xs={12}>
                <Text className="text-base w-full" css={{ mt: "-$8" }}>
                  {t("bridgingBlockchainDescription")}
                </Text>
              </Grid>
              <Spacer y={0.8} />
              <Grid xs={12} css={{ p: 0 }}>
                <Grid.Container
                  gap={1}
                  className="main-search"
                  css={{ m: "-$8 -$8 -$8 -$8", width: "calc(100% + $16)" }}
                >
                  <Grid xs={12}>
                    <Search />
                  </Grid>
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </Grid>
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
                    dataStatsPromo
                      ?.sort((x, y) => Number(y.verified) - Number(x.verified))
                      ?.sort(
                        (x, y) =>
                          (y?.stats?.promoting_points || 0) -
                          (x?.stats?.promoting_points || 0)
                      ) || []
                  }
                  setVoteId={setVoteId}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <FCard
                  isLoading={loading}
                  title={
                    <Grid.Container justify="space-between" wrap="nowrap">
                      <Grid.Container wrap="nowrap" css={{ minWidth: "auto" }}>
                        <GEN02
                          className="text-2xl"
                          style={{
                            fill: "var(--nextui-colors-link)",
                          }}
                        />
                        <Spacer x={0.4} /> {t("trending")}
                      </Grid.Container>
                      <Grid>
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
                      </Grid>
                    </Grid.Container>
                  }
                  list={
                    dataStatsTrending
                      ?.sort((x, y) => Number(y.verified) - Number(x.verified))
                      ?.sort((x, y) => y.volume - x.volume) || []
                  }
                  setVoteId={setVoteId}
                />
              </Grid>
            </Grid.Container>
          </Grid>
          {/* <Grid xs={12} sm={4}>
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
        </Grid> */}
          <Grid xs={12} sm={8} css={{ mt: "$8" }}>
            <Grid.Container justify="space-between">
              <Grid xs={12}>
                <Card
                  variant="bordered"
                  css={{ borderRadius: "var(--nextui-radii-lg)" }}
                >
                  <Card.Body css={{ p: 0, overflow: "hidden" }}>
                    <Grid.Container gap={1} justify="space-between">
                      <Grid xs={12} sm={8} css={{ p: "$8" }}>
                        <Grid.Container
                          gap={4}
                          direction="column"
                          css={{ h: "fit-content", px: "$4" }}
                        >
                          <Grid>
                            <Text
                              className="text-2xl"
                              css={{
                                mt: -16,
                                textGradient:
                                  "45deg, $primary 25%, $secondary 125%",
                              }}
                            >
                              {t("introducingToken")}
                            </Text>
                          </Grid>
                          <Grid>
                            <Text
                              className="text-base"
                              weight="bold"
                              css={{ mt: -32 }}
                            >
                              {t("introducingTokenSubtitle")}
                            </Text>
                          </Grid>
                          <Grid>
                            <Text css={{ mt: -32 }}>
                              {t("introducingTokenDescription")}
                            </Text>
                          </Grid>
                        </Grid.Container>
                      </Grid>
                      <Grid
                        xs={12}
                        sm={4}
                        className="flex justify-center"
                        css={{ bg: "#0088CC" }}
                      >
                        <img src="/img/coin.png" className="floating-coin" />
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Grid>
              <Grid xs={12} css={{ mt: 32 }}>
                <Grid.Container wrap="nowrap">
                  <Grid>
                    <Card variant="bordered">
                      <Card.Body
                        css={{
                          width: "4rem",
                          height: "4rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text size="$2xl" color="primary">
                          1
                        </Text>
                      </Card.Body>
                    </Card>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Text color="primary" weight="bold">
                      {t("userEmpowerment")}:
                    </Text>
                    <Text>{t("userEmpowermentDescription")}</Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={1} />
              <Grid xs={12}>
                <Grid.Container wrap="nowrap">
                  <Grid>
                    <Card variant="bordered">
                      <Card.Body
                        css={{
                          width: "4rem",
                          height: "4rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text size="$2xl" color="primary">
                          2
                        </Text>
                      </Card.Body>
                    </Card>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Text color="primary" weight="bold">
                      {t("innovationDevelopment")}:
                    </Text>
                    <Text>{t("innovationDevelopmentDescription")}</Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={0.4} />
              <Grid xs={12}>
                <Grid.Container wrap="nowrap">
                  <Grid>
                    <Card variant="bordered">
                      <Card.Body
                        css={{
                          width: "4rem",
                          height: "4rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text size="$2xl" color="primary">
                          3
                        </Text>
                      </Card.Body>
                    </Card>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Text color="primary" weight="bold">
                      {t("versatility")}:
                    </Text>
                    <Text>{t("versatilityDescription")}</Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={0.4} />
              <Grid xs={12}>
                <Grid.Container wrap="nowrap">
                  <Grid>
                    <Card variant="bordered">
                      <Card.Body
                        css={{
                          width: "4rem",
                          height: "4rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text size="$2xl" color="primary">
                          4
                        </Text>
                      </Card.Body>
                    </Card>
                  </Grid>
                  <Spacer x={1} />
                  <Grid>
                    <Text color="primary" weight="bold">
                      {t("rewardingParticipation")}:
                    </Text>
                    <Text>{t("rewardingParticipationDescription")}</Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={1} />
              <Grid xs={12}>
                <Grid.Container gap={1} justify="center">
                  <Grid>
                    <Button flat className="min-w-auto">
                      <FCK className="fill-current w-8 h-8" />{" "}
                      <Spacer x={0.4} />
                      <Text color="currentColor">{t("buyFCKDeDust")}</Text>
                    </Button>
                  </Grid>
                  <Grid>
                    <Promote
                      voteId={voteId}
                      setVoteId={setVoteId}
                      trigger={
                        <Button
                          flat
                          className="min-w-auto"
                          css={{ pointerEvents: "none" }}
                        >
                          <Heart className="text-2xl text-current text-red-500 fill-red-500" />
                          <Spacer x={0.4} />
                          <Text color="currentColor">{t("voteFCK")}</Text>
                        </Button>
                      }
                    />
                  </Grid>
                  <Grid>
                    <Button flat className="min-w-auto" onClick={onCopy}>
                      <Copy className="text-current text-2xl" />
                      <Spacer x={0.4} />
                      <Text color="currentColor">{t("copyToken")}</Text>
                    </Button>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid xs={12} css={{ mt: "$16" }}>
                <Grid.Container justify="center">
                  <Text size="$2xl" color="primary">
                    {t("ourTokenomics")}:
                  </Text>
                  <Spacer x={0.4} />
                  <Text size="$2xl">{t("ourBlueprint")}</Text>
                </Grid.Container>
              </Grid>
              <Grid
                xs={12}
                className="text-center"
                css={{ display: "block !important" }}
              >
                {t("ourBlueprintDescription1")}{" "}
                <text style={{ color: "var(--nextui-colors-primary)" }}>
                  300,000 FCK
                </text>
                , {t("ourBlueprintDescription2")}
              </Grid>
              <Grid xs={12} sm={5} css={{ mt: "$16" }}>
                <Card variant="bordered">
                  <Card.Header
                    css={{ display: "flex", flexDirection: "column" }}
                  >
                    <Text color="primary" weight="bold" className="text-2xl">
                      V1 {t("tokenomics")}
                    </Text>
                    <Text color="primary" weight="bold" className="text-base">
                      Fragment Checker {t("token")}
                    </Text>
                    <Text color="$accents6" weight="bold" className="text-xs">
                      ({t("deprecated")})
                    </Text>
                  </Card.Header>
                  <Card.Body>
                    <Grid.Container direction="column">
                      <Grid>
                        <TCard
                          type="secondary"
                          value="35"
                          amount="105 000"
                          title={t("salesDEX")}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          type="secondary"
                          value="25"
                          amount="75 000"
                          title={t("development")}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          type="secondary"
                          value="20"
                          amount="60 000"
                          title={t("projectPromotion")}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          type="secondary"
                          value="20"
                          amount="60 000"
                          title={t("teamShareholders")}
                        />
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Grid>
              <Grid
                xs={12}
                sm={1}
                className="flex justify-center"
                css={{ mt: "$8" }}
              >
                <Arrow
                  height="auto"
                  className="floating-arrow"
                  style={{ animationDelay: "2s", minWidth: 64 }}
                />
              </Grid>
              <Grid xs={12} sm={5} css={{ mt: "$16" }}>
                <Card variant="bordered">
                  <Card.Header
                    css={{ display: "flex", flexDirection: "column" }}
                  >
                    <Text color="primary" weight="bold" className="text-2xl">
                      V2 {t("tokenomics")}
                    </Text>
                    <Text color="primary" weight="bold" className="text-base">
                      Find & Check {t("token")}
                    </Text>
                    <Text color="success" weight="bold" className="text-xs">
                      ({t("active")})
                    </Text>
                  </Card.Header>
                  <Card.Body>
                    <Grid.Container direction="column">
                      <Grid>
                        <TCard
                          value="42"
                          amount="125 000"
                          title={t("currentHolders")}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          value="16.67"
                          amount="50 000"
                          title={t("funding")}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          value="14.67"
                          amount="45 000"
                          title={`${t("teamShareholders")}/36 ${t("mo")}`}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard value="16.67" amount="50 000" title={t("ido")} />
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Grid>
              <Grid xs={12} css={{ mt: "$8" }}>
                <Grid.Container
                  gap={2}
                  css={{ m: "-$10", w: "calc(100% + $20)" }}
                >
                  <Grid
                    xs={12}
                    sm={6}
                    justify="center"
                    css={{ height: "fit-content" }}
                  >
                    <IDO />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Grid.Container>
                      <Grid xs={12}>
                        <Card variant="bordered">
                          <Card.Header css={{ pb: 0 }}>
                            <Text className="text-2xl" color="primary">
                              {t("swapFee")}
                            </Text>
                          </Card.Header>
                          <Card.Body css={{ pt: 0 }}>
                            <Text>{t("swapFeeDescription")}</Text>
                          </Card.Body>
                        </Card>
                      </Grid>
                      <Spacer y={0.8} />
                      <Grid xs={12}>
                        <Card variant="bordered">
                          <Card.Header css={{ pb: 0 }}>
                            <Text className="text-2xl" color="primary">
                              {t("liquidityStability")}
                            </Text>
                          </Card.Header>
                          <Card.Body css={{ pt: 0 }}>
                            <Text>{t("liquidityStabilityDescription")}</Text>
                          </Card.Body>
                        </Card>
                      </Grid>
                      <Spacer y={0.8} />
                      <Grid xs={12}>
                        <Card variant="bordered">
                          <Card.Header css={{ pb: 0 }}>
                            <Text className="text-2xl" color="primary">
                              {t("futureDevelopment")}
                            </Text>
                          </Card.Header>
                          <Card.Body css={{ pt: 0 }}>
                            <Text>{t("futureDevelopmentDescription")}</Text>
                          </Card.Body>
                        </Card>
                      </Grid>
                      <Spacer y={0.8} />
                      <Grid xs={12}>
                        <Swap />
                      </Grid>
                    </Grid.Container>
                  </Grid>
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Container>

      <Spacer y={0.4} />
      <div
        className="w-full section-landing"
        style={{
          borderTop: "1px solid var(--nextui-colors-border)",
          borderBottom: "1px solid var(--nextui-colors-border)",
        }}
      >
        <Container md>
          <Grid.Container justify="center" alignItems="center">
            <Grid xs={12} sm={8}>
              <Grid.Container
                wrap="nowrap"
                justify="space-between"
                alignItems="center"
              >
                <Grid css={{ maxW: 400 }}>
                  <Grid.Container direction="column">
                    <Grid>
                      <Text className="text-xl" weight="bold" color="primary">
                        {t("makeChoice")}
                      </Text>
                    </Grid>
                    <Spacer y={0.8} />
                    <Grid>
                      <Text className="text-base">
                        {t("makeChoiceDescription")}
                      </Text>
                    </Grid>
                    <Spacer y={0.8} />
                    <Grid>
                      <Promote
                        voteId={voteId}
                        setVoteId={setVoteId}
                        trigger={
                          <Button flat auto css={{ pointerEvents: "none" }}>
                            <Heart className="text-lg fill-current text-red-500 fill-red-500" />{" "}
                            <Spacer x={0.4} /> {t("castVote")}
                          </Button>
                        }
                      />
                    </Grid>
                  </Grid.Container>
                </Grid>
                <Grid css={{ display: "none", "@xs": { display: "block" } }}>
                  <FCK className="fill-current w-48 h-48" />
                </Grid>
              </Grid.Container>
            </Grid>
          </Grid.Container>
        </Container>
      </div>
      <Spacer y={0.4} />
      <Container md className="py-8">
        <Grid.Container direction="column" justify="center" alignItems="center">
          <Grid>
            <Text className="text-2xl">{t("ourMission")}</Text>
          </Grid>
          <Spacer y={0.8} />
          <Grid sm={8}>
            <Text className="text-base text-center">
              {t("ourMissionDescription")}
            </Text>
          </Grid>
          <Spacer y={1} />
          <Grid>
            <Container xs>
              <Grid.Container gap={2} className="text-center">
                <Grid xs={6} className="flex-col place-items-center">
                  <Explore className="w-20 h-20" />
                  <Spacer y={0.8} />
                  <Text className="text-base">
                    <text
                      className="font-bold"
                      style={{ color: "var(--nextui-colors-primary)" }}
                    >
                      {t("exploreBlockchain")}:
                    </text>{" "}
                    {t("exploreBlockchainDescription")}
                  </Text>
                </Grid>
                <Grid xs={6} className="flex-col place-items-center">
                  <Tools className="w-20 h-20" />
                  <Spacer y={0.8} />
                  <Text className="text-base">
                    <text
                      className="font-bold"
                      style={{ color: "var(--nextui-colors-primary)" }}
                    >
                      {t("analyzeTrends")}:
                    </text>{" "}
                    {t("analyzeTrendsDescription")}
                  </Text>
                </Grid>
                <Grid xs={6} className="flex-col place-items-center">
                  <Trust className="w-20 h-20" />
                  <Spacer y={0.8} />
                  <Text className="text-base">
                    <text
                      className="font-bold"
                      style={{ color: "var(--nextui-colors-primary)" }}
                    >
                      {t("trustworthyInfo")}:
                    </text>{" "}
                    {t("trustworthyInfoDescription")}
                  </Text>
                </Grid>
                <Grid xs={6} className="flex-col place-items-center">
                  <Code className="w-20 h-20" />
                  <Spacer y={0.8} />
                  <Text className="text-base">
                    <text
                      className="font-bold"
                      style={{ color: "var(--nextui-colors-primary)" }}
                    >
                      {t("engageNFT")}:
                    </text>{" "}
                    {t("engageNFTDescription")}
                  </Text>
                </Grid>
              </Grid.Container>
            </Container>
          </Grid>
        </Grid.Container>
      </Container>
      <Spacer y={0.4} />
      <div className="w-full section-landing">
        <Container md className="relative">
          <Grid.Container justify="center" alignItems="center">
            <Grid xs={12} sm={8}>
              <Grid.Container justify="space-between" alignItems="center">
                <Grid>
                  <Image src="/img/mockup.png" css={{ minWidth: 250 }} />
                </Grid>
                <Grid>
                  <Grid.Container direction="column">
                    <Grid>
                      <Text className="text-xl" weight="bold" color="primary">
                        {t("engageNFTInterface")}
                      </Text>
                    </Grid>
                    <Spacer y={0.8} />
                    <Grid>
                      <Text className="text-base">
                        {t("engageNFTInterfaceDescription")}
                      </Text>
                    </Grid>
                    <Spacer y={0.8} />
                    <Grid>
                      <Popover onOpenChange={setIsMenuOpen}>
                        <Popover.Trigger>
                          <Button flat auto>
                            <Diamond className="text-lg fill-current" />{" "}
                            <Spacer x={0.4} /> {t("changeTheme")}
                          </Button>
                        </Popover.Trigger>
                        <Popover.Content>
                          <ThemeSwitcher />
                        </Popover.Content>
                      </Popover>
                    </Grid>
                  </Grid.Container>
                </Grid>
              </Grid.Container>
            </Grid>
          </Grid.Container>
          <img
            className="stone stone-1"
            src="/img/rhombus.png"
            alt="blur-nft"
          />
          <img
            className="stone stone-2"
            src="/img/kite.png"
            alt="blur-nft"
          />
          <img
            className="stone stone-3"
            src="/img/diamond.png"
            alt="blur-nft"
          />
          <img
            className="stone stone-4"
            src="/img/drop.png"
            alt="blur-nft"
          />
        </Container>
      </div>
      <Spacer y={0.4} />
      <Container md className="py-8">
        <Grid.Container direction="column" justify="center" alignItems="center">
          <Grid>
            <Text className="text-2xl">{t("exploreBots")}</Text>
          </Grid>
          <Spacer y={1} />
          <Grid xs={12} sm={8} css={{ w: "100%" }}>
            <Card variant="bordered">
              <Card.Body>
                <Grid.Container
                  // gap={2.6}
                  className="w-full"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid>
                    <Grid.Container
                      // gap={1.6}
                      wrap="nowrap"
                      alignItems="center"
                      // css={{ m: "-$8", }}
                    >
                      <Grid>
                        <Image
                          src="/img/analyticsbot.png"
                          width={100}
                          css={{ borderRadius: "100%" }}
                        />
                      </Grid>
                      <Spacer x={0.8} />
                      <Grid>
                        <Text className="text-xl">FCK Analytics</Text>
                        <Spacer y={0.4} />
                        <Text className="text-base max-w-[325px]">
                          {t("FCKBotDescription")}
                        </Text>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                  <Spacer x={0.8} />
                  <Grid css={{ py: "$8", mb: "-$8", "@xs": { mb: "unset" } }}>
                    <Link href="https://FCKAnalyticsBot.t.me" target="_blank">
                      <Button flat css={{ minWidth: "auto" }}>
                        <GEN16 className="text-2xl fill-current" />
                        <Spacer x={0.4} />
                        @FCKAnalyticsBot
                      </Button>
                    </Link>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          </Grid>
          <Spacer y={1} />
          <Grid xs={12} sm={8} css={{ w: "100%" }}>
            <Grid.Container gap={0} justify="center" alignItems="center">
              <Grid xs={12}>
                <Card variant="bordered">
                  <Card.Body>
                    <Grid.Container
                      // gap={2.6}
                      className="w-full"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid>
                        <Grid.Container
                          // gap={1.6}
                          wrap="nowrap"
                          alignItems="center"
                          // css={{ m: "-$8", }}
                        >
                          <Grid>
                            <Image
                              src="/img/bot.png"
                              width={100}
                              css={{ borderRadius: "100%" }}
                            />
                          </Grid>
                          <Spacer x={0.8} />
                          <Grid>
                            <Text className="text-xl">
                              Fragment Checker Bot
                            </Text>
                            <Spacer y={0.4} />
                            <Text className="text-base max-w-[325px]">
                              {t("FragmentBotDescription")}
                            </Text>
                          </Grid>
                        </Grid.Container>
                      </Grid>
                      <Spacer x={0.8} />
                      <Grid
                        css={{ py: "$8", mb: "-$8", "@xs": { mb: "unset" } }}
                      >
                        <Link
                          href="https://FCKAnalyticsBot.t.me"
                          target="_blank"
                        >
                          <Button flat css={{ minWidth: "auto" }}>
                            <GEN16 className="text-2xl fill-current" />
                            <Spacer x={0.4} />
                            @FragmentCheckerBot
                          </Button>
                        </Link>
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Container>
      <Spacer y={0.4} />
    </>
  );
}
