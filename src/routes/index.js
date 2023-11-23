const { Router } = require("express");
const usersRouter = require("./users.routes");
const movieNotesRouter = require("./movieNotes.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/movies", movieNotesRouter);
routes.use("/sessions", sessionsRouter);

module.exports = routes;