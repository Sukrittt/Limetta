import { ReactNode } from "react";
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
  const content = customComponent ? (
    customComponent
  ) : (
    <span className="text-xs">{text}</span>
  );

  return (
    <Tooltip content={content} showArrow={showArrow}>
      {children}
    </Tooltip>
  );
}
