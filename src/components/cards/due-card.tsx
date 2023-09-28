import { Dues } from "@/db/schema";

export const DueCard = ({ dues }: { dues: Dues[] }) => {
  return (
    <div className="flex flex-col gap-y-2">
      {dues.map((due) => (
        <p key={due.id}>
          {due.entryName} {due.amount}
        </p>
      ))}
    </div>
  );
};
