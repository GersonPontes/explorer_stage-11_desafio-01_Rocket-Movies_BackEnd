require("express-async-errors");
require("dotenv/config");
const express = require("express");
const cors = require("cors");
const AppError = require("./utils/AppError");
const routes = require("./routes");
const uploadConfig = require("./configs/upload");
const app = express();
const PORT = 3333;

app.use(express.json());
app.use(cors());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

app.use((error, request, response, next) => {
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  };

  console.log(error)

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

app.listen(PORT, () => console.log(`Server is running in PORT: ${PORT}`));