const functions = require('firebase-functions');
const admin = require('firebase-admin');


//inicializar app de firebase  donde se configura el admin 
admin.initializeApp(functions.config().firebase);


//se exporta la fucion de pendiendo de lo que quieras hacer
//despues del export sendNotificattion es el nombre de la funcion

//functions.database.ref("aquiva la ruta a la rama a la que se desea entrar")

//esta funcion solo se ejecutara cuando se escriba .onWrite()
//se debe de pesar 2 tiepos de parametros (change,chontext)

//en el context como su nombre lo dice es el contexto en esta caso los datos {userI} {prestamoId}
//con esto podremos optener el id del usuario y del prestamo al que estamos accediendo

exports.sendNotification = functions.database.ref(`/Prestamos/{userId}/{prestamoId}/`)
.onWrite((change, context) => {
        console.log("funciono prueba 3")
        //context.para es donde viene el userId y prestamiId
        const  receiverId = context.params.userId;
        console.log("id:",receiverId)

        //change.after.child("atributo").val() en esta estamos accediendo al parametro fecha_devolucion de nuestra coleccion
        //y lo almacenamos en una constate llamada fecha
        const fecha = change.after.child("fecha_devolucion").val();
        console.log("esta es la fecha",fecha)

        //return es para regresas datos en este caso regresara una consulta 
        // y como es un promesa nos regresara un valor o en este caso mandara un mensaje 

        return admin.database().ref("/InformacionEstudiantes/"+receiverId).once('value')
        .then(snap=>{
                const usertoken = snap.child('prestamo_token').val()
                //snap es nuestra respuesta a la peticion cual es esa peticion??
                //pues es admin.database().ref("infomracionEstudiantes/"+receiverId).once("value")
                // bien con eso estamo diciendo?? exacto entra en la rama estudiandes en el id tal
                //y con el snap.child() le decimos traenos el vaarlo de prestamo token y gurdalo en la constante
                
                console.log("el token:",usertoken)
                
                //message en firebase nos dice que se debe construir un mensaje de la siguiente forma
                //meesage es un objeto con 2 atributos otro objeto  un token para poder ser mandado 
                // aun usuario especifico ese token ya lo crea la aplicacion movil

                const message = {
                        notification:{
                                
                                title:"Has adquirido un libro",
                                body:"Debes de entregarlo antes de "+ fecha
                        },
                        token: usertoken
                }
                
                //este ultimo return es porque en cada promesa hay que hacer un retunr
                // pero este admin.messaging().send(message) aqui esto es una funcion
                // la cual es mandar un mensaje en send() le mandamos el mensaje que creamos
                return admin.messaging().send(message)
                        .then(function(response) {
                                //esto es una promesa por que hay un then de echo firebase trabaja bajo promesas
                                // que es una promesa es siemplemente un valor que puede o no puede llegar
                                //el then representa si llega es el entonces
                                // catch pues es un error por si no llega
                                console.log("exito:",response)
                                //este return es solo porque es una promesa y regresamos un true si es que se manda el mensaje
                                
                                return true
                          })
                        .catch(function(error) {
                                  console.log("Error sending message:", error);
                                });
        })
});