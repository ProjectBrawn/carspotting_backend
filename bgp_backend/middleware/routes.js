// const { Errors } = require('../modelos/errors');
// const { Posts } = require('../modelos/posts');
// const { Reports } = require('../modelos/reports');
// const { Users } = require('../modelos/users');
// const { Tokens } = require('../modelos/tokens');
// const { VerificationTokens } = require('../modelos/verificationTokens');



// async function updateAllDatabase(usernameAntiguo, usernameNuevo) {

//     //La coleccion errors hay que actualizarla, la coleccion posts, la coleccion reports, la coleccion users, la coleccion tokens
//     //y la coleccion verificationTokens
//     try {
//         //Actualizamos la coleccion errors
//         await Errors.updateMany({ username: usernameAntiguo }, { username: usernameNuevo });

//         //Actualizamos la coleccion posts
//         await Posts.updateMany({ username: usernameAntiguo }, { username: usernameNuevo });

//         //Actualizamos la coleccion reports
//         await Reports.updateMany({ username: usernameAntiguo }, { username: usernameNuevo });

//         //Actualizamos la coleccion users
//         await Users.updateOne({ username: usernameAntiguo }, { username: usernameNuevo });

//         //Actualizamos la coleccion tokens
//         await Tokens.updateMany({ username: usernameAntiguo }, { username: usernameNuevo });

//         //Actualizamos la coleccion verificationTokens
//         await VerificationTokens.updateMany({ username: usernameAntiguo }, { username: usernameNuevo });
//         return "Success"

//     } catch (error) {
//         console.error('Error al actualizar la base de datos:', error);
//         return "Error al actualizar la base de datos"
//     }
// }