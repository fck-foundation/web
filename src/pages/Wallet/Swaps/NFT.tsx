import {
  Badge,
  Button,
  Card,
  Grid,
  Image,
  Link,
  Loading,
  Spacer,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { ARR16 } from "assets/icons";
import axios from "axios";
import { AppContext } from "contexts";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Address } from "ton-core";
import { normalize } from "utils";

export const NFT = () => {
  const { t } = useTranslation();
  const wallet = location.pathname?.split("/").pop();
  const { isBottom, setIsBottom } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [type, setType] = useState<"all" | "sale" | "hold">("all");

  useEffect(() => {
    setData([]);
    setPage(1);
  }, [wallet]);

  useEffect(() => {
    if (isBottom) {
      setPage((i) => i + 1);
    }
  }, [isBottom]);

  const { isLoading, isFetching } = useQuery({
    queryKey: ["jettons-nft", page],
    queryFn: ({ signal }) =>
      axios
        .get(
          `https://tonapi.io/v2/accounts/${wallet}/nfts?limit=28&offset=${
            (page - 1) * 28
          }&indirect_ownership=${
            ["sale", "all"].includes(type) ? "true" : "false"
          }`,
          {
            signal,
          }
        )
        .then(({ data }) => data),
    refetchOnWindowFocus: false,
    onSuccess: (reponse) => {
      setData((prevData) => [...prevData, ...(reponse?.nft_items || [])]);

      if (reponse?.nft_items?.length) {
        setIsBottom(false);
      }
    },
  });

  return (
    <Grid.Container gap={1} css={{ m: "-$8 -$4 0" }}>
      <Grid xs={12}>
        <Grid.Container alignItems="center" gap={1} css={{ m: "-$8" }}>
          {/* <Grid>
            <Dropdown>
              <Dropdown.Button size="sm">{t("collection")}</Dropdown.Button>
              <Dropdown.Menu aria-label="Collection">
                <Dropdown.Item key="diamonds">Ton diamonds</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Grid> */}
          <Grid>
            <Button.Group size="sm">
              <Button flat={type !== "all"} onPress={() => setType("all")}>
                {t("all")}
              </Button>
              <Button flat={type !== "sale"} onPress={() => setType("sale")}>
                {t("onSale")}
              </Button>
              <Button flat={type !== "hold"} onPress={() => setType("hold")}>
                {t("notForSale")}
              </Button>
            </Button.Group>
          </Grid>
        </Grid.Container>
      </Grid>
      {data
        ?.filter((item) =>
          type === "sale" ? !!item?.sale : type === "hold" ? !item?.sale : true
        )
        ?.map((nft, i) => (
          <Grid xs={6} sm={4} md={3} key={i}>
            <Link
              href={`https://getgems.io/collection/${Address.parseRaw(
                nft?.collection?.address
                  ? nft?.collection?.address
                  : nft?.owner?.address
              ).toString()}/${Address.parseRaw(nft?.address).toString()}`}
              target="_blank"
              css={{ mw: "100%", w: "100%" }}
            >
              <Card isPressable isHoverable variant="bordered">
                <Card.Body css={{ p: 0, overflow: "visible" }}>
                  <Image
                    src={nft.previews[1].url}
                    width="100%"
                    objectFit="cover"
                  />
                </Card.Body>
                <Card.Header>
                  <Grid.Container wrap="nowrap" justify="space-between">
                    <Grid css={{ maxW: nft?.sale ? "50%" : "100%" }}>
                      <Grid.Container wrap="nowrap" alignItems="center">
                        {!!nft?.verified && (
                          <>
                            <Grid>
                              <ARR16 className="text-current text-lg" />
                            </Grid>

                            <Spacer x={0.4} />
                          </>
                        )}
                        <Grid>
                          <div
                            className="overflow-hidden whitespace-nowrap text-ellipsis"
                            style={{
                              maxWidth: nft?.sale ? "50%" : "100%",
                            }}
                          >
                            {nft.metadata.name}
                          </div>
                        </Grid>
                      </Grid.Container>
                    </Grid>
                    {nft?.sale && (
                      <Grid>
                        <Badge color="success">
                          {parseFloat(
                            normalize(nft?.sale?.price?.value, 9).toFixed(9)
                          )}{" "}
                          TON
                        </Badge>
                      </Grid>
                    )}
                  </Grid.Container>
                </Card.Header>
              </Card>
            </Link>
          </Grid>
        ))}
      {(isLoading || isFetching) && (
        <Grid
          xs={12}
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            h: 100,
          }}
        >
          <Loading />
        </Grid>
      )}
    </Grid.Container>
  );
};
