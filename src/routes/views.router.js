import express from 'express'
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register")
})
router.get("/profile", (req, res) => {
    if (!req.session.login) {
        return res.redirect("/")
    }
    res.render("profile", { user: req.session.user });

})

export default router;