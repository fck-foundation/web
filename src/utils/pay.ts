import { Address, beginCell, toNano } from "ton-core";

export const whiteCoins = {
  FCK: "0:3a4d2191094e3a33d4601efa51bb52dc5baa354516e162b7706955385f8144a7",
  // FCK: "0:271a29f3fb60371d2dbc4844cb1745e70c9911db9993cb283fe16eabf7d609b1",
  OLDFCK: "0:3a4d2191094e3a33d4601efa51bb52dc5baa354516e162b7706955385f8144a7"
};

const coins = {
  FCK: 100000,
};

export const payJetton = ({
  selected,
  address,
  forward,
  coin,
  to,
}: {
  selected: { id: any; amount: number }[];
  address: Address;
  forward: string;
  coin: "FCK";
  to: string;
}) => {
  return {
    validUntil: Date.now() + 1000000,
    messages: selected.map(({ id, amount }) => {
      const message = beginCell()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(0, 64)
        .storeCoins(Math.ceil(amount * coins[coin]))
        .storeAddress(Address.parse(to))
        .storeAddress(Address.parse(forward))
        .storeUint(0, 1)
        .storeCoins(1)
        .storeUint(0, 1)
        .storeUint(0, 32)
        .storeStringTail(id.toString())
        .endCell();

      return {
        address: address.toString(),
        amount: toNano("0.1").toString(),
        payload: message.toBoc().toString("base64"),
      };
    }),
  };
};

export const getSwapJetton = ({
  value,
  forward,
  to,
  contract,
}: {
  value: number;
  forward: string;
  to: string;
  contract: string;
}) => {
  return {
    validUntil: Date.now() + 1000000,
    messages: [
      {
        address: to,
        amount: toNano("0.15").toString(),
        payload: beginCell()
          .storeUint(0xf8a7ea5, 32)
          .storeUint(0, 64)
          .storeCoins(Number(value) * 10 ** 5)
          .storeAddress(Address.parse(contract))
          .storeAddress(Address.parse(forward))
          .storeUint(0, 1)
          .storeCoins(toNano("0.1"))
          .storeUint(0, 1)
          .storeUint(0, 32)
          .endCell()
          .toBoc()
          .toString("base64"),
      },
    ],
  };
};

export const getIDOJetton = ({
  value,
  forward,
  to,
}: {
  value: number;
  forward: string;
  to: string;
}) => {
  return {
    validUntil: Date.now() + 1000000,
    messages: [
      {
        address: to,
        amount: (toNano(value) + toNano("0.1")).toString(),
        payload: beginCell()
          .storeUint(0xdec25470, 32)
          .storeUint(0, 64)
          .endCell()
          .toBoc()
          .toString("base64"),
      },
    ],
  };
};
