const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/listNames.routes"));
app.use("/api/listItem", require("./routes/list.routes"));

const PORT = config.get("port") || 5000;

async function startDb() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () =>
      console.log(`App has been started on port: ${PORT}`)
    );
  } catch (err) {
    console.log("Server Error", err.message);
    process.exit(1);
  }
}

startDb();
