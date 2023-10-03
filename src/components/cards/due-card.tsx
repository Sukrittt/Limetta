"use client";

import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Divider } from "@nextui-org/divider";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Dues } from "@/db/schema";
import { CurrencyType } from "@/types";
import { DuePaid } from "@/components/due/due-paid";
import { DueDelete } from "@/components/due/due-delete";
import { DueEditEntry } from "@/components/due/due-edit";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DueEntryItemSkeleton } from "@/components/skeletons/infinite-cards";

interface DueCardProps {
  initialDues: Dues[];
  initialPayableBalance: number;
  initialReceivableBalance: number;
  currency: CurrencyType;
  miscBalance: number;
}

export const DueCard: FC<DueCardProps> = ({
  initialDues,
  miscBalance,
  initialPayableBalance,
  initialReceivableBalance,
  currency,
}) => {
  const lastEntryRef = useRef<HTMLElement>(null);
  const [miscEntries, setMiscEntries] = useState(initialDues);

  const [noNewData, setNoNewData] = useState(false);

  const { ref, entry } = useIntersection({
    root: lastEntryRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(
      ["dues-entries"],
      async ({ pageParam = 1 }) => {
        const queryUrl = `/api/dues?page=${pageParam}`;

        const { data } = await axios(queryUrl);

        setNoNewData(false);

        return data as Dues[];
      },
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [initialDues], pageParams: [1] },
      }
    );

  //infinite-scroll logic
  useEffect(() => {
    if (isFetching) return;

    if (data?.pages[data?.pages.length - 1].length === 0) {
      setNoNewData(true);
    }

    setMiscEntries(data?.pages.flatMap((page) => page) ?? initialDues);
  }, [data, initialDues, isFetching]);

  useEffect(() => {
    if (entry?.isIntersecting && !noNewData) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, noNewData]);

  if (miscEntries.length === 0) {
    return (
      <p className="mt-2 text-sm text-center tracking-tight text-muted-foreground">
        Your dues will appear here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <div className="grid grid-cols-5 lg:grid-cols-9 px-4 sm:px-6">
        <span className="hidden lg:block">Date & Time</span>
        <span className="col-span-4 lg:col-span-2">Details</span>
        <span className="text-center">Amount</span>
        <span className="hidden lg:block text-center">Type</span>
        <span className="hidden lg:block text-center">Status</span>
        <span className="hidden lg:block text-center">Due date</span>
      </div>
      {miscEntries.map((entry, index) => {
        if (index === miscEntries.length - 1) {
          return (
            <div key={entry.id} ref={ref}>
              <DueEntryItem
                entry={entry}
                currency={currency}
                miscBalance={miscBalance}
                initialPayableBalance={initialPayableBalance}
                initialReceivableBalance={initialReceivableBalance}
              />
            </div>
          );
        } else {
          return (
            <div key={entry.id}>
              <DueEntryItem
                entry={entry}
                currency={currency}
                miscBalance={miscBalance}
                initialPayableBalance={initialPayableBalance}
                initialReceivableBalance={initialReceivableBalance}
              />
            </div>
          );
        }
      })}
      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, index) => (
          <DueEntryItemSkeleton key={index} />
        ))}
    </div>
  );
};

interface DueEntryProps {
  entry: Dues;
  initialPayableBalance: number;
  initialReceivableBalance: number;
  miscBalance: number;
  currency: CurrencyType;
}

const DueEntryItem: FC<DueEntryProps> = ({
  currency,
  entry,
  miscBalance,
  initialPayableBalance,
  initialReceivableBalance,
}) => {
  const entryDetails = {
    entryId: entry.id,
    amount: entry.amount,
    description: entry.entryName,
    duePayableBalance: initialPayableBalance,
    dueReceivableBalance: initialReceivableBalance,
    dueType: entry.dueType,
    dueStatus: entry.dueStatus,
    dueDate: entry.dueDate,
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-5 lg:grid-cols-9 px-4 sm:px-6 py-3">
        <div className="hidden lg:flex items-center">
          <span className="text-xs tracking-tighter">
            {format(new Date(entry.createdAt), "dd MMM '·' h:mm a")}
          </span>
        </div>
        <span className="col-span-4 lg:col-span-2 break-words">
          {entry.entryName}
        </span>

        <span className="text-center">
          {currency}
          {entry.amount.toLocaleString()}
        </span>
        <div className="hidden lg:flex items-center justify-center">
          <span
            className={cn("text-center text-xs", {
              "text-red-500": entry.dueType === "payable",
              "text-green-600": entry.dueType === "receivable",
            })}
          >
            {entry.dueType === "payable" ? "Payable" : "Receivable"}
          </span>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <span
            className={cn("text-center text-xs", {
              "text-green-600": entry.dueStatus === "paid",
              "text-yellow-600": entry.dueStatus === "pending",
            })}
          >
            {entry.dueStatus === "paid" ? "Paid" : "Pending"}
          </span>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <span className="text-center text-xs">
            {format(new Date(entry.dueDate), "dd MMM, yy")}
          </span>
        </div>
        <div className="hidden lg:flex justify-around items-center text-xs col-span-2">
          <DuePaid entryDetails={entryDetails} miscBalance={miscBalance} />
          <DueEditEntry currency={currency} entryDetails={entryDetails} />
          <DueDelete entryDetails={entryDetails} />
        </div>
      </CardContent>
      <Divider className="block lg:hidden" />
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 flex flex-col items-start pt-3 gap-y-2 lg:hidden">
        <div className="flex gap-x-4">
          <span
            className={cn("text-center text-xs", {
              "text-red-500": entry.dueType === "payable",
              "text-green-600": entry.dueType === "receivable",
            })}
          >
            {entry.dueType === "payable" ? "Payable" : "Receivable"}
          </span>
          <span
            className={cn("text-center text-xs", {
              "text-green-600": entry.dueStatus === "paid",
              "text-yellow-600": entry.dueStatus === "pending",
            })}
          >
            {entry.dueStatus === "paid" ? "Paid" : "Pending"}
          </span>
        </div>
        <span className="text-center text-xs">
          Due date: {format(new Date(entry.dueDate), "dd MMM, yy")}
        </span>
        <div className="flex gap-x-4">
          <DuePaid entryDetails={entryDetails} miscBalance={miscBalance} />
          <DueEditEntry currency={currency} entryDetails={entryDetails} />
          <DueDelete entryDetails={entryDetails} />
        </div>
      </CardFooter>
    </Card>
  );
};
