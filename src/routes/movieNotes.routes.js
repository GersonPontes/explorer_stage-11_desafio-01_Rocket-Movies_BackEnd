const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const movieNotesRouter = Router();

const movieNotesController = new MovieNotesController();

movieNotesRouter.use(ensureAuthenticated);  

movieNotesRouter.get("/", movieNotesController.index);
movieNotesRouter.get("/:movieNote_id", movieNotesController.show);
movieNotesRouter.post("/", movieNotesController.create);

module.exports = movieNotesRouter;