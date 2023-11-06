"use client";
import Link from "next/link";
import axios from "axios";
import { format } from "date-fns";
import Balancer from "react-wrap-balancer";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { Savings } from "@/db/schema";
import { CurrencyType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SavingsEntryItemSkeleton } from "@/components/skeletons/infinite-cards";

const SavingsCard = ({
  initialSavingsEntries,
  currency,
}: {
  initialSavingsEntries: Savings[];
  currency: CurrencyType;
}) => {
  const lastEntryRef = useRef<HTMLElement>(null);
  const [savingsEntries, setSavingsEntries] = useState(initialSavingsEntries);

  const [noNewData, setNoNewData] = useState(false);

  const { ref, entry } = useIntersection({
    root: lastEntryRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(
      ["savings-entries"],
      async ({ pageParam = 1 }) => {
        const queryUrl = `/api/savings?page=${pageParam}`;

        const { data } = await axios(queryUrl);

        setNoNewData(false);

        return data as Savings[];
      },
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [initialSavingsEntries], pageParams: [1] },
      }
    );

  //infinite-scroll logic
  useEffect(() => {
    if (isFetching) return;

    if (data?.pages[data?.pages.length - 1].length === 0) {
      setNoNewData(true);
    }

    setSavingsEntries(
      data?.pages.flatMap((page) => page) ?? initialSavingsEntries
    );
  }, [data, initialSavingsEntries, isFetching]);

  useEffect(() => {
    if (initialSavingsEntries.length < INFINITE_SCROLLING_PAGINATION_RESULTS)
      return;

    if (entry?.isIntersecting && !noNewData) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, initialSavingsEntries, noNewData]);

  if (savingsEntries.length === 0) {
    return (
      <div className="flex justify-center h-[calc(80vh-150px)] lg:h-[calc(80vh-130px)]">
        <Balancer className="mt-2 text-sm text-center tracking-tight text-muted-foreground">
          Your monthly savings and money transfers will appear here.
        </Balancer>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <div className="grid grid-cols-7 px-4 sm:px-6 font-semibold">
        <span className="hidden lg:block">Date & Time</span>
        <span className="col-span-5 lg:col-span-3">Details</span>
        <span className="text-center col-span-2">Amount</span>
      </div>
      <ScrollShadow className="h-[calc(80vh-150px)] lg:h-[calc(80vh-160px)] w-full no-scrollbar pb-12">
        <div className="flex flex-col gap-y-8 lg:gap-y-2">
          {savingsEntries.map((entry, index) => {
            if (index === savingsEntries.length - 1) {
              return (
                <div key={entry.id} ref={ref}>
                  <SavingsEntryItem entry={entry} currency={currency} />
                </div>
              );
            } else {
              return (
                <div key={entry.id}>
                  <SavingsEntryItem entry={entry} currency={currency} />
                </div>
              );
            }
          })}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <SavingsEntryItemSkeleton key={index} />
            ))}
        </div>
      </ScrollShadow>
    </div>
  );
};

export default SavingsCard;

const SavingsEntryItem = ({
  entry,
  currency,
}: {
  entry: Savings;
  currency: CurrencyType;
}) => {
  const transferEntry = entry.transferingFrom || entry.transferingTo;
  const transferText = entry.transferingFrom
    ? entry.transferingFrom
    : entry.transferingTo;

  return (
    <Card className="relative bg-background">
      <CardContent className="grid grid-cols-7 px-4 sm:px-6 py-3">
        <div className="hidden lg:block items-center">
          <span className="text-xs tracking-tighter">
            {format(new Date(entry.createdAt), "dd MMM '·' h:mm a")}
          </span>
        </div>
        <span className="col-span-5 lg:col-span-3 break-words">
          {transferEntry ? (
            <>
              {`Transferred ${entry.transferingFrom ? "from" : "to"}
                      ${transferText} account`}
            </>
          ) : (
            <p>
              {entry.entryName}{" "}
              {entry.dueType && (
                <span className="text-xs text-muted-foreground font-mono">{`(due ${
                  entry.dueType === "payable" ? "paid" : "received"
                })`}</span>
              )}
            </p>
          )}
        </span>

        <span
          className={cn("text-center col-span-2", {
            "text-success-text": entry.entryType === "in",
            "text-danger-text": entry.entryType === "out",
          })}
        >
          {entry.entryType === "in" ? "+" : "-"}
          {currency}
          {entry.amount.toLocaleString()}
        </span>
        {entry.dueType && (
          <Link
            href="/dues"
            className="hidden lg:block text-primary text-center text-xs underline underline-offset-4"
          >
            Dues
          </Link>
        )}
        {transferEntry && (
          <Link
            href={`/${transferText}`}
            className="hidden lg:block text-primary text-center text-xs underline underline-offset-4"
          >
            {transferText &&
              transferText?.charAt(0).toUpperCase() + transferText?.slice(1)}
          </Link>
        )}
      </CardContent>
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 flex gap-x-4 lg:hidden">
        {entry.dueType && (
          <Link
            href="/dues"
            className="text-primary text-center text-xs underline underline-offset-4"
          >
            Dues
          </Link>
        )}
        {transferEntry && (
          <Link
            href={`/${transferText}`}
            className="text-primary text-center text-xs underline underline-offset-4"
          >
            {transferText &&
              transferText?.charAt(0).toUpperCase() + transferText?.slice(1)}
          </Link>
        )}
      </CardFooter>
      <Badge className="lg:hidden absolute -bottom-[22px] bg-secondary text-white rounded-t-none rounded-b-lg right-3">
        <span className="text-[10px] font-normal tracking-tighter">
          {format(new Date(entry.createdAt), "dd MMM '·' h:mm a")}
        </span>
      </Badge>
    </Card>
  );
};
