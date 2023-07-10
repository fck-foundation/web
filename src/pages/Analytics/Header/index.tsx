import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import cookie from "react-cookies";
import {
  Badge,
  Button,
  Container,
  Dropdown,
  Grid,
  Loading,
  Spacer,
  Text,
  User,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import { useLocation, useNavigate } from "react-router-dom";
import { ARR12, ARR16, ARR20, GEN03, GEN19, GRA12, Heart } from "assets/icons";
import { AppContext } from "contexts";
import { Promote } from "components";
import { toast } from "react-toastify";

interface Props {
  isDrag: boolean;
  percent: number;
  setIsDrag: Dispatch<SetStateAction<boolean>>;
}

export const Header: React.FC<Props> = ({ isDrag, percent, setIsDrag }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // const [present] = useIonActionSheet();
  const { jetton, list, timescale, setOpen, setTimescale, setList } =
    useContext(AppContext);

  const [voteId, setVoteId] = useState<number>();

  return (
    <>
      <Container
        gap={0}
        justify="space-between"
        alignItems="center"
        css={{ display: "flex", width: "100%", zIndex: 2 }}
      >
        <Grid xs={12}>
          <Grid.Container
            gap={0}
            alignItems="center"
            justify="space-between"
            className="w-full"
          >
            <Grid>
              <Grid.Container
                gap={0.4}
                alignItems="center"
                justify="space-between"
              >
                <Grid css={{ display: "none", "@xs": { display: "block" } }}>
                  <Button
                    size="sm"
                    flat={!isDrag}
                    icon={
                      isDrag ? (
                        <ARR20 className="text-lg fill-current" />
                      ) : (
                        <GEN19 className="text-lg fill-current" />
                      )
                    }
                    css={{ minWidth: "auto" }}
                    onPress={() => {
                      setIsDrag((i) => {
                        setOpen(!i);
                        return !i;
                      });
                    }}
                  />
                </Grid>

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
                        ...(!location.pathname.includes("volume")
                          ? ["5M", "15M", "30M"]
                          : []),
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
                {(!!jetton?.is_scam || !!jetton?.verified) && (
                  <>
                    {jetton?.is_scam ? (
                      <>
                        <Grid>
                          <Badge variant="flat" size="lg" color="error">
                            {t("scam")}
                          </Badge>
                        </Grid>
                        <Spacer x={0.4} />
                      </>
                    ) : (
                      <>
                        <Grid>
                          <Badge
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="flex flex-nowrap"
                          >
                            <Text color="primary" className="pl-1">
                              {t("verify")}
                            </Text>
                            <Spacer x={0.4} />
                            <Text className="flex text-2xl pr-1">
                              <ARR16
                                className="rounded-full overflow-hidden"
                                style={{
                                  fill: "var(--nextui-colors-primary)",
                                }}
                              />
                            </Text>
                          </Badge>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {!list.includes(jetton.address) && (
                  <Grid>
                    <Button
                      size="sm"
                      css={{ width: "100%" }}
                      onPress={() =>
                        setList((prevList) => [jetton.address, ...prevList])
                      }
                    >
                      <GEN03 className="text-lg fill-current" />
                      <Spacer x={0.4} />
                      {t("addToWatchList")}
                    </Button>
                  </Grid>
                )}
              </Grid.Container>
            </Grid>

            {location.pathname.includes("price") ||
            location.pathname.includes("volume") ? (
              <Grid>
                <Grid.Container gap={0.8} wrap="nowrap" alignItems="center">
                  <Badge
                    size="lg"
                    color={
                      !isNaN(percent) && percent !== 0
                        ? percent > 0
                          ? "success"
                          : "error"
                        : "default"
                    }
                    css={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {!isNaN(percent) && percent !== 0
                      ? parseFloat(Math.abs(percent).toFixed(2))
                      : 0}{" "}
                    %
                  </Badge>

                  <Grid>
                    <Badge
                      color="primary"
                      variant="flat"
                      size="lg"
                      css={{
                        flexWrap: "nowrap",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setVoteId(jetton?.id);
                      }}
                    >
                      {<Heart className="text-lg text-red-500 fill-red-500" />}
                      <Spacer x={0.4} />
                      {jetton?.stats?.promoting_points || 0}
                    </Badge>
                  </Grid>
                  <Grid>
                    <Grid.Container wrap="nowrap">
                      <Grid
                        css={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          size="sm"
                          flat={!location.pathname.includes("price")}
                          onPress={() =>
                            location.pathname.includes("volume") &&
                            navigate(
                              `/analytics/price/${location.pathname
                                .split("/analytics/volume/")
                                .pop()}`
                            )
                          }
                          css={{
                            minWidth: "auto",
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                          }}
                        >
                          {t("price")}
                        </Button>
                      </Grid>
                      <Grid
                        css={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          size="sm"
                          flat={!location.pathname.includes("volume")}
                          css={{
                            minWidth: "auto",
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }}
                          onPress={() =>
                            location.pathname.includes("price") &&
                            navigate(
                              `/analytics/volume/${location.pathname
                                .split("/analytics/price/")
                                .pop()}`
                            )
                          }
                        >
                          {t("volumeL")}
                        </Button>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                </Grid.Container>
              </Grid>
            ) : null}
          </Grid.Container>
        </Grid>
      </Container>

      <Promote hideTrigger voteId={voteId} setVoteId={setVoteId} />
    </>
  );
};
