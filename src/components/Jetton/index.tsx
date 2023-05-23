import { colors } from "colors";
import { AppContext } from "contexts";
import { lazy, useContext } from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

export const FJetton = ({ data, height = 50, color }) => {
  const { theme } = useContext(AppContext);

  return (
    <ResponsiveContainer width="100%" height={height} className="jetton-chart">
      <AreaChart width={300} height={height} data={data}>
        <Area
          name="pv"
          type="natural"
          dot={false}
          dataKey="pv"
          stroke={color}
          fill={color}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};