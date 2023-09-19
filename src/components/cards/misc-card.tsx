import { Miscellaneous } from "@/db/schema";

const MiscCard = ({ miscEntries }: { miscEntries: Miscellaneous[] }) => {
  if (miscEntries.length === 0) {
    return (
      <p className="mt-2 text-sm text-center tracking-tight text-muted-foreground">
        Your transactions will appear here.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {miscEntries.map((entry) => (
        <div key={entry.id}>
          {entry.entryName}
          {entry.amount}
        </div>
      ))}
    </div>
  );
};

export default MiscCard;
