const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/", (req, res) => {
  const { scenario_name = "untitled", inputs = {}, results = {} } = req.body;
  const inputsStr = JSON.stringify(inputs);
  const resultsStr = JSON.stringify(results);
  db.run(
    "INSERT INTO scenarios (scenario_name, inputs, results) VALUES (?, ?, ?)",
    [scenario_name, inputsStr, resultsStr],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ id: this.lastID, message: "Saved" });
    }
  );
});

router.get("/", (req, res) => {
  db.all("SELECT id, scenario_name, created_at FROM scenarios ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
});

router.get("/:id", (req, res) => {
  db.get("SELECT * FROM scenarios WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Not found" });
    // parse JSON fields
    try {
      row.inputs = JSON.parse(row.inputs);
      row.results = JSON.parse(row.results);
    } catch (e) {}
    return res.json(row);
  });
});

module.exports = router;
