function userDTO(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        active: user.active 
    }
}

function userListDTO(users) {
    return users.map(userDTO);
}
module.exports = { userDTO, userListDTO };
