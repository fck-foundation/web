import { useContext } from "react";
import { Text, Spacer, Collapse, Grid } from "@nextui-org/react";
import { AppContext } from "contexts";

export const DEX = () => {
  const { enabled, dex } = useContext(AppContext);

  return (
    <Collapse
      title=""
      css={{ p: 0 }}
      subtitle={
        <div className="flex place-items-center">
          <img
            src="/img/dedust.webp"
            width={18}
            height={18}
            alt="DeDust.io"
            style={{ minWidth: 18 }}
          />
          <Spacer x={0.4} />
          <Text>
            {dex}
          </Text>
          <Spacer x={0.4} />
        </div>
      }
    >
      <Grid.Container direction="column" justify="center">
        <Grid className="flex place-items-center" css={{ color: "$accents8" }}>
          <img
            src="/img/stonfi.svg"
            width={18}
            height={18}
            alt="Stonfi"
            className="min-w-[18px]"
          />
          <Spacer x={0.4} />
          Stonfi (coming soon)
        </Grid>
        <Spacer y={0.4} />
        <Grid className="flex place-items-center" css={{ color: "$accents8" }}>
          <img
            src="/img/megaton.svg"
            width={18}
            height={18}
            alt="Megaton"
            className="min-w-[18px]"
          />
          <Spacer x={0.4} />
          Megaton (coming soon)
        </Grid>
      </Grid.Container>
    </Collapse>
  );
};
