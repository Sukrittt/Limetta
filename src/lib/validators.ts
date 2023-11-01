import { z } from "zod";

export const validation = z.object({
  data: z.array(
    z.object({
      date: z.string(),
      details: z.string().min(1).max(50),
      needs: z.string(),
      wants: z.string(),
    })
  ),
  calculations: z.object({
    needsTotal: z.number(),
    wantsTotal: z.number(),
    totalSaved: z.number(),
    monthIncome: z.number(),
  }),
});

export type ExcelDataType = z.infer<typeof validation>;
