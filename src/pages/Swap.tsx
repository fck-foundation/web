import { Card, Container, Grid, Spacer, Text } from "@nextui-org/react";
import { Swap } from "./Landing/components";
import { TCard } from "./Landing";
import { ReactComponent as Arrow } from "assets/arrow.svg";
import { useTranslation } from "react-i18next";

export const SwapPage = () => {
  const { t } = useTranslation();

  return (
    <Container sm className="py-4">
      <Grid.Container justify="center">
        <Grid xs={12} sm={8}>
          <Swap />
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
            <Card.Header css={{ display: "flex", flexDirection: "column" }}>
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
        <Grid xs={12} sm={1} className="flex justify-center" css={{ mt: "$8" }}>
          <Arrow
            height="auto"
            className="floating-arrow"
            style={{ animationDelay: "2s", minWidth: 64 }}
          />
        </Grid>
        <Grid xs={12} sm={5} css={{ mt: "$16" }}>
          <Card variant="bordered">
            <Card.Header css={{ display: "flex", flexDirection: "column" }}>
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
                  <TCard value="16.67" amount="50 000" title={t("funding")} />
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
      </Grid.Container>
    </Container>
  );
};
