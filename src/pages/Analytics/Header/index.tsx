/* eslint-disable @next/next/no-img-element */
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  User,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import { _ } from "utils";
import { useLocation, useNavigate } from "react-router-dom";
import { ARR20, GEN03, GEN19, GRA12 } from "assets/icons";
import { AppContext } from "contexts";
import { useTonAddress } from "@tonconnect/ui-react";
import { Promote } from "components";
import { toast } from "react-toastify";

interface Props {
  isDrag: boolean;
  setIsDrag: Dispatch<SetStateAction<boolean>>;
}

export const Header: React.FC<Props> = ({ isDrag, setIsDrag }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const address = useTonAddress();
  // const [present] = useIonActionSheet();
  const {
    jetton,
    page,
    jettons,
    list,
    timescale,
    enabled,
    setOpen,
    setTimescale,
    setList,
    refetchJettons,
  } = useContext(AppContext);

  const [voteId, setVoteId] = useState<number>();
  const [processing, setProcessing] = useState(
    cookie.load("processing")
      ? (cookie.load("processing") as any)
      : { before: 0, wait: 0 }
  );

  useEffect(() => {
    if (processing.wait > 0) {
      const verify = setInterval(refetchJettons, 15000);
      const curr = jettons
        ?.map(({ stats }) => stats?.promoting_points || 0)
        ?.reduce((acc, curr) => (acc += curr), 0);

      if (processing.wait <= curr) {
        clearInterval(verify);
        setProcessing({ wait: 0, curr });
        cookie.remove("processing");

        toast.success(t("voteSuccess"), {
          position: toast.POSITION.TOP_RIGHT,
          theme: enabled ? "dark" : "light",
        });
      }
    }
  }, [processing]);

  const onSuccess = (value: number) => {
    const curr = jettons
      .map(({ stats }) => stats.promoting_points)
      .reduce((acc, curr) => (acc += curr), 0);

    setProcessing({ curr: curr, wait: curr + value });

    cookie.save(
      "processing",
      JSON.stringify({ before: curr, wait: curr + value }),
      { path: "/" }
    );

    toast.success(t("voteSent"), {
      position: toast.POSITION.TOP_RIGHT,
      theme: enabled ? "dark" : "light",
    });
  };

  return (
    <>
      <Container
        gap={0}
        justify="space-between"
        alignItems="center"
        css={{ display: "flex", width: "100%", zIndex: 2 }}
      >
        <Grid>
          <Grid.Container gap={1} alignItems="center">
            <Grid css={{ display: "none", "@xs": { display: "block" } }}>
              <Button
                size="sm"
                flat={!isDrag}
                icon={
                  isDrag ? (
                    <ARR20 style={{ fill: "currentColor", fontSize: 18 }} />
                  ) : (
                    <GEN19 style={{ fill: "currentColor", fontSize: 18 }} />
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
                  <GRA12 style={{ fill: "currentColor", fontSize: 18 }} />
                  <Spacer x={0.4} />
                  {timescale}
                </Dropdown.Button>
                <Dropdown.Menu
                  variant="flat"
                  color="primary"
                  selectedKeys={[timescale]}
                  selectionMode="single"
                  onSelectionChange={(key) =>
                    setTimescale(Object.values(key)[0])
                  }
                  css={{ minWidth: 50 }}
                >
                  {[
                    // "1M",
                    "5M",
                    "30M",
                    "1H",
                    "4H",
                    "1D",
                    "7D",
                    "30D",
                  ].map((n) => (
                    <Dropdown.Item key={n}>{t(n)}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Grid>

            <Grid css={{ display: "flex" }}>
              <User
                size="sm"
                bordered
                src={jetton.image}
                name={
                  <div>
                    {jetton.symbol}{" "}
                    {!!jetton?.verified && (
                      <Badge
                        size="xs"
                        css={{
                          p: 0,
                          background: "transparent",
                          right: "unset",
                          left: "$8",
                        }}
                      >
                        <ARR20
                          style={{
                            fill: "var(--nextui-colors-primary)",
                            fontSize: 16,
                            borderRadius: 100,
                            overflow: "hidden",
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                }
                css={{ padding: 0 }}
              />
            </Grid>

            {!!processing.wait && (
              <>
                <Grid>
                  <Loading />
                </Grid>
                <Spacer x={0.4} />
              </>
            )}

            <Grid>
              <Badge
                variant="flat"
                color="primary"
                css={{
                  flexWrap: "nowrap",
                  p: "$1 $4 $1 $2",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setVoteId(jetton?.id);
                }}
              >
                {
                  <GEN03
                    style={{
                      fill: "currentColor",
                      fontSize: 18,
                    }}
                  />
                }
                <Spacer x={0.4} />
                {jetton?.stats?.promoting_points || 0}
              </Badge>
            </Grid>

            {!list.includes(jetton.address) && (
              <Grid>
                <Button
                  size="sm"
                  css={{ width: "100%" }}
                  onPress={() =>
                    setList((prevList) => [jetton.address, ...prevList])
                  }
                >
                  <GEN03 style={{ fill: "currentColor", fontSize: 18 }} />
                  <Spacer x={0.4} />
                  {t("addToWatchList")}
                </Button>
              </Grid>
            )}

            {location.pathname.includes("price") ||
            location.pathname.includes("volume") ? (
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
            ) : null}
          </Grid.Container>
        </Grid>
      </Container>

      <Promote
        hideTrigger
        voteId={voteId}
        processing={processing}
        onSuccess={onSuccess}
        setVoteId={setVoteId}
      />
    </>
  );
};
