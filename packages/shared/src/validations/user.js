const { object, string } = require('yup');

const createUser = object({
    name: string()
    .required('O nome é obrigatório')
    .max(255, 'O nome deve ter no máximo 255 caracteres.'),
    email: string().required('O e-mail é obrigatório').email('Formato de e-mail inválido'),
    password: string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter no mínimo 8 caracteres.'),
    profile: string().required('O perfil é obrigatório').oneOf(['admin', 'user'], 'Perfil inválido'),
    

})

const updateUSer = object({
    name: string()
    .required('O nome é obrigatório')
    .max(255, 'O nome deve ter no máximo 255 caracteres.'),
    email: string().required('O e-mail é obrigatório').email('Formato de e-mail inválido'),
    password: string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter no mínimo 8 caracteres.'),
    profile: string().required('O perfil é obrigatório').oneOf(['admin', 'user'], 'Perfil inválido'),
})

module.exports = {
    createUser,
    updateUSer,
}