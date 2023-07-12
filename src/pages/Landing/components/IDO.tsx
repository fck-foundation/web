import {
  TouchEventHandler,
  useContext,
  useEffect,
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
import { ARR09, ARR10, Ton } from "assets/icons";
import useLongPress from "hooks/useLongPress";
import { AppContext } from "contexts";
import { Address } from "ton-core";
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { getIDOJetton, normalize, whiteTokens } from "utils";
import { JettonMaster } from "ton";
import { IDO as CoreIDO } from "../core/IDO";
import { toast } from "react-toastify";

type TouchType = "increase" | "decrease";
const targetTime = 1689163200000;
const endTime = 1689768000000;
const contractIDO = "EQDeeRmi98TQJgWuvLWTCpSWf6ir_mJ0KbU9mCee6fMWZlHd";

export const IDO = () => {
  const isLongPress = useRef<any>();
  const address = useTonAddress();
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();
  const { t } = useTranslation();
  const { enabled, client } = useContext(AppContext);

  const [value, setValue] = useState(4);
  const [stats, setStats] = useState({
    balance: 10000,
    sold: 0,
    price: 4,
  });

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const getData = async () => {
      const master = client.open(
        CoreIDO.createFromAddress(Address.parse(contractIDO))
      );
      const getAllData = await master.getAllData();
      setStats({
        balance: normalize(getAllData.jetton_balance.toString(), 15),
        sold: normalize(getAllData.sold_jetton_amount.toString(), 15),
        price: normalize(getAllData.price.toString(), 15),
      });
    };

    getData();
  }, []);

  const timeBetween =
    targetTime >= Date.now() ? targetTime - currentTime : endTime - currentTime;
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

  const onLongTouch = (type: TouchType) => {
    if (type === "decrease") {
      setValue((i) => (i > 4 ? i - 4 : i));
    } else {
      setValue((i) => (i < 10000 ? i + 4 : i));
    }
  };

  const onLongPressIncrease = () => {
    isLongPress.current = setInterval(() => onLongTouch("increase"), 1);
  };
  const onLongPressDecrease = () => {
    isLongPress.current = setInterval(() => onLongTouch("decrease"), 1);
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressIncreaseEvent = useLongPress(
    onLongPressIncrease,
    () => onLongTouch("increase"),
    () => clearInterval(isLongPress.current),
    defaultOptions
  );
  const longPressDecreaseEvent = useLongPress(
    onLongPressDecrease,
    () => onLongTouch("decrease"),
    () => clearInterval(isLongPress.current),
    defaultOptions
  );

  const onValueChange = (e) => {
    const val = e.currentTarget.value.replace(/\D/g, "");
    setValue(
      parseFloat(val) > 4 && parseFloat(val) < 10000
        ? parseFloat(val)
        : parseFloat(val) > 4
        ? 10000
        : 4
    );
  };

  const onPay = () => {
    if (!address && document.getElementsByTagName("tc-root")) {
      (
        Array.from(
          document.getElementsByTagName("tc-root")[0]?.childNodes
        )[0] as any
      )?.click();
    } else if (Date.now() >= targetTime) {
      if (wallet) {
        const jetton = Address.parseRaw(whiteTokens["FCK"]);
        const masterContract = JettonMaster.create(jetton);
        const master = client.open(masterContract);

        master
          .getWalletAddress(Address.parseRaw(wallet.account.address))
          .then((addr) => {
            tonConnectUi
              .sendTransaction(
                getIDOJetton({
                  value: value / stats.price,
                  forward: address,
                  to: contractIDO,
                })
              )
              .then(() => {
                toast.success(t("transactionSuccess"), {
                  position: toast.POSITION.TOP_RIGHT,
                  theme: enabled ? "dark" : "light",
                });
              });
          });
      }
    }
  };

  return (
    <Card variant="bordered">
      <Card.Header css={{ pb: 0 }}>
        <Text className="text-2xl" color="primary">
          {t("joinIDO")}
        </Text>
      </Card.Header>
      <Card.Body css={{ overflow: "visible", pt: 0, pb: 0 }}>
        <Text className="pb-4">{t("joinIDODescription")}</Text>
        <Divider />
        <div className="flex flex-col justify-between place-items-center mt-4 card-ido">
          <div className="card-ido__bg"></div>
          <div
            className="flex justify-between w-full max-w-[305px]"
            style={{ padding: "var(--nextui-space-sm)" }}
          >
            <Badge color="default">
              {parseFloat(
                (Date.now() < targetTime
                  ? 10000
                  : stats.balance + stats.sold
                ).toFixed(0)
              ).toLocaleString()}{" "}
              {t("total")}
            </Badge>
            <Badge
              color={
                Date.now() <= targetTime
                  ? "primary"
                  : Date.now() <= endTime
                  ? "error"
                  : "default"
              }
            >
              {Date.now() <= endTime || Date.now() <= targetTime ? (
                <>
                  {days ? `${days}${t("D")}.` : ""}{" "}
                  {hours ? `${hours}${t("H")}.` : ""}{" "}
                  {minutes ? `${minutes}${t("M")}.` : ""}{" "}
                  {seconds ? `${seconds}${t("S")}.` : ""}
                </>
              ) : (
                t("ended")
              )}
            </Badge>
          </div>
          <div>
            <Image src="/img/v2.png" width="150px" className="floating-coin" />
          </div>
          <div
            className="flex justify-between w-full"
            style={{
              maxWidth: "calc(305px - var(--nextui-space-sm) * 2)",
            }}
          >
            <Text className="text-xs">
              {parseFloat(stats.sold.toFixed(0)).toLocaleString()} {t("sold")}
            </Text>
            <Text className="text-xs">
              {parseFloat(stats.balance.toFixed(0)).toLocaleString()}{" "}
              {t("left")}
            </Text>
          </div>
          <Spacer y={0.2} />
          <Progress
            color="success"
            value={(stats.sold / 10000) * 100}
            style={{
              maxWidth: "calc(305px - var(--nextui-space-sm) * 2)",
            }}
          />
          <Spacer y={0.4} />
          <Card.Footer className="max-w-[305px] flex flex-col">
            <div className="card-ido__input">
              <Text className="text-xs w-[40%]">{t("amount")}</Text>

              <div className="flex place-items-center">
                <div {...longPressDecreaseEvent}>
                  <Button
                    flat
                    size="xs"
                    icon={<ARR10 className="fill-current" />}
                    css={{ minWidth: "auto", pointerEvents: "none" }}
                  />
                </div>
                <Spacer x={0.2} />
                <Input
                  size="lg"
                  bordered
                  value={Date.now() < targetTime ? 1 : value}
                  min={1}
                  max={10000}
                  className="text-xs text-center card-ido__input-container"
                  disabled={false}
                  onChange={onValueChange}
                />

                <Spacer x={0.2} />
                <div {...longPressIncreaseEvent}>
                  <Button
                    flat
                    size="xs"
                    icon={<ARR09 className="fill-current" />}
                    css={{ minWidth: "auto", pointerEvents: "none" }}
                  />
                </div>
              </div>
              <div className="flex place-items-center justify-end whitespace-nowrap text-xs w-[40%]">
                ≈{" "}
                {Date.now() < targetTime
                  ? "?"
                  : parseFloat((value / stats.price).toFixed(2))}
                <Spacer x={0.2} />
                <Ton className="text-lg" />
              </div>
            </div>
            <Spacer y={0.8} />
            <Button
              color="gradient"
              auto
              disabled={stats.balance < 4}
              onPress={onPay}
            >
              {Date.now() < targetTime || stats.balance >= 4
                ? `${t("buyToken")} $FCK`
                : t("soldOut")}
            </Button>
          </Card.Footer>
        </div>
        {/* <Text className="text-base pb-2">{t("joinMotivation")}</Text> */}
      </Card.Body>
    </Card>
  );
};
