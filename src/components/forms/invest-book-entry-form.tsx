import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Tabs, Tab } from "@nextui-org/tabs";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { useQueryClient } from "@tanstack/react-query";
import { ModalBody, ModalFooter } from "@nextui-org/modal";
import { Card as NextUICard, CardBody as NextUIBody } from "@nextui-org/card";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { EntryType, CurrencyType } from "@/types";
import { DatePicker } from "@/components/date-picker";
import { buttonVariants } from "@/components/ui/button";

export const InvestBookEntryForm = ({
  onClose,
  currency,
  entryDetails,
  setDisabled,
}: {
  onClose: () => void;
  currency: CurrencyType;
  entryDetails: EntryType;
  setDisabled: (disabled: boolean) => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<string | null>(null);
  const [description, setDescription] = useState(entryDetails.description);
  const [entryDate, setEntryDate] = useState<Date | undefined>(
    new Date(entryDetails.createdAt)
  );
  const [tradeStatus, setTradeStatus] = useState<"profit" | "loss">("profit");

  const [inputValidationState, setInputValidationState] = useState<
    "valid" | "invalid"
  >("valid");
  const [tabSelected, setTabSelected] = useState<"default" | "custom">(
    "default"
  );

  const [quantity, setQuantity] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [investedAmount, setInvestedAmount] = useState(
    entryDetails.amount.toLocaleString()
  );

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

    if (description.length === 0 || description.length > 100) {
      return toast({
        title: "Description is too long/short",
        description: "Please enter a valid description.",
        variant: "destructive",
      });
    }

    const parsedAmount = parseFloat(amount.replace(/,/g, ""));

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
      entryType: tradeStatus === "profit" ? "in" : "out",
      tradeBooking: true,
      investedAmount: parseFloat(investedAmount.replace(/,/g, "")),
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

    if (parseFloat(sharePrice) > 0 && parseFloat(quantity) > 0) {
      setAmount((parseFloat(sharePrice) * parseFloat(quantity)).toString());
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
              placeholder="Eg: Reliance Industries"
              disabled={addInvestmentEntry.isLoading}
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
            <Label>Invested Amount</Label>
            <Input
              placeholder="Eg: 2000"
              value={investedAmount ?? ""}
              disabled={addInvestmentEntry.isLoading}
              onChange={(e) => setInvestedAmount(e.target.value)}
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

          <div>
            <RadioGroup
              orientation="horizontal"
              value={tradeStatus}
              onValueChange={(value: string) =>
                setTradeStatus(value as "profit" | "loss")
              }
            >
              <Radio value="profit" description="Earned profits.">
                Profit
              </Radio>
              <Radio value="loss" description="Incurred loss.">
                Loss
              </Radio>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-y-2">
            <Tabs
              className="flex justify-center"
              aria-label="Options"
              selectedKey={tabSelected}
              onSelectionChange={(value) =>
                setTabSelected(value as "default" | "custom")
              }
            >
              <Tab key="defaut" title="Total Amount">
                <NextUICard>
                  <NextUIBody>
                    <div className="flex flex-col gap-y-2">
                      <Label>{`Total ${
                        tradeStatus.charAt(0).toUpperCase() +
                        tradeStatus.substring(1)
                      }`}</Label>
                      <Input
                        placeholder="Eg: 5000"
                        value={amount ?? ""}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={addInvestmentEntry.isLoading}
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
              <Tab key="custom" title="Share price and quantity">
                <NextUICard>
                  <NextUIBody className="flex flex-col gap-y-4">
                    <div className="flex flex-row gap-x-2">
                      <div className="flex flex-col gap-y-2">
                        <Label>Share price</Label>
                        <Input
                          autoFocus
                          placeholder="Eg: 500"
                          value={sharePrice ?? ""}
                          disabled={addInvestmentEntry.isLoading}
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
                    <span
                      className={cn("text-xs tracking-tight text-primary", {
                        "text-danger-text": tradeStatus === "loss",
                      })}
                    >
                      {`Total ${
                        tradeStatus.charAt(0).toUpperCase() +
                        tradeStatus.substring(1)
                      }`}
                      : {amount ? parseFloat(amount).toLocaleString() : 0}
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
