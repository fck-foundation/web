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
  User,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

import { useLocation, useNavigate } from "react-router-dom";
import { ARR20, GEN03, GEN19, GRA12 } from "assets/icons";
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
        <Grid>
          <Grid.Container gap={1} alignItems="center">
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
                    // "1M", FIX THIS
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
                          className="text-base rounded-full overflow-hidden"
                          style={{
                            fill: "var(--nextui-colors-primary)",
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                }
                css={{ padding: 0 }}
              />
            </Grid>

            {/* {!!processing.wait && (
              <>
                <Grid>
                  <Loading />
                </Grid>
                <Spacer x={0.4} />
              </>
            )} */}

            {!!jetton?.is_scam && (
              <Grid>
                <Badge variant="flat" color="error">
                  SCAM
                </Badge>
              </Grid>
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
                {<GEN03 className="text-lg fill-current" />}
                <Spacer x={0.4} />
                {jetton?.stats?.promoting_points || 0}
              </Badge>
            </Grid>

            <Badge
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

      <Promote hideTrigger voteId={voteId} setVoteId={setVoteId} />
    </>
  );
};
