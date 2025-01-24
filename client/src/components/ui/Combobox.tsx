import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const regions = [
  {
    "value": "us-east-1",
    "label": "US East (N. Virginia)"
  },
  {
    "value": "us-west-2",
    "label": "US West (Oregon)"
  },
  {
    "value": "us-central-1",
    "label": "US Central (Iowa)"
  },
  {
    "value": "ca-central-1",
    "label": "Canada (Central)"
  },
  {
    "value": "eu-west-1",
    "label": "Europe (Ireland)"
  },
  {
    "value": "eu-central-1",
    "label": "Europe (Frankfurt)"
  },
  {
    "value": "eu-west-3",
    "label": "Europe (Paris)"
  },
  {
    "value": "ap-southeast-1",
    "label": "Asia Pacific (Singapore)"
  },
  {
    "value": "ap-northeast-1",
    "label": "Asia Pacific (Tokyo)"
  },
  {
    "value": "ap-south-1",
    "label": "Asia Pacific (Mumbai)"
  },
  {
    "value": "sa-east-1",
    "label": "South America (São Paulo)"
  },
  {
    "value": "af-south-1",
    "label": "Africa (Cape Town)"
  }
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {value
            ? regions.find((region) => region.value === value)?.label
            : "Select region..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search region..." />
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            <CommandGroup>
              {regions.map((region) => (
                <CommandItem
                  key={region.value}
                  value={region.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === region.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {region.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
