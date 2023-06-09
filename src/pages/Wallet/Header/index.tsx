import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Card,
  Grid,
  Input,
  Link,
  Spacer,
  Text,
} from "@nextui-org/react";
import { Tonscan, Tonviewer } from "assets/icons";
import axios from "axios";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { AppContext } from "contexts";
import qrcode from "qrcode-generator";
import { useQuery } from "@tanstack/react-query";
import { _, normalize } from "utils";
import { useTranslation } from "react-i18next";
import { Address } from "ton-core";
import Skeleton from "react-loading-skeleton";
import { TonProofApi } from "TonProofApi";

interface Props {
  selected?: number;
  setSwaps: (value?: any) => void;
}

const WalletHeader: React.FC<Props> = ({ selected, setSwaps }) => {
  const location = useLocation();
  const tonAddress = useTonAddress();
  const { t } = useTranslation();
  const { jettons, ton } = useContext(AppContext);
  const [tonConnectUi] = useTonConnectUI();
  const [value, setValue] = useState("");

  const wallet = location.pathname.split("/").pop();

  const qrSVG = useMemo(() => {
    const qr = qrcode(0, "L");
    qr.addData(wallet as string);
    qr.make();
    return qr.createTableTag(4.5, 0);
  }, [wallet]);

  const address = useMemo(() => Address.parse(wallet as string), [wallet]);

  const { data: dataTON, isLoading: isLoadingTON } = useQuery({
    queryKey: ["wallet-ton", address],
    queryFn: async () =>
      await axios.get(
        `https://tonapi.io/v1/blockchain/getAccount?account=${address.toRawString()}`
      ),
    enabled: !!wallet,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) => ({
      ton: normalize(response.data.balance, 9).toFixed(2),
      usd: (
        normalize(response.data.balance, 9) * ton.market_data.current_price.usd
      ).toFixed(2),
    }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["wallet-jettons", wallet],
    queryFn: async () =>
      await axios.get(`https://tonapi.io/v2/accounts/${wallet}/jettons`),
    enabled: !!wallet,
    refetchOnMount: false,
    refetchOnReconnect: false,
    select: (response) => response.data.balances,
  });

  useEffect(() => {
    if (TonProofApi.accessToken) {
      if (selected && tonAddress) {
        axios
          .get(
            `https://api.fck.foundation/api/v2/user/swaps?address=${wallet}&jetton_id=${selected}&count=100`,
            {
              headers: {
                Authorization: `Bearer ${TonProofApi.accessToken}`,
              },
            }
          )
          .then((response) => {
            setSwaps(response.data.data.sources.DeDust.jettons[selected].swaps);
          });
      }
    }
  }, [tonAddress, selected, wallet]);

  return (
    <Card variant="bordered">
      <Card.Body>
        <Grid.Container wrap="nowrap" justify="space-between">
          <Grid xs={12}>
            <Grid.Container direction="column" gap={1} css={{ m: "-$6" }}>
              <Grid xs={12}>
                <Grid.Container wrap="nowrap" justify="space-between">
                  <Grid>
                    <Grid.Container gap={1} css={{ m: "-$6", maxW: 300 }}>
                      <Grid>
                        {wallet?.slice(0, 4)}...{wallet?.slice(-4)}
                      </Grid>
                      <Grid>
                        <Link
                          href={`https://tonviewer.com/${wallet}`}
                          target="_blank"
                        >
                          <Tonviewer
                            style={{ fill: "currentColor", zoom: 0.5 }}
                          />
                        </Link>
                      </Grid>
                      <Grid>
                        <Link
                          href={`https://tonscan.org/address/${wallet}`}
                          target="_blank"
                        >
                          <Tonscan
                            style={{ fill: "currentColor", fontSize: 20 }}
                          />
                          <Text size={12} css={{ fontWeight: "bold" }}>
                            Tonscan
                          </Text>
                        </Link>
                      </Grid>
                      <Grid>
                        {isLoadingTON ? (
                          <Skeleton width={100} height={18} />
                        ) : (
                          `${dataTON?.ton} TON ≈ $${dataTON?.usd}`
                        )}
                      </Grid>
                      <Spacer y={0.4} />
                      <Grid>
                        <Grid.Container wrap="nowrap">
                          <Grid>
                            <Input
                              type="float"
                              size="sm"
                              placeholder="1 TON"
                              css={{ w: 75 }}
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                            />
                          </Grid>
                          {tonAddress && wallet !== tonAddress && (
                            <>
                              <Spacer y={0.4} />
                              <Grid>
                                <Button
                                  flat
                                  size="sm"
                                  css={{ minWidth: "auto" }}
                                  onPress={() =>
                                    tonConnectUi.sendTransaction({
                                      validUntil: Date.now() + 1000000,
                                      messages: [
                                        {
                                          address: address.toRawString(),
                                          amount: (
                                            parseFloat(value) * 1000000000
                                          ).toString(),
                                        },
                                      ],
                                    })
                                  }
                                >
                                  {t("sendTransaction")}
                                </Button>
                              </Grid>
                            </>
                          )}
                        </Grid.Container>
                      </Grid>
                    </Grid.Container>
                  </Grid>

                  <Spacer x={1} />
                  <Grid
                    dangerouslySetInnerHTML={{
                      __html: qrSVG.replace('style="', 'style="width:130.5px;'),
                    }}
                  />
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Card.Body>
    </Card>
  );
};

export default WalletHeader;
