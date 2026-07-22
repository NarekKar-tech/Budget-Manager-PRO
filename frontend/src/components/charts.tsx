"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TrendChart({
  data,
}: {
  data: { month: string; income: number; expense: number }[];
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              background: "#11131d",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 16,
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#22C55E"
            fill="#22C55E"
            fillOpacity={0.12}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.12}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({
  data,
}: {
  data: { category: string; amount: number; color: string }[];
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={72}
            outerRadius={105}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell key={entry.category} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#11131d",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 16,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
