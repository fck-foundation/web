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
import { normalize, getSwapJetton, whiteCoins } from "utils";
import { JettonMaster } from "ton";
import { SwapToV2Contract } from "../core/Swap";

const targetTime = new Date("2023-07-14 12:00").getTime();

export const Swap = () => {
  const address = useTonAddress();
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();
  const { t } = useTranslation();
  const { client, walletJettons } = useContext(AppContext);
  const [stats, setStats] = useState({
    new: 0,
    old: 0
  });
  const [currentTime, setCurrentTime] = useState(Date.now());

  const timeBetween = targetTime - currentTime;
  const seconds = Math.floor((timeBetween / 1000) % 60);
  const minutes = Math.floor((timeBetween / 1000 / 60) % 60);
  const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const getData = async () => {
      setTimeout(async () => {
        const master = client.open(
          SwapToV2Contract.createFromAddress(
            Address.parse("EQCEFIAX9z37LMSkulOPNu4l6l-rSSpUpuLj6wWtwg2lUSWz")
          )
        );
        const getBalances = await master.getBalances();

        setStats({
          new: normalize(getBalances.new_jetton.toString(), 9),
          old: normalize(getBalances.old_jetton.toString(), 5),
        });
      }, 1000);
    };

    getData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onPay = async () => {
    if (!address && document.getElementsByTagName("tc-root")) {
      (
        Array.from(
          document.getElementsByTagName("tc-root")[0]?.childNodes
        )[0] as any
      )?.click();
    } else {
      if (wallet) {
        const jetton = Address.parseRaw(whiteCoins["OLDFCK"]);
        const masterContract = JettonMaster.create(jetton);
        const master = client.open(masterContract);

        master
          .getWalletAddress(Address.parseRaw(wallet.account.address))
          .then((addr) => {
            tonConnectUi.sendTransaction(
              getSwapJetton({
                value,
                forward: address,
                to: addr.toString(),
                contract: "EQCEFIAX9z37LMSkulOPNu4l6l-rSSpUpuLj6wWtwg2lUSWz",
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
            // "0:3a4d2так191094e3a33d4601efa51bb52dc5baa354516e162b7706955385f8144a7"
            "0:8a2f4c2cbee23cdde55e2971d180d36015404bb2f094a57d52144a0ec8ec44c7"
        )?.balance || 0,
        5
      ),
    []
  );

  return (
    <Card variant="bordered">
      <Card.Body css={{ overflow: "visible", pt: 0, pb: 0 }}>
        <div className="flex flex-col justify-between place-items-center">
          <div className="card-ido__bg"></div>
          <div
            className="flex justify-between w-full max-w-[305px]"
            style={{ padding: "var(--nextui-space-sm)" }}
          >
            <Badge color="default">{125000/*stats.old + stats.new */} {t('total')}</Badge>
            <Badge color="primary">
              {days}{t('D')}. {hours}{t('H')}. {minutes}{t('M')}. {seconds}{t('S')}.
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
              <Button flat css={{ minWidth: "auto" }} onPress={onPay} disabled={!!address && value < 1}>
                <ARR24 className="text-2xl fill-current" /> <Spacer x={0.4} />{" "}
                {address ? 'Get new' : t('signIn')}
              </Button>
              {value > 0 && (
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
            <Text className="text-xs">{stats.old} {t('exchanged')}</Text>
            <Text className="text-xs">{125000 /*stats.old + stats.new */} {t('left')}</Text>
          </div>
          <Spacer y={0.2} />
          <Progress
            color="success"
            value={(stats.old / (stats.old + stats.new)) * 100}
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
