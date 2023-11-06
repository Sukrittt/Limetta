import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { Theme } from "@/themes";

type Config = {
  theme: Theme["name"];
  radius: number;
};

const configAtom = atomWithStorage<Config>("config", {
  theme: "green",
  radius: 0.5,
});

export function useConfig() {
  return useAtom(configAtom);
}
