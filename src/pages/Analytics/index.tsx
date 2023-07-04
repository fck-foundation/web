import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Grid, Loading } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { GEN02 } from "assets/icons";
import { AppContext } from "contexts";
import { Price } from "./Stats/Price";
import { Jettons } from "./Jettons";
import { Header } from "./Header";

import "./index.scss";

export const pagination = {
  "5M": 300,
  "30M": 1800,
  "1H": 3600,
  "4H": 14400,
  "1D": 86400,
  "7D": 604800,
  "30D": 2592000,
};

export const Analytics = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // const [present] = useIonActionSheet();
  const { timescale, jettons } = useContext(AppContext);
  const [isDrag, setIsDrag] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (
      !location.pathname.includes("price") &&
      !location.pathname.includes("volume")
    ) {
      navigate("/analytics/price/FCK");
    }
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>{t("analytics")}</title>
        <meta property="og:title" content={t("analytics") || ""}></meta>
        <meta property="og:image" content="/img/analytics.png"></meta>
      </Helmet>
      <Container md className="py-2" css={{ px: 0 }}>
        {!jettons.length ? (
          <Grid.Container
            alignItems="center"
            justify="center"
            css={{ height: "70vh", }}
          >
            <Grid>
              <Loading />
            </Grid>
          </Grid.Container>
        ) : (
          <>
            <Grid.Container
              gap={0.4}
              css={{ minHeight: "70vh", display: "flex", pt: 0 }}
            >
              {/* <Grid xs={12}>
          <Grid.Container
            className="hide-scrollbar"
            gap={1}
            alignContent="flex-start"
            wrap="nowrap"
            css={{
              overflow: "auto",
              padding: 35,
              margin: -35,
              width: "100vw",
            }}
          >
            <Grid>
              <FearGreedIndex />
            </Grid>
            <Grid>
              <Volume />
            </Grid>
            <Grid>
              <Change />
            </Grid>
            <Grid>
              <Transactions />
            </Grid>
          </Grid.Container>
        </Grid> */}
              <Grid xs={12}>
                <Grid.Container>
                  <Grid xs={12} sm={4} lg={3}>
                    <Jettons isDrag={isDrag} setIsDrag={setIsDrag} />
                  </Grid>
                  <Grid xs={12} sm={8} lg={9}>
                    <Grid.Container>
                      <Grid xs={12}>
                        <Header
                          percent={percent}
                          isDrag={isDrag}
                          setIsDrag={setIsDrag}
                        />
                      </Grid>
                      <Grid xs={12}>
                        {location.pathname.includes("volume") ||
                        location.pathname.includes("price") ? (
                          <Price
                            timescale={timescale}
                            onPercentChange={setPercent}
                          />
                        ) : (
                          <Grid.Container justify="center">
                            <Grid
                              css={{
                                display: "flex",
                                alignItems: "center",
                                color: "$primary",
                              }}
                            >
                              <GEN02 className="text-3xl text-current" />
                            </Grid>
                          </Grid.Container>
                        )}
                      </Grid>
                    </Grid.Container>
                  </Grid>
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </>
        )}
      </Container>
    </>
  );
};
