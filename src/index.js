const { app, HOST, PORT } = require("./server");

// Run the server
app.listen(PORT, HOST, () => {
  console.log("Server started");
});
