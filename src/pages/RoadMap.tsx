/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import cn from "classnames";
import {
  Button,
  Card,
  Col,
  Grid,
  Loading,
  Row,
  Spacer,
  Table,
  Text,
} from "@nextui-org/react";
import { ARR12, ARR02, ARR04, ARR01, ARR03, ARR10 } from "assets/icons";

import { StyledBadge } from "./Badge";

import "keen-slider/keen-slider.min.css";

const tableProps = {
  bordered: {
    "@xs": false,
    "@dark": false,
  },
  css: {
    height: "auto",
    minWidth: "100%",
    padding: 0,
  },
};

const carousel: KeenSliderPlugin = (slider) => {
  const z = 700;
  function rotate() {
    const deg = 360 * slider.track.details.progress;
    slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`;
  }
  slider.on("created", () => {
    const deg = 360 / slider.slides.length;
    slider.slides.forEach((element, idx) => {
      element.style.transform = `rotateY(${deg * idx}deg) translateZ(${z}px)`;
    });
    rotate();
  });
  slider.on("detailsChanged", rotate);
};

export const RoadMap = () => {
  const { t } = useTranslation();
  const refQ1 = useRef<HTMLDivElement>(null);
  const refQ2 = useRef<HTMLDivElement>(null);
  const refQ3 = useRef<HTMLDivElement>(null);
  const refQ4 = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(1);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: ".carousel__cell",
      renderMode: "custom",
      mode: "free-snap",
      slideChanged: ({ track }) => {
        setActive(track.details.rel);
      },
    },
    [carousel]
  );
  
  useEffect(() => {
    instanceRef.current?.update(0, active);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      (refQ1.current?.childNodes[0] as any).scrollTop = (
        refQ1.current?.childNodes[0] as any
      ).getBoundingClientRect().bottom;
      (refQ2.current?.childNodes[0] as any).scrollTop = (
        refQ2.current?.childNodes[0] as any
      ).getBoundingClientRect().bottom;
      (refQ3.current?.childNodes[0] as any).scrollTop = (
        refQ3.current?.childNodes[0] as any
      ).getBoundingClientRect().bottom;
      (refQ4.current?.childNodes[0] as any).scrollTop = (
        refQ4.current?.childNodes[0] as any
      ).getBoundingClientRect().bottom;

      instanceRef.current?.update();
    }, 150);
  }, [instanceRef]);

  const roadMap: any[] = useMemo(
    () => [
      {
        step: "Q1",
        ref: refQ1,
        list: [
          { title: t("createProjectChannels"), type: "active" },
          { title: t("developmentTokenomics"), type: "active" },
          { title: t("mintToken"), type: "active" },
          { title: t("addToWhitelist"), type: "active" },
          { title: t("integrationIntoBot"), type: "active" },
          { title: t("addDEXContract"), type: "active" },
          { title: t("addToDeDustWhitelist"), type: "active" },
          { title: t("createAnalyticalTool"), type: "active" },
          { title: t("addLiquidityCharts"), type: "active" },
        ],
      },
      {
        step: "Q2",
        ref: refQ2,
        list: [
          { title: t("addPlatformCustomization"), type: "active" },
          { title: t("integrationTONServices"), type: "vacation" },
          { title: t("optimizationWork"), type: "vacation" },
          { title: t("attractingAudience"), type: "vacation" },
          // { title: t("addStake"), type: "paused" },
        ],
      },
      {
        step: "Q3",
        ref: refQ3,
        list: [
          { title: t("createNFTCollection"), type: "paused" },
          { title: t("previsedCollection"), type: "paused" },
          { title: t("createNFTmarketplace"), type: "paused" },
          { title: t("addPersonalBord"), type: "paused" },
          { title: t("mintCollection"), type: "paused" },
          { title: t("launchWebServices"), type: "paused" },
          { title: t("integrationTocosystem"), type: "paused" },
          { title: t("collaborationsProjects"), type: "paused" },
        ],
      },
      {
        step: "Q4",
        ref: refQ4,
        list: [
          { title: t("marketingNFTCollections"), type: "paused" },
          { title: t("implementationCommunityIdeas"), type: "paused" },
          { title: t("encourageHolders"), type: "paused" },
        ],
      },
    ],
    [t]
  );

  return (
    <Grid.Container
      justify="center"
      css={{ minHeight: '70vh' }}
    >
      <Grid>
        <Grid.Container
          id="roadmap"
          gap={2}
          direction="row"
          wrap="nowrap"
          justify="center"
          alignItems="center"
        >
          <Grid>
            <Button
              icon={
                <ARR02
                  style={{ fill: "var(--nextui-colors-link)", fontSize: 24 }}
                />
              }
              flat
              css={{ minWidth: 24 }}
              onClick={() => instanceRef.current?.prev()}
            />
          </Grid>
          <Grid>
            <Text size="$3xl">{t("roadMap")}</Text>
          </Grid>
          <Grid>
            <Button
              icon={
                <ARR01
                  style={{ fill: "var(--nextui-colors-link)", fontSize: 24 }}
                />
              }
              flat
              css={{ minWidth: 24 }}
              onClick={() => instanceRef.current?.next()}
            />
          </Grid>
        </Grid.Container>
        <Grid.Container gap={2} justify="center" css={{ h: "100%" }}>
          <Grid>
            <div className="scene">
              <div className="carousel keen-slider" ref={sliderRef}>
                {roadMap.map(({ ref, step, list }, i) => (
                  <div
                    key={`${step}-${i}`}
                    className={cn("carousel__cell", "number-slide", {
                      active: active === i,
                    })}
                  >
                    <Card variant="bordered">
                      <Card.Header
                        css={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingLeft: 24
                        }}
                      >
                        <Text
                          size="$2xl"
                          weight="bold"
                          css={{
                            textGradient: "45deg, $blue600 0%, $green600 100%",
                          }}
                        >
                          {step}
                        </Text>
                      </Card.Header>
                      <Card.Body ref={ref} className="roadmap-body">
                        <Table
                          aria-label="RoadMap"
                          className="table-hide-header"
                          {...tableProps}
                        >
                          <Table.Header>
                            <Table.Column>NAME</Table.Column>
                            <Table.Column>ROLE</Table.Column>
                          </Table.Header>
                          <Table.Body>
                            {list.map((item, y) => {
                              let icon = (
                                <ARR12
                                  style={{
                                    fill: "var(--nextui-colors-link)",
                                    fontSize: 18,
                                  }}
                                />
                              );

                              switch (item.type) {
                                case "vacation":
                                  icon = (
                                    <Loading size="xs" color="currentColor" />
                                  );
                                  break;
                                case "paused":
                                  icon = (
                                    <Loading
                                      type="points-opacity"
                                      size="xs"
                                      color="currentColor"
                                    />
                                  );
                                  break;
                              }

                              return (
                                <Table.Row key={`${step}-${i}-${y}`}>
                                  <Table.Cell>
                                    <Row align="center" justify="flex-start">
                                      <Col
                                        style={{
                                          maxWidth: 242,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                      >
                                        {item.title}
                                      </Col>
                                    </Row>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <StyledBadge type={item.type} size="xl">
                                      {icon}
                                    </StyledBadge>
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}
                          </Table.Body>
                        </Table>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
};
