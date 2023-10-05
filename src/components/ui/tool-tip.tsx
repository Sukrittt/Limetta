"use client";
import { ReactNode, useState } from "react";
import { Tooltip } from "@nextui-org/tooltip";

export default function ToolTip({
  children,
  text,
  showArrow = false,
  customComponent,
}: {
  children: ReactNode;
  text?: string;
  showArrow?: boolean;
  customComponent?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const content = customComponent ? (
    customComponent
  ) : (
    <span className="text-xs">{text}</span>
  );

  return (
    <Tooltip
      content={content}
      showArrow={showArrow}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <div onClick={() => setIsOpen((prev) => !prev)}>{children}</div>
    </Tooltip>
  );
}
