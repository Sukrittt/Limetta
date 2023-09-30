"use client";
import Link from "next/link";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Investments } from "@/db/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { InvestmentBookEntry } from "@/components/investments/invest-book-entry";
import { InvestmentEditEntry } from "@/components/investments/invest-edit-entry";
import { InvestmentDeleteEntry } from "@/components/investments/investment-delete-entry";

export const InvestmentCard = ({
  initialBalance,
  initialInvestmentEntries,
  currency,
  initialTotalInvested,
}: {
  initialInvestmentEntries: Investments[];
  currency: CurrencyType;
  initialBalance: number;
  initialTotalInvested: number;
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
        // const queryUrl = `/api/investment?page=${pageParam}`;
        const queryUrl = `/api/investmentasdsd?page=${pageParam}`;

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
    if (entry?.isIntersecting && !noNewData) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, noNewData]);

  if (investmentEntries.length === 0) {
    return (
      <p className="mt-2 text-sm text-center tracking-tight text-muted-foreground">
        Your transactions will appear here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 text-sm">
      <div className="grid grid-cols-7 lg:grid-cols-8 px-4 sm:px-6">
        <span className="hidden lg:block">Date & Time</span>
        <span className="col-span-5 lg:col-span-3">Details</span>
        <span className="text-center col-span-2">Amount</span>
      </div>
      {investmentEntries.map((entry, index) => {
        if (index === investmentEntries.length - 1) {
          return (
            <div key={entry.id} ref={ref}>
              <InvestmentEntryItem
                entry={entry}
                currency={currency}
                initialBalance={initialBalance}
                initialTotalInvested={initialTotalInvested}
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
                initialTotalInvested={initialTotalInvested}
              />
            </div>
          );
        }
      })}
      {isFetchingNextPage && <p>Loading...</p>}
    </div>
  );
};

const InvestmentEntryItem = ({
  entry,
  initialBalance,
  initialTotalInvested,
  currency,
}: {
  entry: Investments;
  initialBalance: number;
  initialTotalInvested: number;
  currency: CurrencyType;
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
    <Card>
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
          className={cn("text-center col-span-2 lg:col-span-2", {
            "text-green-600": entry.entryType === "in",
            "text-red-500": entry.entryType === "out",
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
                initialBalance={initialBalance}
                entryDetails={entryDetails}
              />
            ) : (
              <span className="col-span-2" />
            )}
            <InvestmentEditEntry
              currency={currency}
              entryDetails={entryDetails}
              tradeBooking={entry.tradeBooks}
              initialTotalInvested={initialTotalInvested}
            />
            <InvestmentDeleteEntry
              entryDetails={entryDetails}
              tradeBooking={entry.tradeBooks}
              initialTotalInvested={initialTotalInvested}
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
                initialBalance={initialBalance}
                entryDetails={entryDetails}
              />
            )}
            <InvestmentEditEntry
              currency={currency}
              entryDetails={entryDetails}
              tradeBooking={entry.tradeBooks}
              initialTotalInvested={initialTotalInvested}
            />
            <InvestmentDeleteEntry
              entryDetails={entryDetails}
              tradeBooking={entry.tradeBooks}
              initialTotalInvested={initialTotalInvested}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
