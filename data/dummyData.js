// data/dummyData.js
export const categories = [
  { title: "Income Tax", slug: "income-tax", image: "/images/income-tax.jpg" },
  { title: "GST", slug: "gst", image: "/images/gst.jpg" },
  { title: "Audit", slug: "audit", image: "/images/audit.jpg" },
  { title: "Accounting", slug: "accounting", image: "/images/accounting.jpg" },
  { title: "Investment", slug: "investment", image: "/images/investment.jpg" },
  { title: "Exam Oriented", slug: "exam-oriented", image: "/images/exam.jpg" },
];

export const contents = {
  "income-tax": [
    {
      title: "Section 80C – Deductions",
      slug: "section-80c-deductions",
      contentType: "text",
      uploadedOn: "2025-09-01",
      author: "John Doe",
      fileType: "PDF/Excel",
      body: [
        { children: [{ text: "Section 80C allows individuals and Hindu Undivided Families (HUFs) to claim deductions on specific investments and expenses." }] },
        { children: [{ text: "### Eligible Investments & Expenses" }] },
        { children: [{ text: "- Life Insurance Premiums\n- Employee Provident Fund (EPF)\n- Public Provident Fund (PPF)\n- National Savings Certificate (NSC)\n- Equity-Linked Savings Scheme (ELSS)\n- Tuition fees for children\n- Principal repayment of home loan" }] },
        { children: [{ text: "### Maximum Limit" }] },
        { children: [{ text: "The total deduction under Section 80C is capped at ₹1,50,000 per financial year." }] },
      ],
      attachments: [
        { asset: { url: "/files/80C_template.xlsx", originalFilename: "80C_template.xlsx" } }
      ],
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },

    {
      title: "Income Tax Filing Guide",
      slug: "income-tax-filing-guide",
      contentType: "text",
      uploadedOn: "2025-08-28",
      author: "Jane Smith",
      fileType: "PDF",
      body: [
        { children: [{ text: "Filing Income Tax Returns (ITR) is mandatory for all individuals whose income exceeds the exemption limit." }] },
        { children: [{ text: "### Step-by-Step Filing Process" }] },
        { children: [{ text: "1. Collect Documents: Form 16, Form 26AS, bank statements, and investment proofs.\n2. Choose Correct ITR Form.\n3. Login on Income Tax Portal.\n4. Fill Form.\n5. Verify & Submit." }] },
      ],
      attachments: [],
      youtubeUrl: "",
    },

    {
      title: "Tax Planning Tips",
      slug: "tax-planning-tips",
      contentType: "text",
      uploadedOn: "2025-09-10",
      author: "Alice Johnson",
      fileType: "PDF",
      body: [
        { children: [{ text: "Effective tax planning can help you reduce your tax liability legally and maximize savings." }] },
        { children: [{ text: "### Strategies" }] },
        { children: [{ text: "- Invest in tax-saving instruments (PPF, ELSS, NPS)\n- Use deductions under Sections 80C, 80D, 80E\n- Claim home loan interest under Section 24(b)\n- Utilize HRA and standard deductions" }] },
      ],
      attachments: [],
      youtubeUrl: "https://www.youtube.com/watch?v=Vb6v2FfdJZQ",
    },

    {
      title: "Common Mistakes in Income Tax",
      slug: "common-mistakes-income-tax",
      contentType: "text",
      uploadedOn: "2025-09-12",
      author: "Robert Brown",
      fileType: "PDF",
      body: [
        { children: [{ text: "Many taxpayers make avoidable mistakes during filing, leading to penalties or delayed refunds." }] },
        { children: [{ text: "### Mistakes to Avoid" }] },
        { children: [{ text: "- Missing filing deadlines\n- Incorrect bank or PAN details\n- Not claiming eligible deductions\n- Reporting income incorrectly\n- Ignoring TDS details" }] },
      ],
      attachments: [],
      youtubeUrl: "",
    }
  ],
};
