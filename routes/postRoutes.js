const express = require('express');
const postController = require('../controllers/postControllers');
const router = express.Router();

// @route GET & POST /posts/
const { checkToken } = require("../auth/token_validation");
router.route("/register").post(postController.regUser);
router.route("/getUser").post(postController.getUser)
router.route("/checkEligible").post(postController.checkEligible)
router.route("/getUpcoming").get(postController.getUpcoming)
router.route("/getCompleted").get(postController.getCompleted)
router.route("/invest").post(postController.invest)
router.route("/userLog").post(postController.userLog)
router.route("/result").post(postController.result)
// router.route("/login").post(postController.login);
// router.route("/user").get(postController.getUser);
// router.post("/reset",checkToken,postController.reset);
// router.route("/list").post(postController.findPeopleByID)
// router.route("/listmovie").post(postController.findMovieDetailsByID)
// router.route("/allMovies").get(postController.findAllMovie)
// router.route("/allMovies/:name").get(postController.findMovieByName);
// router.route("/getReview/:id").get(postController.getReview);
// router.route("/postReview").post(postController.postReview);
// router.route("/insert").post(postController.insertToTable);
// router.route("/getpopular").get(postController.getPop);
// router.route("/details/:id").get(postController.getById);
// router.route("/:genre").get(postController.getByGenre);
// router.route("/countReview/:id").get(postController.getCount);
// router.route("/getCast/:id").get(postController.getCast);
module.exports=router;