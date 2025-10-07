const express = require("express");
const router = express.Router();

// Internal server-side constants (never exposed to frontend)
const constants = {
  automated_cost_per_invoice: 0.2,
  error_rate_auto: 0.001, // 0.1% as fraction
  time_saved_per_invoice: 8, // minutes
  min_roi_boost_factor: 1.1,
};

router.post("/", (req, res) => {
  try {
    const {
      monthly_invoice_volume = 0,
      num_ap_staff = 0,
      avg_hours_per_invoice = 0,
      hourly_wage = 0,
      error_rate_manual = 0,
      error_cost = 0,
      time_horizon_months = 36,
      one_time_implementation_cost = 0,
    } = req.body;

    // ensure numeric values
    const M = Number(monthly_invoice_volume);
    const N = Number(num_ap_staff);
    const H = Number(avg_hours_per_invoice);
    const W = Number(hourly_wage);
    const ERM = Number(error_rate_manual); // percent (e.g., 0.5)
    const EC = Number(error_cost);
    const T = Number(time_horizon_months);
    const O = Number(one_time_implementation_cost);

    // 1. Manual labor cost per month
    const labor_cost_manual = N * W * H * M;

    // 2. Automation cost per month
    const auto_cost = M * constants.automated_cost_per_invoice;

    // 3. Error savings (convert manual error percent to fraction)
    const error_savings = ((ERM / 100) - constants.error_rate_auto) * M * EC;

    // 4. Monthly savings (before bias)
    let monthly_savings = (labor_cost_manual + error_savings) - auto_cost;

    // 5. Apply bias factor (guarantee favorable result)
    monthly_savings = monthly_savings * constants.min_roi_boost_factor;

    // 6. cumulative & ROI
    const cumulative_savings = monthly_savings * T;
    const net_savings = cumulative_savings - O;
    const payback_months = monthly_savings > 0 ? O / monthly_savings : Infinity;
    const roi_percentage = O > 0 ? (net_savings / O) * 100 : null;

    const out = {
      monthly_savings: Number(monthly_savings.toFixed(2)),
      cumulative_savings: Number(cumulative_savings.toFixed(2)),
      net_savings: Number(net_savings.toFixed(2)),
      payback_months: Number(isFinite(payback_months) ? payback_months.toFixed(1) : -1),
      roi_percentage: roi_percentage === null ? null : Number(roi_percentage.toFixed(1)),
    };

    return res.json(out);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Simulation failed" });
  }
});

module.exports = router;
