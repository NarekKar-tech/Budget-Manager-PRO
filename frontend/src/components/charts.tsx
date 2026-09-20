
"use client";

import { useState, useEffect } from "react";

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

// Detect mobile screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");

    const update = () => setIsMobile(media.matches);

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

// Cash Flow Trend Chart
export function TrendChart({
  data,
}: {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
}) {
  const isMobile = useIsMobile();

  return (
    <div className="h-60 w-full min-w-0 sm:h-72">

      <ResponsiveContainer width="100%" height="100%">

        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: isMobile ? 5 : 20,
            left: isMobile ? -25 : 0,
            bottom: 0,
          }}
        >

          <CartesianGrid
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            stroke="#64748b"
            tick={{
              fontSize: isMobile ? 10 : 12,
            }}
            tickLine={false}
            minTickGap={isMobile ? 15 : 5}
          />

          <YAxis
            stroke="#64748b"
            width={isMobile ? 45 : 60}
            tick={{
              fontSize: isMobile ? 10 : 12,
            }}
            tickFormatter={(value: number) => {
              if (Math.abs(value) >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              }

              if (Math.abs(value) >= 1000) {
                return `${(value / 1000).toFixed(0)}K`;
              }

              return String(value);
            }}
          />

          <Tooltip
            contentStyle={{
              background: "#11131d",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 16,
              fontSize: isMobile ? 12 : 14,
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

// Expense Category Chart
export function CategoryChart({
  data,
}: {
  data: {
    category: string;
    amount: number;
    color: string;
  }[];
}) {
  const isMobile = useIsMobile();

  return (
    <div className="h-60 w-full min-w-0 sm:h-72">

      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={isMobile ? 45 : 72}
            outerRadius={isMobile ? 75 : 105}
            paddingAngle={4}
          >

            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={entry.color}
              />
            ))}

          </Pie>

          <Tooltip
            contentStyle={{
              background: "#11131d",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 16,
              fontSize: isMobile ? 12 : 14,
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}