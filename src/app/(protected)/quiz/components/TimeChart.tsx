"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Paper, Typography } from "@mui/material";

type Props = {
  data: number[];
};

export default function TimeChart({ data }: Props) {
  const chartData = data.map((time, index) => ({
    name: `Q${index + 1}`,
    tempo: time,
  }));

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        📈 Tempo por questão (s)
      </Typography>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tempo" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
