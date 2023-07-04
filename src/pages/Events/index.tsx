import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import cn from "classnames";
// import Time from 'react-countdown';
import { Grid } from "@nextui-org/react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  ABS20,
  ABS22,
  ABS23,
  ABS24,
  ABS25,
  ABS26,
  ABS27,
  ABS28,
  ABS32,
  ABS46,
  GEN02,
  GRA10,
} from "assets/icons";

import { ReactComponent as FCK } from "assets/logo.svg";

import "./index.scss";

// const gradient = keyframes({
//   "0%": { textGradient: "45deg, $blue600 0%, $green600 100%" },
//   "10%": { textGradient: "45deg, $blue600 -5%, $green600 95%" },
//   "20%": { textGradient: "45deg, $blue600 -10%, $green600 90%" },
//   "30%": { textGradient: "45deg, $blue600 -15%, $green600 85%" },
//   "40%": { textGradient: "45deg, $blue600 -20%, $green600 80%" },
//   "50%": { textGradient: "45deg, $blue600 -15%, $green600 85%" },
//   "60%": { textGradient: "45deg, $blue600 -10%, $green600 90%" },
//   "70%": { textGradient: "45deg, $blue600 -5%, $green600 95%" },
//   "80%": { textGradient: "45deg, $blue600 0%, $green600 100%" },
//   "90%": { textGradient: "45deg, $blue600 5%, $green600 105%" },
//   "100%": { textGradient: "45deg, $blue600 0%, $green600 100%" },
// });

export const Events = () => {
  const { t } = useTranslation();

  // const Completion = () => (
  //   <Link href="https://t.me/tokenFCK" target="_blank">
  //     <Button color="gradient" css={{ margin: 32 }}>
  //       {t("joinNow")}
  //     </Button>
  //   </Link>
  // );

  // const renderer = ({ days, hours, minutes, seconds, completed }) => {
  //   if (completed) {
  //     // Render a completed state
  //     return <Completion />;
  //   } else {
  //     // Render a countdown
  //     return (
  //       <>
  //         <AnimatePresence>
  //           <Grid.Container
  //             gap={2}
  //             alignItems="center"
  //             justify="center"
  //             css={{
  //               animation: `${gradient} 1s infinite`,
  //             }}
  //           >
  //             {days ? (
  //               <Grid>
  //                 <Text size="$4xl" weight="bold">
  //                   {days} {t("days")}
  //                 </Text>
  //               </Grid>
  //             ) : null}
  //             {hours ? (
  //               <Grid>
  //                 <Text size="$4xl" weight="bold">
  //                   {hours} {t("hours")}
  //                 </Text>
  //               </Grid>
  //             ) : null}
  //             {minutes ? (
  //               <Grid>
  //                 <Text size="$4xl" weight="bold">
  //                   {minutes} {t("minutes")}
  //                 </Text>
  //               </Grid>
  //             ) : null}

  //             <Grid>
  //               <Text size="$4xl" weight="bold">
  //                 {/* <motion.h1
  //                   key={seconds}
  //                   exit={{ y: 75, opacity: 0, position: 'absolute' }}
  //                   initial={{ y: -150, opacity: 0 }}
  //                   animate={{ y: 0, opacity: 1 }}
  //                   transition={{
  //                     ease: 'easeOut',
  //                     duration: 1,
  //                   }}
  //                 > */}
  //                 {seconds} {t("seconds")}
  //                 {/* </motion.h1> */}
  //               </Text>
  //             </Grid>
  //           </Grid.Container>
  //         </AnimatePresence>
  //       </>
  //     );
  //   }
  // };

  const timeline = [
    {
      type: "primary",
      date: `6 ${t("june")} 2023`,
      icon: (
        <ABS46
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: `${t("platformUpdate")}`,
      description: t("platformUpdateInfo"),
    },
    {
      date: `2 ${t("june")} 2023`,
      icon: (
        <ABS46
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: `DeDust ${t("swaps")}`,
      description: t("swapsUpdate"),
    },
    {
      date: `22 ${t("may")} 2023`,
      icon: (
        <ABS46
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: `${t("analyticsBot")}`,
      description: t("analyticsBotInfo"),
    },
    {
      date: `19 ${t("mar")} 2023`,
      icon: (
        <ABS46
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: `${t("joinTonex")}`,
      description: t("joinTonexInfo"),
    },
    {
      date: `26 ${t("feb")} 2023`,
      icon: (
        <ABS46
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: `${t("amaSession")} 1/4`,
      description: t("shareInfoAMA"),
    },
    {
      date: `23 ${t("feb")} 2023`,
      icon: (
        <GEN02
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("platformUpdate"),
      description: t("platformUpdateDescription"),
    },
    {
      date: `21 ${t("feb")} 2023`,
      icon: (
        <div
          className="flex justify-center place-items-center"
          style={{
            height: "100%",
          }}
        >
          <img src="/img/dedust.webp" width={24} height={24} alt="DeDust.io" />
        </div>
      ),
      title: t("deDustListing"),
      description: t("deDustListingDescription"),
    },
    {
      date: `14 ${t("feb")} 2023`,
      icon: (
        <GRA10
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("addLiquidityStats"),
      description: t("addLiquidityStatsDescription"),
    },
    {
      date: `13 ${t("feb")} 2023`,
      icon: (
        <ABS27
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("launchAnalyticsTools"),
      description: t("launchAnalyticsToolsDescription"),
    },
    {
      date: `5 ${t("feb")} 2023`,
      icon: (
        <ABS25
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("publishPlatform"),
      description: t("publishPlatformDescription"),
    },
    {
      date: `1 ${t("feb")} 2023`,
      icon: (
        <ABS28
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("featureAdvertiseNFT"),
      description: t("featureAdvertiseNFTDescription"),
    },
    {
      date: `31 ${t("jan")} 2023`,
      icon: (
        <ABS22
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("newTeamMember"),
      description: t("newTeamMemberDescription"),
    },
    {
      date: `30 ${t("jan")} 2023`,
      icon: (
        <ABS24
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("createPrivateChat"),
      description: t("createPrivateChatDescription"),
    },
    {
      date: `29 ${t("jan")} 2023`,
      icon: (
        <ABS23
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("addTokenPriceInfo"),
      description: t("addTokenPriceInfoDescription"),
    },
    {
      date: `27 ${t("jan")} 2023`,
      icon: (
        <ABS32
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("addPremiumSubscription"),
      description: t("addPremiumSubscriptionDescription"),
    },
    {
      date: `25 ${t("jan")} 2023`,
      icon: (
        <ABS26
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("presentRoadMapTokenomics"),
      description: t("presentRoadMapTokenomicsDescription"),
    },
    {
      date: `24 ${t("jan")} 2023`,
      icon: (
        <ABS20
          className="text-3xl"
          style={{ fill: "var(--nextui-colors-link)" }}
        />
      ),
      title: t("releaseFragmentChecker"),
      description: t("releaseFragmentCheckerDescription"),
    },
    {
      date: `25 ${t("dec")} 2022`,
      icon: <FCK className="w-8 h-8" style={{ position: "absolute" }} />,
      title: t("mintToken300k"),
      description: t("mintToken300kDescription"),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("events")}</title>
        <meta property="og:title" content={t("events") || ""}></meta>
        <meta property="og:image" content="/img/events.png"></meta>
      </Helmet>
      <Grid.Container
        id="ama"
        gap={2}
        justify="center"
        alignItems="center"
        css={{ position: "relative" }}
      >
        <Grid xs={12} sm={8} style={{ position: "relative" }}>
          <VerticalTimeline>
            {timeline.map((event, key) => (
              <VerticalTimelineElement
                key={key}
                className={cn("vertical-timeline-element--work", event.type)}
                contentStyle={
                  event.type === "primary"
                    ? {
                        background: "var(--nextui-colors-primaryLight)",
                        color: "var(--nextui-colors-primaryLightContrast)",
                      }
                    : {
                        background: `var(--nextui-colors-primary)`,
                        color: `var(--nextui-colors-black)`,
                      }
                }
                contentArrowStyle={{
                  borderRight: "7px solid  var(--nextui--navbarBorderColor)",
                }}
                date={event.date}
                iconStyle={{
                  background: "var(--nextui-colors-primaryLight)",
                  color: "var(--nextui-colors-primaryLightContrast)",
                }}
                icon={event.icon}
              >
                <h3 className="vertical-timeline-element-title">
                  {event.title}
                </h3>
                <p>{event.description}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </Grid>
      </Grid.Container>
    </>
  );
};
