import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import {
  Grid,
  Text,
  Col,
  Avatar,
  Spacer,
  Button,
  Card,
} from "@nextui-org/react";
import { GEN16 } from "assets/icons";

import "./index.scss";

export const OurTeam = () => {
  const { t } = useTranslation();

  const users = [
    {
      name: "Beybut",
      role: `${t("CEO")} & ${t("seniorDeveloper")}`,
      color: "primary",
      statusText: t("available"),
      avatar:
        "https://media.licdn.com/dms/image/C4E03AQFlhv3MH10g3A/profile-displayphoto-shrink_400_400/0/1660159506054?e=1691625600&v=beta&t=6vUUaTsJZ7E52iB_xVHoC0dP_coMR7Nljif9fNEP3GA",
      telegram: "https://beycoder.t.me",
      content: <Text>{t("beybutContent")}</Text>,
    },
    {
      name: "Evgeniy",
      role: t("productManager"),
      color: "secondary",
      statusText: t("available"),
      avatar: "/img/izosimov.jpeg",
      telegram: "https://IzosimovEA.t.me",
      content: <Text>{t("evgeniyContent")}</Text>,
    },
    {
      name: "Nick",
      role: `${t("CTO")} & ${t("seniorDeveloper")}`,
      color: "gradient",
      statusText: t("available"),
      avatar:
        "https://media.licdn.com/dms/image/C4E03AQE6_kRI2b3Vgg/profile-displayphoto-shrink_800_800/0/1660379279640?e=1691625600&v=beta&t=Wm5_yVsEFd5vKIIqwJqaUewfgKmIsVHQcM_ZakEoSWo",
      telegram: "https://tatadev.t.me",
      content: <Text>{t("nickContent")}</Text>,
    },
  ];
  return (
    <>
      <Helmet>
        <title>{t("ourTeam")}</title>
        <meta property="og:title" content={t("ourTeam") || ""}></meta>
        <meta property="og:image" content="/img/team.png"></meta>
      </Helmet>
      <Grid.Container justify="center" css={{ minHeight: "70vh", p: 16 }}>
        <Grid>
          <Card>
            <Card.Header css={{ pl: 24 }}>
              <Text size="$3xl">{t("ourTeam")}</Text>
            </Card.Header>
            <Card.Body css={{ pt: 0 }}>
              <Grid.Container gap={2}>
                <Grid css={{ maxWidth: 400 }}>
                  <Grid.Container css={{ gap: 16, position: "relative" }}>
                    {users.map((user, i) => (
                      <Col span={12} key={i}>
                        <Grid.Container wrap="nowrap" justify="space-between">
                          <Col>
                            <Grid.Container wrap="nowrap" justify="flex-start">
                              <Col
                                css={{
                                  w: "auto",
                                }}
                              >
                                {i < 1 && (
                                  <div className="vertical-timeline-line" />
                                )}
                                <Avatar
                                  size="xl"
                                  src={user.avatar}
                                  color={user.color as any}
                                  bordered
                                  rounded
                                />
                              </Col>
                              <Spacer x={1} />
                              <Col>
                                <Grid.Container>
                                  <Col>
                                    <Text>{user.name}</Text>
                                  </Col>
                                  <Col>
                                    <Text css={{ whiteSpace: "nowrap" }}>
                                      {user.role}
                                    </Text>
                                  </Col>
                                </Grid.Container>
                              </Col>
                            </Grid.Container>
                          </Col>
                          <Col
                            css={{
                              w: "auto",
                              display: "inline-flex",
                              paddingRight: 16,
                            }}
                          >
                            {user.telegram && (
                              <Button
                                flat
                                size="xs"
                                icon={
                                  <GEN16
                                    className="text-base"
                                    style={{
                                      fill: "var(--nextui-colors-link)",
                                    }}
                                  />
                                }
                                css={{ minWidth: 24 }}
                                onPress={() =>
                                  window.open(user.telegram, "_blank")
                                }
                              />
                            )}
                          </Col>
                        </Grid.Container>
                      </Col>
                    ))}
                  </Grid.Container>
                </Grid>
              </Grid.Container>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
};
