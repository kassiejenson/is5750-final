const User = require("../models/user-model-mongoose");

exports.getLogin = (req, res) => {
    res.render("login", { pageTitle: "Login", pageClass: "login-page", errorMessage: null})
}

exports.getSignup = (req, res) => {
    res.render("signup", { pageTitle: "Signup", pageClass: "signup-page",})
}

exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("error logging out!", err);
        }
        console.log('logging out!')
        res.redirect('/')
    })
}

exports.authUser = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email: email });
        let passwordsMatch = false;
        if (user) {
            passwordsMatch = await user.validatePassword(password);
        }

        res.locals.user = user;
        res.locals.passwordsMatch = passwordsMatch;
        next()
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}

exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.roles.includes('admin')) {
        return next();
    } else {
        res.redirect("/user/login")
    }
}

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.render("login", {
                pageTitle: "Login",
                pageClass: "login-page",
                errorMessage: "Invalid credentials",
                entries: req.body
            });
        }

        const passwordsMatch = await user.validatePassword(password);

        if (!passwordsMatch) {
            return res.render("login", {
                pageTitle: "Login",
                pageClass: "login-page",
                errorMessage: "Invalid credentials",
                entries: req.body
            })
        }

        if (user && passwordsMatch) {
            req.session.isAuthenticated = true;
            req.session.user = user;
            return req.session.save((err) => {
                console.log(err);
                req.flash("success", `Welcome, ${user.firstName}!`);
                if (req.session.returnTo) {
                    let redirectTo = req.session.returnTo;
                    delete req.session.returnTo;
                    return res.redirect(redirectTo);
                }
                res.redirect('/')
            })
        }
    } catch (err) {
        //return specific error on login page, not generic error page
        console.log("error logging in!", err);
        return res.render("login", {
            pageTitle: "Login",
            pageClass: "login-page",
            errorMessage: "Something went wrong!",
            entries: req.body
        })
    }
}

exports.postSignup = async (req, res, next) => {
    console.log('data received', req.body);
    const { firstName, lastName, email, password, confirm_password } = req.body;
    console.log('signup post!');
    if (password !== confirm_password) {
        console.log('password does not match');
        return res.render('signup', {
            pageTitle: "Signup",
            pageClass: "signup-page",
            entries: req.body
        })
    }
    try {
        console.log('trying!');
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });
        console.log('user saving in progress...')
        await user.save();
        console.log('user was saved!');

        req.session.isAuthenticated = true;
        req.session.user = user;

        req.session.save((err) => {
            if (err) {
                console.log("error!", err);
            }
            console.log('no error in saving!')
            req.flash("success", "Signup worked!");
            if (req.session.returnTo) {
                let redirectTo = req.session.returnTo;
                delete req.session.returnTo;
                return res.redirect(redirectTo);
            }
            res.redirect("/")
        })
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
}