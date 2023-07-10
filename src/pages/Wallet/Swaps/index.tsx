import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTonAddress } from "@tonconnect/ui-react";
import TonProofApi from "TonProofApi";
import { Button, Card, Grid } from "@nextui-org/react";
import axios from "axios";
import { JType } from "contexts";
import { Dex } from "./Dex";
import { Transactions } from "./Transactions";
import { NFT } from "./NFT";
import { useQuery } from "@tanstack/react-query";
import Jettons from "../Jettons";

interface Props {
  selected?: number;
  isLoading?: boolean;
  isBalance: boolean;
  tab: string;
  dataSelected: JType[];
  swaps?: Record<string, any>[];
  setSwaps: React.Dispatch<Record<string, any>[]>;
  setTab: React.Dispatch<string>;
  page: number;
  setSelected: React.Dispatch<number>;
  setPage: (value?: any) => void;
  setIsBalance: (value?: any) => void;
}

const WalletSwaps: React.FC<Props> = ({
  page,
  tab,
  dataSelected,
  isBalance,
  isLoading,
  selected,
  swaps,
  setTab,
  setPage,
  setSwaps,
  setSelected,
  setIsBalance,
}) => {
  const location = useLocation();
  const tonAddress = useTonAddress();
  const { t } = useTranslation();

  const wallet = location.pathname?.split("/").pop();

  const { isLoading: isLoadingSwaps, isFetching } = useQuery({
    queryKey: ["wallet-swaps", selected, TonProofApi.accessToken],
    queryFn: ({ signal }) =>
      axios.get(
        `https://api.fck.foundation/api/v2/user/swaps?address=${wallet}&jetton_id=${selected}&count=100`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${TonProofApi.accessToken}`,
          },
        }
      ),
    enabled: !!TonProofApi.accessToken && !!selected,
    refetchOnMount: false,
    refetchOnReconnect: false,
    onSuccess: (response) => {
      selected && setSwaps(response.data.data.sources.DeDust.jettons[selected].swaps);
    },
  });

  return (
    <Card variant="bordered">
      <Card.Header>
        <Button.Group size="sm">
          <Button
            flat={tab !== "transactions"}
            onPress={() => setTab("transactions")}
          >
            {t("transactions")}
          </Button>
          <Button flat={tab !== "dex"} onPress={() => setTab("dex")}>
            {t("tokens")}
          </Button>
          <Button flat={tab !== "nft"} onPress={() => setTab("nft")}>
            {t("nft")}
          </Button>
        </Button.Group>
      </Card.Header>
      <Card.Body css={{ pt: "$0", pb: "$2", overflow: "hidden" }}>
        <Grid.Container gap={1}>
          {tab === "dex" && (
            <Grid xs={12} sm={4} css={{ h: "fit-content" }}>
              <Jettons
                isBalance={isBalance}
                page={page}
                isLoading={!!dataSelected?.length && isLoading}
                selected={selected}
                setSelected={setSelected}
                setSwaps={setSwaps}
                setPage={setPage}
                setIsBalance={setIsBalance}
              />
            </Grid>
          )}
          <Grid xs={12} sm={tab === "dex" ? 8 : 12}>
            {tab === "dex" && (
              <Dex
                isLoading={
                  isLoading ||
                  isLoadingSwaps ||
                  isFetching ||
                  (!!TonProofApi.accessToken && (!tonAddress || !selected))
                }
                selected={selected}
                swaps={swaps}
                setSwaps={setSwaps}
              />
            )}
            {tab === "transactions" && <Transactions />}
            {tab === "nft" && <NFT />}
          </Grid>
        </Grid.Container>
      </Card.Body>
    </Card>
  );
};

export default WalletSwaps;
