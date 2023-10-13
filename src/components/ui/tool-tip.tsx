"use client";
import { ReactNode } from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { cn } from "@/lib/utils";

export default function ToolTip({
  children,
  text,
  showArrow = false,
  customComponent,
  disableForMobile = true,
}: {
  children: ReactNode;
  text?: string;
  showArrow?: boolean;
  customComponent?: ReactNode;
  disableForMobile?: boolean;
}) {
  const content = customComponent ? (
    customComponent
  ) : (
    <span className="text-xs">{text}</span>
  );

  return (
    <Tooltip content={content} showArrow={showArrow}>
      <div
        className={cn("xl:block", {
          hidden: disableForMobile,
        })}
      >
        {children}
      </div>
    </Tooltip>
  );
}
