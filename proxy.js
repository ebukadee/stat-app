// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const app = express();
// const PORT = 3000;

// app.use(cors());

// // Set up the route for the API proxy
// app.get("/api/data", async (req, res) => {
//   try {
//     // Make the GET request to the external API
//     const response = await axios.get(
//       "https://fantasy.premierleague.com/api/bootstrap-static/"
//     );

//     // Return the data from the external API as the response
//     res.json(response.data);
//   } catch (error) {
//     // Handle any errors from the external API or internal server
//     res.status(500).json({ error: "Error fetching data" });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Import Axios
const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
