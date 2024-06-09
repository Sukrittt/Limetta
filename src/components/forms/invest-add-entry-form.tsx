import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Tabs, Tab } from "@nextui-org/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { ModalBody, ModalFooter } from "@nextui-org/modal";
import { Card as NextUICard, CardBody as NextUIBody } from "@nextui-org/card";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { CurrencyType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { buttonVariants } from "@/components/ui/button";

export const InvestAddEntryForm = ({
  onClose,
  currency,
  initialBalance,
  setDisabled,
}: {
  onClose: () => void;
  currency: CurrencyType;
  initialBalance: number;
  setDisabled: (disabled: boolean) => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [entryDate, setEntryDate] = useState<Date | undefined>(new Date());

  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");
  const [tabSelected, setTabSelected] = useState<"default" | "custom">(
    "default"
  );

  const [quantity, setQuantity] = useState("");
  const [sharePrice, setSharePrice] = useState("");

  const addInvestmentEntry = trpc.investments.addInvestmentEntry.useMutation({
    onSuccess: () => {
      router.refresh();
      queryClient.resetQueries(["investment-entries"]);

      toast({
        title: "Entry added",
        description: "Your entry has been added successfully.",
      });
      setDisabled(false);
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!amount) {
      return toast({
        title: "Amount is required",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
    }

    if (!entryDate) {
      return toast({
        title: "Entry date is required",
        description: "Please select a valid entry date.",
        variant: "destructive",
      });
    }

    const parsedAmount = parseFloat(amount.replace(/,/g, ""));

    if (parsedAmount > initialBalance) {
      return toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to make this investment.",
        variant: "destructive",
      });
    }

    if (description.length === 0 || description.length > 100) {
      return toast({
        title: "Description is too long/short",
        description: "Please enter a valid description.",
        variant: "destructive",
      });
    }

    if (!parsedAmount) {
      return toast({
        title: "Amount is invalid",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
    }

    setDisabled(true);

    addInvestmentEntry.mutate({
      amount: parsedAmount,
      description,
      entryType: "out",
      entryDate,
    });
  };

  const updateInputValidationState = useCallback(() => {
    if (!amount) return setInputValidationState("valid");

    if (parseFloat(amount) > 0) {
      setInputValidationState("valid");
    } else {
      setInputValidationState("invalid");
    }
  }, [amount]);

  useEffect(() => {
    if (!sharePrice || !quantity) {
      return setAmount("");
    }

    const parsedQuantity = parseFloat(quantity.replace(/,/g, ""));
    const parsedSharePrice = parseFloat(sharePrice.replace(/,/g, ""));

    if (parsedSharePrice > 0 && parsedQuantity > 0) {
      setAmount((parsedSharePrice * parsedQuantity).toLocaleString());
    }
  }, [sharePrice, quantity]);

  useEffect(() => {
    updateInputValidationState();
  }, [amount, updateInputValidationState]);

  return (
    <>
      <ModalBody>
        <form className="grid w-full max-w-xl gap-5">
          <div className="flex flex-col gap-y-2">
            <Label>Investment Name</Label>
            <Input
              autoFocus
              disabled={addInvestmentEntry.isLoading}
              placeholder="Eg: Reliance Industries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>
              Date{" "}
              <span className="text-sm text-muted-foreground tracking-tighter">
                (optional)
              </span>
            </Label>
            <DatePicker
              value={entryDate}
              setValue={setEntryDate}
              disabled={[{ after: new Date() }]}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Tabs
              aria-label="Options"
              disabledKeys={["or"]}
              selectedKey={tabSelected}
              onSelectionChange={(value) =>
                setTabSelected(value as "default" | "custom")
              }
            >
              <Tab key="defaut" title="Investment Amount">
                <NextUICard>
                  <NextUIBody>
                    <div className="flex flex-col gap-y-2">
                      <Label>Total Invested</Label>
                      <Input
                        placeholder="Eg: 5000"
                        disabled={addInvestmentEntry.isLoading}
                        value={amount ?? ""}
                        onChange={(e) => setAmount(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmit();
                          }
                        }}
                        validationState={inputValidationState}
                        errorMessage={
                          inputValidationState === "invalid" &&
                          "Please entery a valid amount."
                        }
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              {currency}
                            </span>
                          </div>
                        }
                      />
                    </div>
                  </NextUIBody>
                </NextUICard>
              </Tab>
              <Tab key="or" title="OR" className="p-0 hidden sm:block" />
              <Tab
                key="custom"
                title="Share price and quantity"
                className="px-1.5"
              >
                <NextUICard>
                  <NextUIBody className="flex flex-col gap-y-4">
                    <div className="flex flex-row gap-x-2">
                      <div className="flex flex-col gap-y-2">
                        <Label>Share price</Label>
                        <Input
                          autoFocus
                          placeholder="Eg: 500"
                          disabled={addInvestmentEntry.isLoading}
                          value={sharePrice ?? ""}
                          onChange={(e) => setSharePrice(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                {currency}
                              </span>
                            </div>
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <Label>Quantity</Label>
                        <Input
                          placeholder="Eg: 10"
                          value={quantity ?? ""}
                          disabled={addInvestmentEntry.isLoading}
                          onChange={(e) => setQuantity(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-primary tracking-tight">
                      Total invested:{" "}
                      {amount
                        ? parseFloat(amount.replace(/,/g, "")).toLocaleString()
                        : 0}
                    </span>
                  </NextUIBody>
                </NextUICard>
              </Tab>
            </Tabs>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          disabled={addInvestmentEntry.isLoading}
          className={cn(
            buttonVariants({ size: "sm", variant: "ghost" }),
            "rounded-lg"
          )}
          variant="light"
          onPress={onClose}
        >
          Close
        </Button>
        <Button
          color="primary"
          className={cn(buttonVariants({ size: "sm" }), "rounded-lg")}
          onClick={handleSubmit}
          disabled={addInvestmentEntry.isLoading}
        >
          {addInvestmentEntry.isLoading ? (
            <Spinner color="default" size="sm" />
          ) : (
            "Add"
          )}
        </Button>
      </ModalFooter>
    </>
  );
};
