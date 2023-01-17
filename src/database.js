const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

async function databaseConnector(databaseURL) {
  await mongoose.connect(databaseURL);
}

async function databaseDisconnector() {
  await mongoose.connection.close();
}

module.exports = {
  databaseConnector,
  databaseDisconnector,
};
