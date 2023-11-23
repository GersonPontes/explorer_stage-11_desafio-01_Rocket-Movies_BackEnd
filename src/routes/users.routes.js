const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const UsersAvatarController= require("../controllers/UsersAvatarController");
const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const upload = multer(uploadConfig.MULTER);
const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();


usersRouter.get("/",ensureAuthenticated, usersController.show);
usersRouter.post("/", usersController.create);
usersRouter.put("/", ensureAuthenticated, usersController.update);
usersRouter.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarController.update);

module.exports = usersRouter;