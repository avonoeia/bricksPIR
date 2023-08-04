function generatePassword() {
    pass = ''
    for (let i = 0; i < 10; i++) {
        if (Math.random() > 0.5) {
            pass += String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        } else {
            pass += String.fromCharCode(Math.floor(Math.random() * 10) + 48)
        }
    }
    return pass
}

module.exports = {generatePassword}