const express = require("express");
const { quotes } = require("./data.cjs");
const { getRandomElement } = require("./utils.cjs");

const app = express();

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

app.get("/api/quotes", (req, res) => {
  if ("person" in req.query) {
    const filteredQuotes = quotes.filter(
      ({ person }) => person === req.query.person
    );
    res.json({ quotes: filteredQuotes });
  } else {
    res.json({ quotes });
  }
});

app.post("/api/quotes", (req, res) => {
  const query = req.query;

  if (query.quote && query.person) {
    const newQuote = {
      quote: query.quote,
      person: query.person,
    };

    quotes.push(newQuote);
    res.status(201).json({ quote: newQuote });
  } else {
    res.status(400).send("request not valid");
  }
});

app.get("/api/quotes/random", (req, res) => {
  const quote = getRandomElement(quotes);
  res.json({ quote });
});

app.listen(PORT, () => {
  console.log(`Server started and listening at http://localhost:${PORT}`);
});
