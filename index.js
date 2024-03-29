const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HELLO TEAM</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          text-align: center;
          padding: 50px;
        }
        h1 {
          color: #333;
          font-size: 3em;
          text-shadow: 2px 2px 4px #000000;
        }
        p {
          color: #666;
          font-size: 1.5em;
        }
        @keyframes rainbow {
          0% { color: red; }
          14% { color: orange; }
          28% { color: yellow; }
          42% { color: green; }
          57% { color: blue; }
          71% { color: indigo; }
          85% { color: violet; }
          100% { color: red; }
        }
        .animated-text {
          animation: rainbow 4s infinite;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to My Website</h1>
      <p class="animated-text">this is <strong>Kranthi_Champ</strong>!</p>
      <p>All the very best team</p>
    </body>
    </html>
  `);
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
