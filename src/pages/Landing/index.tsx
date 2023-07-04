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
  Ton,
  Tools,
  Trophy,
  Trust,
} from "assets/icons";
import { getList } from "utils/analytics";
import { ReactComponent as FCK } from "assets/logo.svg";
import Arrow from "assets/arrow.svg";

import { AppContext } from "../../contexts";
import { pagination } from "../Analytics";

import "./index.scss";
import { IDO, Swap } from "./components";

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
  const { jettons, currency, setIsMenuOpen } = useContext(AppContext);
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
          <Grid xs={12} sm={8} css={{ mb: "$8" }}>
            <Grid.Container gap={2} className="text-center">
              <Grid xs={12}>
                <Text
                  className="text-2xl w-full"
                  css={{
                    textGradient: "-180deg, $primary 25%, $secondary 125%",
                  }}
                  weight="bold"
                >
                  Bridging Blockchain Complexity with Analytical Simplicity.
                </Text>
              </Grid>
              <Grid xs={12}>
                <Text className="text-base w-full" css={{ mt: "-$8" }}>
                  Unlock Insights, Empower Decisions with TON Analytics
                </Text>
              </Grid>
              <Spacer y={0.8} />
              <Grid xs={12} css={{ p: 0 }}>
                <Grid.Container
                  gap={1}
                  className="main-search"
                  css={{ m: "-$8 -$8 -$4 -$8", width: "calc(100% + $16)" }}
                >
                  <Grid xs={12}>
                    <Search />
                  </Grid>
                </Grid.Container>
                {/* <Text className="text-base" color="success" weight="bold">
                {t("signUpToday")}
              </Text>
              <Text className="text-2xl" color="light" weight="bold">
                {t("header1")}
              </Text>

              <Text className="text-2xl" weight="bold">
                {t("header2")}
              </Text>
              <Text className="text-2xl" color="light" weight="bold">
                {t("header3")}
              </Text>
              <Text className="text-sm" color="light">
                {t("headerDesc").replace(
                  "$1",
                  (jettons?.length || 0).toString()
                )}
              </Text> */}
              </Grid>
            </Grid.Container>
          </Grid>
          {/* <Grid xs={12} css={{ maxW: "100%", "@xs": { minWidth: 400 } }}>
          <Grid.Container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid xs={12} sm={8} className="main-search">
              <GEN04
                style={{
                  fill: "var(--nextui-colors-link)",
                  fontSize: 24,
                  position: "absolute",
                  zIndex: 2,
                  top: "50%",
                  transform: "translate3d(50%, -50%, 0)",
                }}
              />
              <Input placeholder="Search token or wallet" animated={false} type="search" width="100%" />
              {/* <Text className="text-base" color="success" weight="bold">
                {t("signUpToday")}
              </Text>
              <Text className="text-2xl" color="light" weight="bold">
                {t("header1")}
              </Text>

              <Text className="text-2xl" weight="bold">
                {t("header2")}
              </Text>
              <Text className="text-2xl" color="light" weight="bold">
                {t("header3")}
              </Text>
              <Text className="text-sm" color="light">
                {t("headerDesc").replace(
                  "$1",
                  (jettons?.length || 0).toString()
                )}
              </Text>
            </Grid>
            {/* <Grid>
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
                </Grid> 
              </Grid.Container>
            </Grid> 
          </Grid.Container>
        </Grid> */}
          {/* <Grid css={{ maxW: '100%', "@xs": { maxW: 400 } }}>
          <Card css={{ height: "fit-content" }}>
            <Card.Body>
              <Grid.Container gap={1} justify="space-between" css={{ pb: 0 }}>
                <Grid xs={12}>
                  <Calc />
                </Grid>
              </Grid.Container>
            </Card.Body>
          </Card>
        </Grid> */}
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
                <Card>
                  <Card.Body css={{ p: 0, overflow: "hidden" }}>
                    <Grid.Container gap={1} justify="space-between">
                      <Grid xs={12} sm={8} css={{ p: "$8" }}>
                        <Grid.Container
                          gap={4}
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
                              Introducing FCK Token
                            </Text>
                          </Grid>
                          <Grid>
                            <Text
                              className="text-base"
                              weight="bold"
                              css={{ mt: -32 }}
                            >
                              The cornerstone of the Find & Check initiative
                              within the TON ecosystem.
                            </Text>
                          </Grid>
                          <Grid>
                            <Text css={{ mt: -32 }}>
                              Serving as the fuel of our unique set of
                              analytical tools, FCK Token empowers the TON
                              network users, catalyzes our initiatives, and
                              opens up new possibilities for interaction with
                              the blockchain.
                            </Text>
                          </Grid>
                        </Grid.Container>
                      </Grid>
                      <Grid xs={12} sm={4} css={{ bg: "#0088CC" }}>
                        <img src="/img/coin.png" className="floating-coin" />
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Grid>
              <Grid xs={12} css={{ mt: 32 }}>
                <Grid.Container wrap="nowrap">
                  <Grid>
                    <Card>
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
                      User Empowerment:
                    </Text>
                    <Text>
                      FCK Token gives the power back to the users, allowing you
                      to access premium features and gain influence over the
                      platform&#39;s future direction.
                    </Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={0.4} />
              <Grid xs={12}>
                <Grid.Container wrap="nowrap">
                  <Grid>
                    <Card>
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
                      Innovation and Development:
                    </Text>
                    <Text>
                      The FCK Token supports continuous innovation and
                      development, enabling us to stay ahead of market trends
                      and meet our user&#39;s evolving needs.
                    </Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={0.4} />
              <Grid xs={12}>
                <Grid.Container wrap="nowrap">
                  <Grid>
                    <Card>
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
                      Versatility:
                    </Text>
                    <Text>
                      FCK Token enables a range of operations including voting
                      for tokens on our platform, trend analytics, wallet
                      operations, and more.
                    </Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Spacer y={0.4} />
              <Grid xs={12}>
                <Grid.Container wrap="nowrap">
                  <Grid>
                    <Card>
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
                      Rewarding Participation:
                    </Text>
                    <Text>
                      FCK Token&#39;s model encourages active participation,
                      offering unique incentives for community members who
                      contribute to our growth and development.
                    </Text>
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
                      <Text color="currentColor">Buy $FCK on DeDust</Text>
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
                          <GEN03 className="fill-current text-2xl" />
                          <Spacer x={0.4} />
                          <Text color="currentColor">Vote using $FCK</Text>
                        </Button>
                      }
                    />
                  </Grid>
                  <Grid>
                    <Button flat className="min-w-auto">
                      <Copy className="text-current text-2xl" />
                      <Spacer x={0.4} />
                      <Text color="currentColor">Copy Token Contract</Text>
                    </Button>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid xs={12} css={{ mt: "$16" }}>
                <Grid.Container justify="center">
                  <Text size="$2xl" color="primary">
                    Our Tokenomics:
                  </Text>
                  <Spacer x={0.4} />
                  <Text size="$2xl">The Find & Check Blueprint</Text>
                </Grid.Container>
              </Grid>
              <Grid
                xs={12}
                className="text-center"
                css={{ display: "block !important" }}
              >
                At Find & Check, we know that effective tokenomics drive a
                successful decentralized network. That&#39;s why w&#39;ve
                designed a robust tokenomics model with{" "}
                <text style={{ color: "var(--nextui-colors-primary)" }}>
                  300,000 tokens
                </text>
                , ensuring network stability and growth. With a thoughtful
                distribution plan and an increase in swap fees, we are primed to
                offer a balanced and sustainable ecosystem.
              </Grid>
              <Grid xs={12} sm={5} css={{ mt: "$16" }}>
                <Card>
                  <Card.Header
                    css={{ display: "flex", flexDirection: "column" }}
                  >
                    <Text color="primary" weight="bold" className="text-2xl">
                      V1 {t("tokenomics")}
                    </Text>
                    <Text color="primary" weight="bold" className="text-base">
                      Fragment Checker Token
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
                          title={"Sales Via DeDust.io DEX"}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          type="secondary"
                          value="25"
                          amount="75 000"
                          title={"FCK Foundation Development"}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          type="secondary"
                          value="20"
                          amount="60 000"
                          title={"Project Promotion"}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          type="secondary"
                          value="20"
                          amount="60 000"
                          title={"Team Shareholders"}
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
                <Image
                  src={Arrow}
                  width={32}
                  className="floating-arrow"
                  css={{ animationDelay: "1s" }}
                />
                <Image
                  src={Arrow}
                  width={48}
                  className="floating-arrow"
                  css={{ animationDelay: "500ms" }}
                />
                <Image
                  src={Arrow}
                  width={64}
                  className="floating-arrow"
                  css={{ animationDelay: "0ms" }}
                />
              </Grid>
              <Grid xs={12} sm={5} css={{ mt: "$16" }}>
                <Card>
                  <Card.Header
                    css={{ display: "flex", flexDirection: "column" }}
                  >
                    <Text color="primary" weight="bold" className="text-2xl">
                      V2 Tokenomics
                    </Text>
                    <Text color="primary" weight="bold" className="text-base">
                      Find & Check Token
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
                          amount="126 000"
                          title={"Current Holders"}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          value="16.67"
                          amount="50 000"
                          title={"Funding"}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard
                          value="14.67"
                          amount="44 000"
                          title={"Team Shareholders/36 mo."}
                        />
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid>
                        <TCard value="16.67" amount="50 000" title={"IDO"} />
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
                        <Card>
                          <Card.Header css={{ pb: 0 }}>
                            <Text className="text-2xl" color="primary">
                              Swap Fee and Unsold Tokens
                            </Text>
                          </Card.Header>
                          <Card.Body css={{ pt: 0 }}>
                            <Text>
                              To facilitate a balanced ecosystem, we have raised
                              our swap fee from 0.4% to 1%. Unsold tokens from
                              the IDO will be reserved for mining, to reward and
                              incentivize our token holders.
                            </Text>
                          </Card.Body>
                        </Card>
                      </Grid>
                      <Spacer y={0.8} />
                      <Grid xs={12}>
                        <Card>
                          <Card.Header css={{ pb: 0 }}>
                            <Text className="text-2xl" color="primary">
                              Liquidity and Stability
                            </Text>
                          </Card.Header>
                          <Card.Body css={{ pt: 0 }}>
                            <Text>
                              We have assigned 10% of the total token supply
                              (~30,000 tokens) for Liquidity Lock from the IDO
                              as this is one of our primary objectives in
                              constructing a robust tokenomics model is ensuring
                              liquidity and price stability.
                            </Text>
                          </Card.Body>
                        </Card>
                      </Grid>
                      <Spacer y={0.8} />
                      <Grid xs={12}>
                        <Card>
                          <Card.Header css={{ pb: 0 }}>
                            <Text className="text-2xl" color="primary">
                              Future Development
                            </Text>
                          </Card.Header>
                          <Card.Body css={{ pt: 0 }}>
                            <Text>
                              Our token model allocates a significant share
                              (14.67%) for future development. These funds will
                              fuel new features, enhancements, and the overall
                              growth of the Find & Check ecosystem.
                            </Text>
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
      <div className="w-full section-landing">
        <Container md>
          <Grid.Container justify="center" alignItems="center">
            <Grid xs={12} sm={8}>
              <Grid.Container
                wrap="nowrap"
                justify="space-between"
                alignItems="center"
              >
                <Grid css={{ maxW: 250 }}>
                  <Grid.Container direction="column">
                    <Grid>
                      <Text className="text-xl" weight="bold" color="primary">
                        Make your choice count
                      </Text>
                    </Grid>
                    <Spacer y={0.8} />
                    <Grid>
                      <Text className="text-base">
                        Use $FCK Token to vote for any token listed at Find &
                        Check. Help your favourites stay at the top!
                      </Text>
                    </Grid>
                    <Spacer y={0.8} />
                    <Grid>
                      <Promote
                        voteId={voteId}
                        setVoteId={setVoteId}
                        trigger={
                          <Button flat auto css={{ pointerEvents: "none" }}>
                            <GEN03 className="text-lg fill-current" />{" "}
                            <Spacer x={0.4} /> Cast a vote
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
            <Text className="text-2xl">Our Mission</Text>
          </Grid>
          <Spacer y={0.8} />
          <Grid>
            <Text className="text-base text-center">
              Born on the TON blockchain, Find & Check began with a vision to
              redefine user experiences within the network. Our journey revolves
              around providing users with precise project data and improving
              decentralized exchange functionalities.
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
                      Explore Blockchain:
                    </text>{" "}
                    Dive into an enhanced TON network experience.
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
                      Analyze Trends:
                    </text>{" "}
                    Leverage top-tier tools for TON market insight.
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
                      Trustworthy Info:
                    </text>{" "}
                    Rely on accurate project data within the TON network.
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
                      Explore Blockchain:
                    </text>{" "}
                    Dive into an enhanced TON network experience.
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
                        Engage FCK interface with TON Diamonds NFTs
                      </Text>
                    </Grid>
                    <Spacer y={0.8} />
                    <Grid>
                      <Text className="text-base">
                        Connect your wallet to apply TON Diamond theme.
                      </Text>
                    </Grid>
                    <Spacer y={0.8} />
                    <Grid>
                      <Popover onOpenChange={setIsMenuOpen}>
                        <Popover.Trigger>
                          <Button flat auto>
                            <Diamond className="text-lg fill-current" />{" "}
                            <Spacer x={0.4} /> Change theme
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
            src="https://ton.diamonds/cdn-cgi/image/width=250,quality=100/images/main-landing/rhombus.png"
            alt="blur-nft"
          />
          <img
            className="stone stone-2"
            src="https://ton.diamonds/cdn-cgi/image/width=250,quality=100/images/main-landing/kite.png"
            alt="blur-nft"
          />
          <img
            className="stone stone-3"
            src="https://ton.diamonds/cdn-cgi/image/width=250,quality=100/images/main-landing/diamond.png"
            alt="blur-nft"
          />
          <img
            className="stone stone-4"
            src="https://ton.diamonds/cdn-cgi/image/width=250,quality=100/images/main-landing/drop.png"
            alt="blur-nft"
          />
        </Container>
      </div>
      <Spacer y={0.4} />
      <Container md className="py-8" css={{ px: 0 }}>
        <Grid.Container direction="column" justify="center" alignItems="center">
          <Grid>
            <Text className="text-2xl">Explore our Telegram Bots</Text>
          </Grid>
          <Spacer y={1} />
          <Grid xs={12} sm={8} css={{ w: "100%" }}>
            <Card>
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
                        <Text className="text-base">
                          Get in-depth blockchain interaction insights.
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
                <Card>
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
                            <Text className="text-base">
                              Analytics bot with AI Telegram username generator.
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
