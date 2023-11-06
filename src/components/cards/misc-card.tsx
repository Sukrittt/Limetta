"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import Balancer from "react-wrap-balancer";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

import { cn } from "@/lib/utils";
import { CurrencyType } from "@/types";
import { Miscellaneous } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { MiscEditEntry } from "@/components/misc/misc-edit";
import { MiscDeleteEntry } from "@/components/misc/misc-delete";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MiscEntryItemSkeleton } from "@/components/skeletons/infinite-cards";

const MiscCard = ({
  initialMiscEntries,
  currency,
}: {
  initialMiscEntries: Miscellaneous[];
  currency: CurrencyType;
}) => {
  const lastEntryRef = useRef<HTMLElement>(null);
  const [miscEntries, setMiscEntries] = useState(initialMiscEntries);

  const [noNewData, setNoNewData] = useState(false);

  const { ref, entry } = useIntersection({
    root: lastEntryRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(
      ["miscellaneous-entries"],
      async ({ pageParam = 1 }) => {
        const queryUrl = `/api/misc?page=${pageParam}`;

        const { data } = await axios(queryUrl);

        setNoNewData(false);

        return data as Miscellaneous[];
      },
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [initialMiscEntries], pageParams: [1] },
      }
    );

  //infinite-scroll logic
  useEffect(() => {
    if (isFetching) return;

    if (data?.pages[data?.pages.length - 1].length === 0) {
      setNoNewData(true);
    }

    setMiscEntries(data?.pages.flatMap((page) => page) ?? initialMiscEntries);
  }, [data, initialMiscEntries, isFetching]);

  useEffect(() => {
    if (initialMiscEntries.length < INFINITE_SCROLLING_PAGINATION_RESULTS)
      return;

    if (entry?.isIntersecting && !noNewData) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, noNewData, initialMiscEntries]);

  if (miscEntries.length === 0) {
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
      <div className="grid grid-cols-7 px-4 sm:px-6 font-semibold">
        <span className="hidden lg:block">Date & Time</span>
        <span className="col-span-5 lg:col-span-3">Details</span>
        <span className="text-center col-span-2">Amount</span>
      </div>
      <ScrollShadow className="h-[calc(80vh-150px)] lg:h-[calc(80vh-235px)] w-full no-scrollbar pb-12">
        <div className="flex flex-col gap-y-8 lg:gap-y-2">
          {miscEntries.map((entry, index) => {
            if (index === miscEntries.length - 1) {
              return (
                <div key={entry.id} ref={ref}>
                  <MiscEntryItem entry={entry} currency={currency} />
                </div>
              );
            } else {
              return (
                <div key={entry.id}>
                  <MiscEntryItem entry={entry} currency={currency} />
                </div>
              );
            }
          })}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <MiscEntryItemSkeleton key={index} />
            ))}
        </div>
      </ScrollShadow>
    </div>
  );
};

export default MiscCard;

const MiscEntryItem = ({
  entry,
  currency,
}: {
  entry: Miscellaneous;
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
    createdAt: entry.createdAt,
  };

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
        {transferEntry ? (
          <Link
            href={`/${transferText}`}
            className="hidden lg:block text-primary text-center text-xs underline underline-offset-4"
          >
            {transferText &&
              transferText?.charAt(0).toUpperCase() + transferText?.slice(1)}
          </Link>
        ) : entry.dueType ? (
          <Link
            href="/dues"
            className="hidden lg:block text-primary text-center text-xs underline underline-offset-4"
          >
            Dues
          </Link>
        ) : (
          <div className="hidden lg:flex justify-around items-center text-xs">
            <MiscEditEntry entryDetails={entryDetails} currency={currency} />
            <MiscDeleteEntry entryDetails={entryDetails} />
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs px-4 sm:px-6 pb-3 block lg:hidden">
        {transferEntry ? (
          <Link
            href={`/${transferText}`}
            className="text-primary text-center text-xs underline underline-offset-4"
          >
            {transferText &&
              transferText?.charAt(0).toUpperCase() + transferText?.slice(1)}
          </Link>
        ) : entry.dueType ? (
          <Link
            href="/dues"
            className="text-primary text-center text-xs underline underline-offset-4"
          >
            Dues
          </Link>
        ) : (
          <div className="flex gap-x-4 items-center text-xs">
            <MiscEditEntry entryDetails={entryDetails} currency={currency} />
            <MiscDeleteEntry entryDetails={entryDetails} />
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
