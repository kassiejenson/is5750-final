exports.get404 = (req, res) => {
    console.log('oh no! 404 error!');
    res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page",
      });
}

exports.get500 = (error, req, res, next) => {
    console.log('server error!', error);
    res.status(500).render("error/500", {title: "Server Error", pageClass: "error-page", error})
}