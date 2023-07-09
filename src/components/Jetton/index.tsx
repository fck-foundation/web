import { ResponsiveContainer, AreaChart, Area } from "recharts";

export const FJetton = ({ index, data, height = 50, className = '', color }) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className={`jetton-chart ${className ? className : ''}`}
    >
      <AreaChart width={300} height={height} data={data}>
      <defs>
      <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.4}></stop>
        <stop offset="75%" stopColor={color} stopOpacity={0.05}></stop>
      </linearGradient>
    </defs>
        <Area
          animationBegin={150 * index}
          name="pv"
          type="linear"
          dot={false}
          dataKey="pv"
          stroke={color}
          fill={`url(#color${color})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
