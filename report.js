const express = require("express");
const PDFDocument = require("pdfkit");
const router = express.Router();

router.post("/generate", (req, res) => {
  const { email, scenario_name = "scenario", results = {} } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${scenario_name}_report.pdf`);

  doc.fontSize(20).text("Invoicing ROI Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Scenario: ${scenario_name}`);
  doc.text(`Email: ${email}`);
  doc.moveDown();

  doc.fontSize(14).text("Results", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12);
  const display = {
    "Monthly savings": results.monthly_savings,
    "Cumulative savings": results.cumulative_savings,
    "Net savings": results.net_savings,
    "Payback (months)": results.payback_months,
    "ROI (%)": results.roi_percentage
  };
  for (const k of Object.keys(display)) {
    doc.text(`${k}: ${display[k]}`);
  }

  doc.end();
  doc.pipe(res);
});

module.exports = router;
