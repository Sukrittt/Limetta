import { z } from "zod";
import excel from "exceljs";

import { validation } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Expense Entries");

    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Details", key: "details", width: 50 },
      { header: "Needs", key: "needs", width: 15 },
      { header: "Wants", key: "wants", width: 15 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const body = await req.json();
    const { data, calculations } = validation.parse(body);

    data.forEach((expense) => {
      worksheet.addRow({
        date: expense.date,
        details: expense.details,
        needs: expense.needs,
        wants: expense.wants,
      });
    });

    const totalSpent = calculations.needsTotal + calculations.wantsTotal;

    worksheet.addRow([]);
    worksheet.addRow(["", "", "Month Income", calculations.monthIncome]);
    worksheet.addRow(["", "", "Needs Total", calculations.needsTotal]);
    worksheet.addRow(["", "", "Wants Total", calculations.wantsTotal]);
    worksheet.addRow(["", "", "Total Spent", totalSpent]);
    worksheet.addRow(["", "", "Total Saved", calculations.totalSaved]);

    const headers = {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=expense_entries.xlsx",
    };

    const blob = await workbook.xlsx.writeBuffer();
    const response = new Response(blob, { headers });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
