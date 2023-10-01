"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import { Skeleton } from "@/components/ui/skeleton";

export const ExpenseTableSkeleton = () => {
  return (
    <Table removeWrapper aria-label="Expense Table">
      <TableHeader>
        <TableColumn>Categories</TableColumn>
        <TableColumn>Spent</TableColumn>
        <TableColumn>Left</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>Needs</TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Wants</TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
