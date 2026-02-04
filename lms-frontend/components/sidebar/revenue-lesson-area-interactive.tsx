"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { type PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EnrollmentStatsType, AdminAllLessonsType } from "@/lib/api"

// Month configuration
const MONTHS = [
  { key: "january", label: "January" },
  { key: "february", label: "February" },
  { key: "march", label: "March" },
  { key: "april", label: "April" },
  { key: "may", label: "May" },
  { key: "june", label: "June" },
  { key: "july", label: "July" },
  { key: "august", label: "August" },
  { key: "september", label: "September" },
  { key: "october", label: "October" },
  { key: "november", label: "November" },
  { key: "december", label: "December" },
] as const

type MonthKey = (typeof MONTHS)[number]["key"]

// Revenue chart color configuration (green/teal palette - chart-1, 2, 3)
const revenueChartConfig = {
  value: { label: "Value" },
  january: { label: "January", color: "var(--chart-1)" },
  february: { label: "February", color: "var(--chart-2)" },
  march: { label: "March", color: "var(--chart-3)" },
  april: { label: "April", color: "var(--chart-1)" },
  may: { label: "May", color: "var(--chart-2)" },
  june: { label: "June", color: "var(--chart-3)" },
  july: { label: "July", color: "var(--chart-1)" },
  august: { label: "August", color: "var(--chart-2)" },
  september: { label: "September", color: "var(--chart-3)" },
  october: { label: "October", color: "var(--chart-1)" },
  november: { label: "November", color: "var(--chart-2)" },
  december: { label: "December", color: "var(--chart-3)" },
} satisfies ChartConfig

// Lessons chart color configuration (blue/purple palette - chart-4, 5)
const lessonsChartConfig = {
  value: { label: "Value" },
  january: { label: "January", color: "var(--chart-4)" },
  february: { label: "February", color: "var(--chart-5)" },
  march: { label: "March", color: "var(--chart-4)" },
  april: { label: "April", color: "var(--chart-5)" },
  may: { label: "May", color: "var(--chart-4)" },
  june: { label: "June", color: "var(--chart-5)" },
  july: { label: "July", color: "var(--chart-4)" },
  august: { label: "August", color: "var(--chart-5)" },
  september: { label: "September", color: "var(--chart-4)" },
  october: { label: "October", color: "var(--chart-5)" },
  november: { label: "November", color: "var(--chart-4)" },
  december: { label: "December", color: "var(--chart-5)" },
} satisfies ChartConfig

// Aggregate revenue by month from enrollment stats
function aggregateRevenueByMonth(enrollmentStats: EnrollmentStatsType[]) {
  const monthlyRevenue: Record<MonthKey, number> = {
    january: 0, february: 0, march: 0, april: 0, may: 0, june: 0,
    july: 0, august: 0, september: 0, october: 0, november: 0, december: 0,
  }

  enrollmentStats.forEach((stat) => {
    const date = new Date(stat.date)
    const monthIndex = date.getMonth()
    const monthKey = MONTHS[monthIndex].key
    monthlyRevenue[monthKey] += stat.revenue
  })

  return MONTHS.map((month) => ({
    month: month.key,
    value: monthlyRevenue[month.key],
    fill: `var(--color-${month.key})`,
  })).filter((d) => d.value > 0)
}

// Aggregate lessons by month from lessons data
function aggregateLessonsByMonth(lessons: AdminAllLessonsType) {
  const monthlyLessons: Record<MonthKey, number> = {
    january: 0, february: 0, march: 0, april: 0, may: 0, june: 0,
    july: 0, august: 0, september: 0, october: 0, november: 0, december: 0,
  }

  lessons.forEach((lesson) => {
    const date = new Date(lesson.date)
    const monthIndex = date.getMonth()
    const monthKey = MONTHS[monthIndex].key
    monthlyLessons[monthKey] += 1
  })

  return MONTHS.map((month) => ({
    month: month.key,
    value: monthlyLessons[month.key],
    fill: `var(--color-${month.key})`,
  })).filter((d) => d.value > 0)
}

// Interactive Pie Chart Card Component
function InteractivePieCard({
  id,
  title,
  description,
  data,
  formatValue,
  label,
  chartConfig,
}: {
  id: string
  title: string
  description: string
  data: { month: MonthKey; value: number; fill: string }[]
  formatValue: (value: number) => string
  label: string
  chartConfig: ChartConfig
}) {
  const [activeMonth, setActiveMonth] = React.useState(data[0]?.month || "january")

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.month === activeMonth),
    [data, activeMonth]
  )

  const months = React.useMemo(() => data.map((item) => item.month), [data])

  const activeValue = React.useMemo(() => {
    const item = data.find((d) => d.month === activeMonth)
    return item?.value || 0
  }, [data, activeMonth])

  if (data.length === 0) {
    return (
      <Card data-chart={id} className="flex flex-col">
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center pb-6 pt-6">
          <span className="text-muted-foreground">No data available</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={(v) => setActiveMonth(v as MonthKey)}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {formatValue(activeValue)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {label}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Main component
export function RevenueLessonAreaInteractive({
  enrollmentData,
  lessonsData,
}: {
  enrollmentData: EnrollmentStatsType[]
  lessonsData: AdminAllLessonsType
}) {
  const revenueByMonth = React.useMemo(
    () => aggregateRevenueByMonth(enrollmentData),
    [enrollmentData]
  )
  const lessonsByMonth = React.useMemo(
    () => aggregateLessonsByMonth(lessonsData),
    [lessonsData]
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 @xl/main:grid-cols-2">
      <InteractivePieCard
        id="monthly-revenue"
        title="Monthly Revenue"
        description="Revenue generated per month"
        data={revenueByMonth}
        formatValue={(value) => `$${value.toFixed(2)}`}
        label="Revenue"
        chartConfig={revenueChartConfig}
      />
      <InteractivePieCard
        id="monthly-lessons"
        title="Monthly Lessons"
        description="Lessons created per month"
        data={lessonsByMonth}
        formatValue={(value) => value.toLocaleString()}
        label="Lessons"
        chartConfig={lessonsChartConfig}
      />
    </div>
  )
}
