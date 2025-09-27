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
      body: [
        { children: [{ text: "Section 80C allows individuals and Hindu Undivided Families (HUFs) to claim deductions on specific investments and expenses." }] },
        { children: [{ text: "### Eligible Investments & Expenses" }] },
        { children: [{ text: "- Life Insurance Premiums\n- Employee Provident Fund (EPF)\n- Public Provident Fund (PPF)\n- National Savings Certificate (NSC)\n- Equity-Linked Savings Scheme (ELSS)\n- Tuition fees for children\n- Principal repayment of home loan" }] },
        { children: [{ text: "### Maximum Limit" }] },
        { children: [{ text: "The total deduction under Section 80C is capped at ₹1,50,000 per financial year." }] },
        { children: [{ text: "### Steps to Claim Deduction" }] },
        { children: [{ text: "1. Invest in eligible schemes.\n2. Collect proof of investment/expenses.\n3. Declare during Income Tax filing.\n4. Attach proofs if required." }] },
        { children: [{ text: "### Common Mistakes to Avoid" }] },
        { children: [{ text: "- Missing the annual deadline.\n- Submitting incorrect or incomplete documents.\n- Exceeding the maximum limit." }] },
        { children: [{ text: "### Example" }] },
        { children: [{ text: "If you invest ₹1,00,000 in PPF and ₹50,000 in ELSS, you can claim the full ₹1,50,000 deduction under Section 80C." }] },
        { children: [{ text: "### References & Resources" }] },
        { children: [{ text: "1. Official Income Tax Portal: www.incometaxindia.gov.in\n2. Tax Guide PDF [Download](https://www.incometaxindia.gov.in/80C_guide.pdf)" }] },
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
      body: [
        { children: [{ text: "Filing Income Tax Returns (ITR) is mandatory for all individuals whose income exceeds the exemption limit." }] },
        { children: [{ text: "### Step-by-Step Filing Process" }] },
        { children: [{ text: "1. **Collect Documents**: Form 16, Form 26AS, bank statements, and investment proofs.\n2. **Choose Correct ITR Form** based on income source.\n3. **Login on Income Tax Portal**: www.incometax.gov.in.\n4. **Fill Form**: Enter income, deductions, and taxes paid.\n5. **Verify & Submit**: Use Aadhaar OTP, net banking, or e-verify methods." }] },
        { children: [{ text: "### Common Errors" }] },
        { children: [{ text: "- Incorrect PAN details\n- Mismatch in TDS or Form 26AS\n- Missing deductions\n- Incorrect bank account details for refund" }] },
        { children: [{ text: "### Tips for First-Time Filers" }] },
        { children: [{ text: "- Keep all documents ready.\n- Use the pre-filled ITR option.\n- Double-check bank account and PAN info.\n- File early to avoid last-minute stress." }] },
        { children: [{ text: "### Example" }] },
        { children: [{ text: "An individual earning ₹7,50,000 annually with eligible 80C deductions of ₹1,50,000 will pay tax on ₹6,00,000 taxable income." }] },
      ],
      attachments: [],
      youtubeUrl: "",
    },

    {
      title: "Tax Planning Tips",
      slug: "tax-planning-tips",
      contentType: "text",
      body: [
        { children: [{ text: "Effective tax planning can help you reduce your tax liability legally and maximize savings." }] },
        { children: [{ text: "### Strategies" }] },
        { children: [{ text: "- Invest in tax-saving instruments (PPF, ELSS, NPS)\n- Use deductions under Sections 80C, 80D, 80E\n- Claim home loan interest under Section 24(b)\n- Utilize HRA and standard deductions" }] },
        { children: [{ text: "### Common Mistakes" }] },
        { children: [{ text: "- Last-minute investments\n- Ignoring exemptions\n- Not keeping proper proof\n- Overlooking advance tax payments" }] },
        { children: [{ text: "### Example" }] },
        { children: [{ text: "By planning investments early, a taxpayer can save ₹30,000–₹50,000 in taxes annually." }] },
      ],
      attachments: [],
      youtubeUrl: "https://www.youtube.com/watch?v=Vb6v2FfdJZQ",
    },

    {
      title: "Common Mistakes in Income Tax",
      slug: "common-mistakes-income-tax",
      contentType: "text",
      body: [
        { children: [{ text: "Many taxpayers make avoidable mistakes during filing, leading to penalties or delayed refunds." }] },
        { children: [{ text: "### Mistakes to Avoid" }] },
        { children: [{ text: "- Missing filing deadlines\n- Incorrect bank or PAN details\n- Not claiming eligible deductions\n- Reporting income incorrectly\n- Ignoring TDS details" }] },
        { children: [{ text: "### How to Correct" }] },
        { children: [{ text: "Use the 'Rectification' option on the Income Tax Portal for corrections after submission. Always verify before submitting." }] },
      ],
      attachments: [],
      youtubeUrl: "",
    }
  ],
};
