import {
  TouchEventHandler,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  Card,
  Text,
  Image,
  Badge,
  Spacer,
  Progress,
  Divider,
  Button,
  Input,
} from "@nextui-org/react";
import { ARR09, ARR10, ARR24, Ton } from "assets/icons";
import useLongPress from "hooks/useLongPress";
import { AppContext } from "contexts";
import { Address } from "ton-core";
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { normalize, swapJetton, whiteCoins } from "utils";
import { JettonMaster } from "ton";

const targetTime = new Date("2023-07-10 7:00").getTime();

export const Swap = () => {
  const address = useTonAddress();
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();
  const { t } = useTranslation();
  const { client, walletJettons } = useContext(AppContext);

  const [currentTime, setCurrentTime] = useState(Date.now());

  const timeBetween = targetTime - currentTime;
  const seconds = Math.floor((timeBetween / 1000) % 60);
  const minutes = Math.floor((timeBetween / 1000 / 60) % 60);
  const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onPay = () => {
    if (!address && document.getElementsByTagName("tc-root")) {
      (
        Array.from(
          document.getElementsByTagName("tc-root")[0]?.childNodes
        )[0] as any
      )?.click();
    } else {
      if (wallet) {
        const jetton = Address.parseRaw(whiteCoins["FCK"]);
        const masterContract = JettonMaster.create(jetton);
        const master = client.open(masterContract);

        master
          .getWalletAddress(Address.parseRaw(wallet.account.address))
          .then((addr) => {
            tonConnectUi.sendTransaction(
              swapJetton({
                value,
                forward: address,
                to: "kQCEFIAX9z37LMSkulOPNu4l6l-rSSpUpuLj6wWtwg2lUZ45",
              })
            );
          });
      }
    }
  };

  const value = useMemo(
    () =>
      normalize(
        walletJettons?.find(
          ({ jetton }) =>
            jetton.address ===
            "0:3a4d2191094e3a33d4601efa51bb52dc5baa354516e162b7706955385f8144a7"
        )?.balance || 0,
        5
      ),
    []
  );

  return (
    <Card variant="shadow">
      <Card.Body css={{ overflow: "visible", pt: 0, pb: 0 }}>
        <div className="flex flex-col justify-between place-items-center">
          <div className="card-ido__bg"></div>
          <div
            className="flex justify-between w-full max-w-[305px]"
            style={{ padding: "var(--nextui-space-sm)" }}
          >
            <Badge color="default">125 000 total</Badge>
            <Badge color="primary">
              {days}D. {hours}H. {minutes}M. {seconds}S.
            </Badge>
          </div>
          <div className="flex justify-between place-items-center">
            <div className="relative">
              <Image src="/img/v1.png" width="150px" className="rounded-full" />
              <Text
                weight="bold"
                css={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translate3d(-50%, 0, 0)",
                }}
              >
                V1
              </Text>
            </div>
            <div className="text-center">
              <Button flat css={{ minWidth: "auto" }} disabled>
                <ARR24 className="text-2xl fill-current" /> <Spacer x={0.4} />{" "}
                Get new
              </Button>
              {value && (
                <Text
                  className="text-xs mt-2"
                  css={{ color: "var(--nextui-colors-primary)" }}
                >
                  {value} FCK
                </Text>
              )}
            </div>
            <div className="relative">
              <Image src="/img/v2.png" width="150px" className="rounded-full" />
              <Text
                weight="bold"
                css={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translate3d(-50%, 0, 0)",
                }}
              >
                V2
              </Text>
            </div>
          </div>
          <Spacer y={0.8} />
          <div
            className="flex justify-between w-full"
            style={{
              maxWidth: "calc(305px - var(--nextui-space-sm) * 2)",
            }}
          >
            <Text className="text-xs">0 exchanged</Text>
            <Text className="text-xs">125 000 left</Text>
          </div>
          <Spacer y={0.2} />
          <Progress
            color="success"
            value={(value / 50000) * 100}
            style={{
              maxWidth: "calc(305px - var(--nextui-space-sm) * 2)",
            }}
          />
          <Spacer y={0.8} />
        </div>
      </Card.Body>
    </Card>
  );
};
