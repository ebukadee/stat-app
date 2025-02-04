const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Import Axios
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static files


app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url; // Get the target API URL from the query parameter

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  try {
    const response = await axios.get(targetUrl); // Use Axios to fetch the data
    res.json(response.data); // Return the API response data
  } catch (error) {
    res.status(500).json({
      error: "Error fetching data",
      details: error.message,
    });
  }
});
// Proxy endpoint
app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ error: 'Missing "url" query parameter' });

    try {
        const response = await axios.get(targetUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data", details: error.message });
    }
});

// Render index page with persistent dropdowns
app.get("/", (req, res) => {
    const event = req.query.event || "24"; // Default to GW24
    const league = req.query.league || "2272990"; // Default to League 1

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>H2H League Data</title>
            <link rel="stylesheet" href="/styles.css" />
        </head>
        <body>
            <form id="selectionForm">
                <div>
                    <label for="event">Gameweek:</label>
                    <select id="event" name="event">
                        ${Array.from({ length: 15 }, (_, i) => i + 24)
                            .map(gw => `<option value="${gw}" ${gw == event ? "selected" : ""}>GW${gw}</option>`)
                            .join("")}
                    </select>
                </div>
                <div>
                    <label for="league">League:</label>
                    <select id="league" name="league">
                        <option value="2272990" ${league === "2272990" ? "selected" : ""}>League 1</option>
                        <option value="2309762" ${league === "2309762" ? "selected" : ""}>League 2</option>
                    </select>
                </div>
                <button type="button" id="fetchData">Get Data</button>
            </form>
            <div id="h2hContainer"></div>
            <script src="/index.js"></script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));