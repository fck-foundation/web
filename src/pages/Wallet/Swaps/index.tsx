import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTonAddress } from "@tonconnect/ui-react";
import TonProofApi from "TonProofApi";
import { Button, Card } from "@nextui-org/react";
import { ARR09, ARR10, ARR25, ARR28 } from "assets/icons";
import axios from "axios";
import { AppContext } from "contexts";
import { _ } from "utils";
import { Dex } from "./Dex";
import { Transactions } from "./Transactions";
import { NFT } from "./NFT";
import { useQuery } from "@tanstack/react-query";

const actions = {
  buy: <ARR09 style={{ fill: "#1ac964", fontSize: 24 }} />,
  sell: <ARR10 style={{ fill: "#f31260", fontSize: 24 }} />,
  liquidity_deposit: <ARR28 style={{ fill: "#1ac964", fontSize: 24 }} />,
  liquidity_withdraw: <ARR25 style={{ fill: "#f31260", fontSize: 24 }} />,
};

const colorType = {
  buy: "#1ac964",
  sell: "#f31260",
  liquidity_deposit: "#1ac964",
  liquidity_withdraw: "#f31260",
};

interface Props {
  selected?: number;
  isLoading?: boolean;
  tab: string;
  swaps?: Record<string, any>[];
  setSwaps: React.Dispatch<Record<string, any>[]>;
  setTab: React.Dispatch<string>;
}

const WalletSwaps: React.FC<Props> = ({
  tab,
  isLoading,
  selected,
  swaps,
  setTab,
  setSwaps,
}) => {
  const location = useLocation();
  const tonAddress = useTonAddress();
  const { t } = useTranslation();
  const { authorized, jettons, ton } = useContext(AppContext);

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
      setSwaps(response.data.data.sources.DeDust.jettons[selected!].swaps);
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
      </Card.Body>
    </Card>
  );
};

export default WalletSwaps;
