const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Ignore JSON parsing errors from Chrome extensions
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return next();
  }
  next(err);
});

app.get("/api/message-stats", async (req, res) => {
  try {
    const username = "nathan";
    const password = "choKlmZHpGaqc";
    const credentials = Buffer.from(`${username}:${password}`).toString("base64");

    const response = await fetch("https://admin.getbesty.ai/bt_message_stats_csv", {
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "text/csv",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    res.send(csvText);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
