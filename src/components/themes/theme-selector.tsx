"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

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
  const { resolvedTheme: mode } = useTheme();

  const [mounted, setMounted] = useState(false);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const mapToFilterableTheme = (theme: Theme): FilterableTheme => {
    return {
      ...theme,
    };
  };

  let initialThemes: FilterableTheme[] = themes.map(mapToFilterableTheme);

  const [filteredThemes, setFilteredThemes] = useState(initialThemes);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const filtered = themes.filter((theme) =>
      theme.label.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredThemes(filtered);
  }, [query]);

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
        <CommandList>
          <CommandEmpty className="py-6 text-center text-sm">
            No themes found.
          </CommandEmpty>
          <CommandGroup heading="Themes">
            {filteredThemes.map((theme) => (
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
                    "--theme-primary": `hsl(${
                      theme?.activeColor[mode === "dark" ? "dark" : "light"]
                    })`,
                    "--theme-background": `hsl(${
                      theme?.cssVars[mode === "dark" ? "dark" : "light"][
                        "background"
                      ]
                    })`,
                    "--theme-primary-foreground": `hsl(${
                      theme?.cssVars[mode === "dark" ? "dark" : "light"][
                        "primary-foreground"
                      ]
                    })`,
                    "--theme-muted-foreground": `hsl(${
                      theme?.cssVars[mode === "dark" ? "dark" : "light"][
                        "muted-foreground"
                      ]
                    })`,
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
