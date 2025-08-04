import express from "express";
import fetch from "node-fetch";

const app = express();

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

app.get("/", async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    const startTime = lastMonth.toISOString();
    const endTime = today.toISOString();

    const query = encodeURIComponent("gmira");

    const url = `https://api.twitter.com/2/tweets/search/all?query=${query}&start_time=${startTime}&end_time=${endTime}&max_results=100`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const data = await response.json();
    const count = data.meta?.result_count || 0;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>gmira Counter</title>
        <meta http-equiv="refresh" content="60">
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background: #0d1117;
            color: #f0f6fc;
            margin: 0;
            padding: 0;
          }
          h1 {
            margin-top: 50px;
            font-size: 2.5em;
            color: #58a6ff;
          }
          p {
            font-size: 1.5em;
          }
          .count {
            font-size: 3em;
            font-weight: bold;
            color: #ffd33d;
          }
          footer {
            margin-top: 40px;
            font-size: 0.9em;
            color: #8b949e;
          }
        </style>
      </head>
      <body>
        <h1>gmira mentions in last 30 days</h1>
        <p class="count">${count}</p>
        <footer>Auto-refreshes every 60 seconds • Powered by Twitter API</footer>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tweets");
  }
});

export default app;