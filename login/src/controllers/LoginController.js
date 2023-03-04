//esto nos ayuda a encriptar la contraseña
const bcrypt = require('bcrypt');

//req es objeto de solicitud
//res objeto de respuesta

//creamos una funcion 
function index(req, res) {
  if (req.session.loggedin) {
    res.redirect('/'); //nos va a renderizar a ningun lado
  } else {
    res.render('login/index'); //nos va a renderizar a index que esta dentro de login
  }
}


//funcion para registrarnos
function register(req, res) {
  if (req.session.loggedin) {
    res.redirect('/');
  } else {
    //nos va a redireccionar a la pagina de regisrarse
    res.render('login/register');
  }

}
//hacemos una consulta con nuestra bd
function storeUser(req, res) {
  const data = req.body;
  //hacemos una consulta para ver si el usuario ya existe y que le salga un mensaje de error
  req.getConnection((err, conn) => {
    //le pasamos una consulta a la bd
    conn.query('SELECT * FROM users WHERE email= ?', [data.email], (err, userData) => {
      //le va a aparecer que el usuario ya existe
      if (userData.length > 0) {
        res.render('login/register', { error: 'User already exists' });
        //si no que se registre 
      } else {
        //para que nos encripte la contraseña
        bcrypt.hash(data.password, 12).then(hash => {
          //nos imprima el hash que ha obtenido
          console.log(hash);
          //data de la password sera hash
          data.password = hash;
          //console.log(data);
          //hacemos una consulta en la base de datos
          req.getConnection((err, conn) => {
            //hacemos una conexion a la bd
            conn.query('INSERT INTO users SET ?', [data], (err, rows) => {// funcion flecha que puede ser un error
              res.redirect('/'); //no nos rerije a ningun lado
            });
          });

        });
      }
    });
  });
}


//creamos una funcion para la base de datos
function auth(req, res) {
  const data = req.body; //una variable
  //let email = req.body.email;
  //let password = req.body.password;

  //hacemos una consulta con la base de datos 
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userData) => {
      if (userData.length > 0) {
        userData.forEach(element => {
          //aqui va a comparar la contraseña con la que se registro y la que pone en el inicio de sesion
          bcrypt.compare(data.password, element.password, (err, isMatch) => {
            //si la contraseña es incorrecta entonces ejecuta una condicion
            if (!isMatch) {
              console.log("out", userData);
              //aqui si el usuario quiere iniciar sesion pero no se ha registrado le ponemos que no existe 
              res.render('login/index', { error: 'Error password or email do not exist!' });
            } else {
              //si el usuario tiene registro entonces le ponemos que bienvenido
              console.log("wellcome");
              //el acceso es correcto
              req.session.loggedin = true;
              req.session.name = element.nombre;
              res.redirect('/');
            }
          });
        });

      } else {
        //si esta mal entonces le escribimos que hay error
        res.render('login/index', { error: 'Error password or email do not exist!' });
      }
    });
  });
}

//creamos la funcion de cerrar sesion
function logout(req, res) {
  //aqui hay una condicion para ver si va a cerrar sesion o no
  //si quiere cerrar sesion entonces se va a destruir su inicio de sesion (en pocas palabras )
  if (req.session.loggedin) {
    req.session.destroy();
  }
  res.redirect('/'); //redirecciona 
}


//modulos para exportar
module.exports = {
  index: index,
  register: register,
  auth: auth,
  logout: logout,
  storeUser: storeUser,

}

