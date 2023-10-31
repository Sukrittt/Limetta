"use client";
import { getTimeLeftInMonth } from "@/lib/utils";

export const DaysLeftInMonth = () => {
  const timeLeftForMonth = getTimeLeftInMonth();

  return <span className="text-muted-foreground">{timeLeftForMonth}</span>;
};
