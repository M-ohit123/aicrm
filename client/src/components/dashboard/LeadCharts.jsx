"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LeadCharts({
  leads = [],
}) {
  const statusData = [
    {
      name: "New",
      value: leads.filter(
        (lead) => lead.status === "New"
      ).length,
    },
    {
      name: "Contacted",
      value: leads.filter(
        (lead) => lead.status === "Contacted"
      ).length,
    },
    {
      name: "Qualified",
      value: leads.filter(
        (lead) => lead.status === "Qualified"
      ).length,
    },
    {
      name: "Converted",
      value: leads.filter(
        (lead) => lead.status === "Converted"
      ).length,
    },
    {
      name: "Lost",
      value: leads.filter(
        (lead) => lead.status === "Lost"
      ).length,
    },
  ];

  const sourceCount = {};

  leads.forEach((lead) => {
    const source = lead.source || "Other";

    sourceCount[source] =
      (sourceCount[source] || 0) + 1;
  });

  const sourceData = Object.entries(
    sourceCount
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const priorityData = [
    {
      name: "High",
      value: leads.filter(
        (lead) => lead.priority === "High"
      ).length,
    },
    {
      name: "Medium",
      value: leads.filter(
        (lead) => lead.priority === "Medium"
      ).length,
    },
    {
      name: "Low",
      value: leads.filter(
        (lead) => lead.priority === "Low"
      ).length,
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

      {/* STATUS CHART */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Lead Status Analytics
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Distribution of leads by current status.
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={statusData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                name="Leads"
                fill="#111827"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SOURCE CHART */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Lead Sources
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Where your leads are coming from.
          </p>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>

              <Pie
                data={sourceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >

                {sourceData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#111827",
                          "#2563eb",
                          "#16a34a",
                          "#9333ea",
                          "#ea580c",
                        ][index % 5]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* PRIORITY CHART */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Lead Priority Analytics
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            High, medium and low priority leads.
          </p>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={priorityData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                name="Leads"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}