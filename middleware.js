// module.exports.isLoggedIn=(req,res,next)=>{
//     if(!req.isAuthenticated()){
//         req.session.returnTo = req.originalUrl
//         req.flash('error','you must be signned in');
//         return res.redirect('/login')
//     }
//     next();
// }
function isLoggedIn(req, res, next) {
    console.log("Checking Authentication...");
    console.log("User:", req.user); // Debugging user authentication

    if (req.isAuthenticated()) {
        if (req.user.isAdmin) {
            res.locals.isAdmin = true; // Pass isAdmin to the route
        } else {
            res.locals.isAdmin = false; // Regular user
        }
        return next();
    }
    return res.redirect('/login');
}
module.exports = { isLoggedIn };
