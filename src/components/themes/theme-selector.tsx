"use client";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Icons } from "@/components/icons";
import ToolTip from "@/components/ui/tool-tip";
import { useConfig } from "@/hooks/use-config";
import { FilterableTheme, Theme, ThemeNames, themes } from "@/themes";

export const ThemeSelector = () => {
  const [config, setConfig] = useConfig();

  const [mounted, setMounted] = useState(false);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const mapToFilterableTheme = (theme: Theme): FilterableTheme => {
    return {
      ...theme,
    };
  };

  let filteredThemes: FilterableTheme[] = themes
    .map(mapToFilterableTheme)
    .sort((a, b) => {
      return a.label.localeCompare(b.label);
    });

  const selectedTheme = filteredThemes.find(
    (theme) => theme.name === config.theme
  )!;

  const nonSelectedThemes = filteredThemes.filter(
    (theme) => theme.name !== selectedTheme.name
  );

  let preferredThemes: FilterableTheme[] = [
    selectedTheme,
    ...nonSelectedThemes,
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const surpriseMe = () => {
    const randomTheme =
      preferredThemes[Math.floor(Math.random() * preferredThemes.length)];
    setConfig({
      ...config,
      theme: randomTheme.name as ThemeNames,
    });

    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {mounted ? (
        <ToolTip
          customComponent={
            <span className="text-xs text-muted-foreground tracking-tighter font-mono">
              ctrl + k
            </span>
          }
          showArrow
          disableForMobile={false}
        >
          <div
            className="flex items-center text-xs text-muted-foreground gap-x-1 cursor-pointer hover:text-primary transition"
            onClick={() => setIsOpen(true)}
          >
            <Icons.theme className="h-3.5 w-3.5" />
            <span>{config.theme}</span>
          </div>
        </ToolTip>
      ) : (
        <div className="grid place-items-center">
          <span className="text-xs text-muted-foreground">
            Loading your themes...
          </span>
        </div>
      )}

      <CommandDialog position="top" open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search themes..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="relative">
          <span
            onClick={surpriseMe}
            className="absolute right-3 top-[10px] text-xs text-muted-foreground hover:text-content transition cursor-pointer"
          >
            Suprise me 🎉
          </span>
          <CommandEmpty className="py-6 text-center text-sm">
            No themes found.
          </CommandEmpty>
          <CommandGroup heading="Themes">
            {preferredThemes.map((theme) => (
              <CommandItem
                key={theme.label}
                className="flex items-center justify-between cursor-pointer"
                onSelect={() => {
                  setIsOpen(false);
                  setQuery("");
                  setConfig({
                    ...config,
                    theme: theme.name as ThemeNames,
                  });
                }}
                style={
                  {
                    "--theme-primary": `hsl(${theme?.activeColor["dark"]})`,
                    "--theme-background": `hsl(${theme?.cssVars["dark"]["background"]})`,
                    "--theme-primary-foreground": `hsl(${theme?.cssVars["dark"]["primary-foreground"]})`,
                    "--theme-muted-foreground": `hsl(${theme?.cssVars["dark"]["muted-foreground"]})`,
                  } as React.CSSProperties
                }
              >
                <span>
                  {theme.name === config.theme ? (
                    <span>
                      {theme.label}{" "}
                      <span className="text-muted-foreground text-xs tracking-tighter">
                        (selected)
                      </span>
                    </span>
                  ) : (
                    theme.label
                  )}
                </span>

                <div className="flex justify-center items-center py-1 px-2 h-5 bg-[--theme-background] gap-x-2 rounded-full">
                  <span className="rounded-full h-2 w-2 bg-[--theme-primary]" />
                  <span className="rounded-full h-2 w-2 bg-[--theme-primary-foreground]" />
                  <span className="rounded-full h-2 w-2 bg-[--theme-muted-foreground]" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
