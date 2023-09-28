"use client";
import { FC } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";

interface ExpenseTableProps {
  currency: CurrencyType;
  needSpent: number;
  wantSpent: number;
  needsLeft: number;
  wantsLeft: number;
}

export const ExpenseTable: FC<ExpenseTableProps> = ({
  currency,
  needsLeft,
  needSpent,
  wantsLeft,
  wantSpent,
}) => {
  return (
    <Table removeWrapper aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Categories</TableColumn>
        <TableColumn>Spent</TableColumn>
        <TableColumn>Left</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>Needs</TableCell>
          <TableCell>
            {currency}
            {needSpent.toLocaleString()}
          </TableCell>
          <TableCell
            className={cn({
              "text-red-500": needsLeft < 0,
            })}
          >
            <span>{needsLeft < 0 ? "-" : ""}</span>
            {currency}
            {needsLeft.toLocaleString()}
          </TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Wants</TableCell>
          <TableCell>
            {currency}
            {wantSpent.toLocaleString()}
          </TableCell>
          <TableCell
            className={cn({
              "text-red-500": wantsLeft < 0,
            })}
          >
            <span>{needsLeft < 0 ? "-" : ""}</span>
            {currency}
            {wantsLeft.toLocaleString()}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
