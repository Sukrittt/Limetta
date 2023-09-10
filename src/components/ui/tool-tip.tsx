import { ReactNode } from "react";
import { Tooltip } from "@nextui-org/tooltip";

export default function ToolTip({
  children,
  text,
  showArrow = false,
}: {
  children: ReactNode;
  text: string;
  showArrow?: boolean;
}) {
  return (
    <Tooltip
      content={<span className="text-xs">{text}</span>}
      showArrow={showArrow}
    >
      {children}
    </Tooltip>
  );
}
