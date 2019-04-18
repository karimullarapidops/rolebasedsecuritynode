let userRoles = {
    adminKareem : "admin",
    editorKareem : "editor",
    "authorKareem" : "author",
    "subKareem" : "subscriber"
}

exports.getRoles = (user) => {
     return userRoles[user];
}