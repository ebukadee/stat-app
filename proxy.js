const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder

// Proxy endpoint
app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0", // Some APIs require a user-agent header
            },
            timeout: 10000, // 10-second timeout
        });
        res.json(response.data);
    } catch (error) {
        console.error("Proxy error:", error.message);
        res.status(500).json({
            error: "Error fetching data",
            details: error.message,
        });
    }
});

// Render index page with persistent dropdowns
app.get("/", (req, res) => {
    const event = req.query.event || "24"; // Default to GW24
    const league = req.query.league || "2272990"; // Default to League 1

    // Generate gameweek options dynamically
    const gameweeks = Array.from({ length: 15 }, (_, i) => i + 24)
        .map(gw => `<option value="${gw}" ${gw == event ? "selected" : ""}>GW${gw}</option>`)
        .join("");

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
                        ${gameweeks}
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

// Error handling for missing static files
app.use((req, res, next) => {
    res.status(404).send("File not found");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err.stack);
    res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));