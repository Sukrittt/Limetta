"use client";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import Balancer from "react-wrap-balancer";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Investments } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { InvestmentBookEntry } from "@/components/investments/invest-book-entry";
import { InvestmentEditEntry } from "@/components/investments/invest-edit-entry";
import { InvestmentEntryItemSkeleton } from "@/components/skeletons/infinite-cards";
import { InvestmentDeleteEntry } from "@/components/investments/investment-delete-entry";

export const InvestmentCard = ({
  currency,
  initialBalance,
  initialInvestmentEntries,
}: {
  initialInvestmentEntries: Investments[];
  currency: CurrencyType;
  initialBalance: number;
}) => {
  const lastEntryRef = useRef<HTMLElement>(null);
  const [investmentEntries, setInvestmentEntries] = useState(
    initialInvestmentEntries
  );

  const [noNewData, setNoNewData] = useState(false);

  const { ref, entry } = useIntersection({
    root: lastEntryRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(
      ["investment-entries"],
      async ({ pageParam = 1 }) => {
        const queryUrl = `/api/investment?page=${pageParam}`;

        const { data } = await axios(queryUrl);

        setNoNewData(false);

        return data as Investments[];
      },
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [initialInvestmentEntries], pageParams: [1] },
      }
    );

  //infinite-scroll logic
  useEffect(() => {
    if (isFetching) return;

    if (data?.pages[data?.pages.length - 1].length === 0) {
      setNoNewData(true);
    }

    setInvestmentEntries(
      data?.pages.flatMap((page) => page) ?? initialInvestmentEntries
    );
  }, [data, initialInvestmentEntries, isFetching]);

  useEffect(() => {
    if (initialInvestmentEntries.length < INFINITE_SCROLLING_PAGINATION_RESULTS)
      return;

    if (entry?.isIntersecting && !noNewData) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, initialInvestmentEntries, noNewData]);

  if (investmentEntries.length === 0) {
    return (
      <div className="flex justify-center h-[calc(80vh-150px)] lg:h-[calc(80vh-210px)]">
        <Balancer className="mt-2 text-sm text-center tracking-tight text-muted-foreground">
          Your transactions will appear here.
        </Balancer>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <div className="grid grid-cols-7 lg:grid-cols-8 px-4 sm:px-6 font-semibold">
        <span className="hidden lg:block">Date & Time</span>
        <span className="col-span-5 lg:col-span-3">Details</span>
        <span className="text-center col-span-2">Amount</span>
      </div>
      <ScrollShadow className="h-[calc(80vh-150px)] lg:h-[calc(80vh-235px)] w-full no-scrollbar pb-12">
        <div className="flex flex-col gap-y-8 lg:gap-y-2">
          {investmentEntries.map((entry, index) => {
            if (index === investmentEntries.length - 1) {
              return (
                <div key={entry.id} ref={ref}>
                  <InvestmentEntryItem
                    entry={entry}
                    currency={currency}
                    initialBalance={initialBalance}
                  />
                </div>
              );
            } else {
              return (
                <div key={entry.id}>
                  <InvestmentEntryItem
                    entry={entry}
                    currency={currency}
                    initialBalance={initialBalance}
                  />
                </div>
              );
            }
          })}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <InvestmentEntryItemSkeleton key={index} />
            ))}
        </div>
      </ScrollShadow>
    </div>
  );
};

const InvestmentEntryItem = ({
  entry,
  currency,
  initialBalance,
}: {
  entry: Investments;
  currency: CurrencyType;
  initialBalance: number;
}) => {
  const transferEntry = entry.transferingFrom || entry.transferingTo;
  const transferText = entry.transferingFrom
    ? entry.transferingFrom
    : entry.transferingTo;

  const entryDetails = {
    entryId: entry.id,
    amount: entry.amount,
    description: entry.entryName,
    entryType: entry.entryType,
    initialBalance,
    createdAt: entry.createdAt,
  };

  const getCustomizedDescription = (entry: Investments) => {
    if (entry.tradeBooks) {
      return entry.entryType === "in"
        ? `Profits earned from ${entry.entryName}`
        : `Loss incurred from ${entry.entryName}`;
    }
    return entry.entryType === "in"
      ? `Investment return from ${entry.entryName}`
      : `Invested in ${entry.entryName}`;
  };

  const customDescription = getCustomizedDescription(entry);

  return (
    <Card className="relative bg-background">
      <CardContent className="grid grid-cols-7 lg:grid-cols-8 px-4 sm:px-6 py-3">
        <div className="hidden lg:flex items-center">
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
            customDescription
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
        {transferEntry ? (
          <Link
            href={`/${transferText}`}
            className="hidden lg:block text-primary text-center text-xs underline underline-offset-4 col-span-2"
          >
            {transferText &&
              transferText?.charAt(0).toUpperCase() + transferText?.slice(1)}
          </Link>
        ) : (
          <div className="justify-center items-center text-xs col-span-2 hidden lg:grid grid-cols-4">
            {!entry.tradeBooks && entry.entryType === "out" ? (
              <InvestmentBookEntry
                currency={currency}
                entryDetails={entryDetails}
              />
            ) : (
              <span className="col-span-2" />
            )}
            <InvestmentEditEntry
              currency={currency}
              entryDetails={entryDetails}
              tradeBooking={entry.tradeBooks}
            />
            <InvestmentDeleteEntry
              entryDetails={entryDetails}
              tradeBooking={entry.tradeBooks}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 block lg:hidden">
        {transferEntry ? (
          <Link
            href={`/${transferText}`}
            className="block text-primary text-xs underline underline-offset-4"
          >
            {transferText &&
              transferText?.charAt(0).toUpperCase() + transferText?.slice(1)}
          </Link>
        ) : (
          <div className="text-xs flex gap-x-4">
            {!entry.tradeBooks && entry.entryType === "out" && (
              <InvestmentBookEntry
                currency={currency}
                entryDetails={entryDetails}
              />
            )}
            <InvestmentEditEntry
              currency={currency}
              entryDetails={entryDetails}
              tradeBooking={entry.tradeBooks}
            />
            <InvestmentDeleteEntry
              entryDetails={entryDetails}
              tradeBooking={entry.tradeBooks}
            />
          </div>
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
