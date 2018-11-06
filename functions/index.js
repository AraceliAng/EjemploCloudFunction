const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref(`/Prestamos/{userId}/{prestamoId}/`)
.onWrite((change, context) => {
        console.log("funciono prueba 3")
        const  receiverId = context.params.userId;
        console.log("id:",receiverId)
        const fecha = change.after.child("fecha_devolucion").val();
        console.log("esta es la fecha",fecha)

        return admin.database().ref("/InformacionEstudiantes/"+receiverId).once('value').then(snap=>{
                const usertoken = snap.child('prestamo_token').val()
                console.log("el token:",usertoken)
                 
                const message = {
                        notification:{
                                
                                title:"Has adquirido un libro",
                                body:"Debes de entregarlo antes de "+ fecha
                        },
                        token: usertoken
                }
                
                return admin.messaging().send(message)
                        .then(function(response) {
                                console.log("exito:",response)
                                return true
                          })
                        .catch(function(error) {
                                  console.log("Error sending message:", error);
                                });
        })
});