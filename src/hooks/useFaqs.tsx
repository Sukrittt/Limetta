import Link from "next/link";

export const useFaqs = () => {
  const linkStyle = "text-primary underline underline-offset-4";

  const faqs = [
    {
      question: "Q: How do I get started with the expense tracker?",
      answer: (
        <p>
          Getting started is easy! Simply navigate to the{" "}
          <Link href="/expense-tracker" className={linkStyle}>
            Expense Tracker
          </Link>{" "}
          page and start adding your expenses. All your entries will recorded in
          the current month&rsquo;s expenses automatically.
        </p>
      ),
    },
    {
      question: "Q: When and where can I see my savings of the current month?",
      answer: (
        <p>
          On the 1st or 2nd day of the next month, your current month&rsquo;s
          savings will be automatically transferred to your{" "}
          <Link href="/savings" className={linkStyle}>
            savings account
          </Link>
          .
        </p>
      ),
    },
    {
      question: "Q: What's the purpose of the Miscellaneous account?",
      answer: (
        <p>
          The Miscellaneous account is for tracking any additional income or
          expenses that don&rsquo;t fit into your regular categories. It&rsquo;s
          a flexible way to manage various financial transactions.
        </p>
      ),
    },
    {
      question: "Q: How can I see a summary of my monthly expenses?",
      answer: (
        <p>
          You can view a summary of your monthly expenses by visiting the{" "}
          <Link href="/overview" className={linkStyle}>
            Overview
          </Link>{" "}
          page. Here, you can access a 12-month overview of your expenses,
          including a graph displaying your total expenses for each month. You
          can also review and analyze specific entries from previous months.
        </p>
      ),
    },
    {
      question: "Q: How do I track my investments and profits?",
      answer: (
        <p>
          Use the{" "}
          <Link href="/investments" className={linkStyle}>
            Investments
          </Link>{" "}
          page to monitor your investments, record transactions, and book
          profits or losses.
        </p>
      ),
    },
    {
      question: "Q: Can I download my monthly expenses in an Excel sheet?",
      answer: (
        <p>
          Yes, on the{" "}
          <Link href="/expense-tracker" className={linkStyle}>
            Expense Tracker
          </Link>{" "}
          page, you can download all your entries in an Excel sheet, categorized
          as &rsquo;needs&rsquo; and &rsquo;wants&rsquo; with additional
          calculations for your convenience.
        </p>
      ),
    },
    {
      question:
        "Q: I forgot to export the Excel sheet for the previous month. Can I still get those entries?",
      answer: (
        <p>
          Absolutely! You can access all your monthly entries on the{" "}
          <Link href="/overview" className={linkStyle}>
            Overview
          </Link>{" "}
          page. Just click on any month&rsquo;s book to view and export the
          entries in an Excel sheet.
        </p>
      ),
    },
    {
      question:
        "Q: Can I choose which account my dues are added to or deducted from?",
      answer: (
        <p>
          Yes, you have complete control. You can choose to add or deduct the
          amount from any of your accounts, whether it&rsquo;s your
          miscellaneous account, savings account, or even your monthly expenses
          if the due is payable for the current month.
        </p>
      ),
    },
    {
      question: "Q: Can I transfer money between my accounts?",
      answer: (
        <p>
          Absolutely! You have the flexibility to transfer money between your
          accounts, whether it&rsquo;s moving funds from your miscellaneous
          account to your savings, making an investment from your savings
          account, or any other combination. You can easily perform these
          transactions from the main{" "}
          <Link href="/dashboard" className={linkStyle}>
            dashboard
          </Link>{" "}
          or within specific account pages.
        </p>
      ),
    },
    {
      question:
        "Q: Can I use this application as a Mobile/Desktop Application?",
      answer: (
        <p>
          Yes, you can! For mobile devices, simply click &rsquo;Install
          App&rsquo; to add it to your home screen. If you&rsquo;re on desktop,
          you can install the application by clicking the install icon in the
          top right corner of your browser. Enjoy a seamless experience on both
          mobile and desktop platforms.
        </p>
      ),
    },
    {
      question: "Q: What if I have more questions or need assistance?",
      answer: (
        <p>
          If you have any other questions or need assistance, feel free to
          contact our support team through the{" "}
          <Link href="/contact" className={linkStyle}>
            contact
          </Link>{" "}
          page. We&rsquo;re here to help you!
        </p>
      ),
    },
  ];

  return faqs;
};
