const express = require("express");
const { quotes, getNewQuoteId } = require("./data.cjs");
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
    let newId;

    do {
      newId = getNewQuoteId();
    } while (quotes.findIndex(({ id }) => id === newId) !== -1);

    const newQuote = {
      id: newId,
      quote: query.quote,
      person: query.person,
    };

    quotes.push(newQuote);
    res.status(201).json({ quote: newQuote });
  } else {
    res.status(400).send("request not valid");
  }
});

app.get("/api/quotes/:id(\\d+)", (req, res) => {
  const quoteId = Number(req.params.id);
  const quote = quotes.find(({ id }) => id === quoteId);

  if (quote) {
    res.status(200).json({ quote });
  } else {
    res.status(404).send("resource not found");
  }
});

app.put("/api/quotes/:id(\\d+)", (req, res) => {
  if (!(req.query.quote && req.query.person)) {
    res.status(400).send("invalid request");
    return;
  }

  const quoteId = Number(req.params.id);
  const quoteUpdate = {
    id: quoteId,
    quote: req.query.quote,
    person: req.query.person,
  };

  const quoteIndex = quotes.findIndex(({ id }) => id === quoteId);
  if (quoteIndex === -1) {
    quotes.push(quoteUpdate);
    res.status(201).json({ quote: quoteUpdate });
  } else {
    quotes[quoteIndex] = quoteUpdate;
    res.status(200).json({ quote: quoteUpdate });
  }
});

app.delete("/api/quotes/:id(\\d+)", (req, res) => {
  const quoteId = Number(req.params.id);

  const quoteIndex = quotes.findIndex(({ id }) => id === quoteId);
  if (quoteIndex !== -1) {
    quotes.splice(quoteIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("resource not found");
  }
});

app.get("/api/quotes/random", (req, res) => {
  const quote = getRandomElement(quotes);
  res.json({ quote });
});

app.listen(PORT, () => {
  console.log(`Server started and listening at http://localhost:${PORT}`);
});
