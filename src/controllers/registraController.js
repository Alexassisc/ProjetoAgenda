exports.index = (req, res) => {
    res.render('registra')
};

exports.create = (req, res) => {
    const {name, email, password, confirmPassword} = req.body;
    
    if (password !== confirmPassword) {
        return res.redirect('/registra')
    }

    res.redirect('/login')
}