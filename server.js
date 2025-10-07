const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const simulateRoutes = require("./routes/simulate");
const scenarioRoutes = require("./routes/scenarios");
const reportRoutes = require("./routes/report");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/simulate", simulateRoutes);
app.use("/scenarios", scenarioRoutes);
app.use("/report", reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
