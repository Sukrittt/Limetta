"use client";

import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Dues } from "@/db/schema";
import { CurrencyType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface DueCardProps {
  initialDues: Dues[];
  initialPayableBalance: number;
  initialReceivableBalance: number;
  currency: CurrencyType;
}

export const DueCard: FC<DueCardProps> = ({
  initialDues,
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
      ["miscellaneous-entries"],
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
        Your transactions will appear here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 px-4 sm:px-6">
        <span className="hidden lg:block">Date & Time</span>
        <span className="col-span-2 sm:col-span-3">Details</span>
        <span className="text-center col-span-2">Amount</span>
      </div>
      {miscEntries.map((entry, index) => {
        if (index === miscEntries.length - 1) {
          return (
            <div key={entry.id} ref={ref}>
              <DueEntryItem
                entry={entry}
                currency={currency}
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
                initialPayableBalance={initialPayableBalance}
                initialReceivableBalance={initialReceivableBalance}
              />
            </div>
          );
        }
      })}
      {isFetchingNextPage && <p>Loading...</p>}
    </div>
  );
};

interface DueEntryProps {
  entry: Dues;
  initialPayableBalance: number;
  initialReceivableBalance: number;
  currency: CurrencyType;
}

const DueEntryItem: FC<DueEntryProps> = ({
  currency,
  entry,
  initialPayableBalance,
  initialReceivableBalance,
}) => {
  // const entryDetails = {
  //   entryId: entry.id,
  //   amount: entry.amount,
  //   description: entry.entryName,
  //   initialBalance,
  // };

  return (
    <Card>
      <CardContent className="grid grid-cols-7 px-4 sm:px-6 py-3">
        <div className="items-center col-span-2 lg:col-span-1">
          <span className="text-xs tracking-tighter">
            {format(new Date(entry.createdAt), "dd MMM '·' h:mm a")}
          </span>
        </div>
        <span className="col-span-2 sm:col-span-3 break-words">
          {entry.entryName}
        </span>

        <span
          className={cn("text-center col-span-2", {
            // "text-green-600": entry.entryType === "in",
            // "text-red-500": entry.entryType === "out",
          })}
        >
          {/* {entry.entryType === "in" ? "+" : "-"} */}
          {currency}
          {entry.amount.toLocaleString()}
        </span>
        <div className="flex justify-around items-center text-xs">
          {/* <MiscEditEntry entryDetails={entryDetails} currency={currency} />
            <MiscDeleteEntry entryDetails={entryDetails} /> */}
          <span>Edit</span>
          <span>Delete</span>
        </div>
      </CardContent>
    </Card>
  );
};
