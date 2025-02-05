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
        return next();
    }
    return res.status(401).json({ error: "Unauthorized. Please log in." });
}
module.exports = { isLoggedIn };
