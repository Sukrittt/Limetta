import { db } from "@/db";
import { miscellaneous } from "@/db/schema";

export async function GET() {
  try {
    await db.insert(miscellaneous).values({
      userId: "4130d5c5-eb0b-4bbb-abbc-3c509b6e3138",
      amount: 69,
      entryName: "Cron job test successfull",
      entryType: "in",
    });

    return new Response("OK");
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
