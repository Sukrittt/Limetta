import { useCallback, useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Selection } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Select, SelectItem } from "@nextui-org/select";
import { ModalBody, ModalFooter } from "@nextui-org/modal";
import { Card as NextUICard, CardBody as NextUIBody } from "@nextui-org/card";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { CurrencyType, InvestmentType, investments } from "@/config";

export const InvestBookEntryForm = ({
  onClose,
  currency,
  initialBalance,
}: {
  onClose: () => void;
  currency: CurrencyType;
  initialBalance: number;
}) => {
  const router = useRouter();
  const [amount, setAmount] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [tradeStatus, setTradeStatus] = useState<"profit" | "loss">("profit");
  const [selectedInvestmentType, setSelectedInvestmentType] =
    useState<Selection>(new Set(["Stocks"]));
  const [activeInvestment, setActiveInvestment] = useState<InvestmentType | "">(
    ""
  );
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
      toast({
        title: "Entry added",
        description: "Your entry has been added successfully.",
      });
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

    if (!activeInvestment) {
      return toast({
        title: "Type of investment is required",
        description: "Please select a valid type of investment.",
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

    addInvestmentEntry.mutate({
      amount: parsedAmount,
      description,
      entryType: tradeStatus === "profit" ? "in" : "out",
      initialBalance,
      investmentType: activeInvestment,
      tradeBooking: true,
    });
  };

  const updateInputValidationState = useCallback(() => {
    if (!amount) return;

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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>

          <Select
            label="Investment Type"
            placeholder="Select an investment type"
            labelPlacement="outside"
            selectedKeys={selectedInvestmentType}
            onSelectionChange={setSelectedInvestmentType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setActiveInvestment(e.target.value as InvestmentType);
            }}
          >
            {investments.map((investment) => (
              <SelectItem key={investment.value} value={investment.value}>
                {investment.label}
              </SelectItem>
            ))}
          </Select>

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
              <Tab key="defaut" title="Investment Amount">
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
                          placeholder="Eg: 2000"
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
                        "text-red-500": tradeStatus === "loss",
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