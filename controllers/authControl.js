module.exports = {
    authControl: (userId, currentUser) => {
        return userId == currentUser ? true : false
    }
}