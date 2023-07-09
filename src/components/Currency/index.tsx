import { useContext } from "react";
import { Button, Text, Spacer } from "@nextui-org/react";
import { AppContext } from "contexts";

export const Currency = () => {
  const { jettonCurrency, currency, setCurrency } = useContext(AppContext);

  return (
    <div
      className="flex place-items-center py-2 cursor-pointer"
      onClick={() => setCurrency(currency === "" ? "jUSDT" : "")}
    >
      {jettonCurrency?.image && (
        <img
          src={jettonCurrency?.image}
          width={18}
          height={18}
          alt={currency}
          className="rounded-full"
        />
      )}
      <Spacer x={0.4} />
      <Text>
        {currency !== "" ? currency : "TON"}
      </Text>
    </div>
  );
};
