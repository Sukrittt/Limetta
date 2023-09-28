import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export const DueDropdown = () => {
  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button variant="ghost" className="h-8 w-8 p-1 rounded-full">
          <Icons.dropdown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="edit"
          description="Edit the details of this entry"
          startContent={
            <Icons.edit className="h-4 w-4 text-muted-foreground" />
          }
        >
          Edit
        </DropdownItem>
        <DropdownItem
          key="paid"
          description="Mark this due as paid"
          startContent={
            <Icons.paid className="h-4 w-4 text-muted-foreground" />
          }
        >
          Paid
        </DropdownItem>
        <DropdownItem
          key="delete"
          description="Permanently delete this entry"
          className="text-danger"
          color="danger"
          startContent={
            <Icons.delete className="h-4 w-4 text-muted-foreground" />
          }
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
