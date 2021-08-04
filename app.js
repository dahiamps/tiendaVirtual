//1- invocamos express
const express = require('express');
const app = express();


//2 - seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//3 - invocamos a dotenv

const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//4 - setear directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
//  console.log("URl "+__dirname);


//5 - Establecemos el motor de plantillas
app.set('view engine', 'ejs');

//6 -Invocamos a bcrypt
const bcrypt = require('bcryptjs');

//7- variables de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// 8 - Invocamos a la conexion de la DB
const connection = require('./database/db');


//9 - establecemos las rutas



app.get(`/login`, (req, res) => {
    res.render(`login`)
})
app.get(`/register`, (req, res) => {
    res.render(`register`)
})

app.listen(3000, (req, res) => {
    console.log("Server running in http://localhost:3000");
})

app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;  
    const pass = req.body.pass;
    let passwordHash = await bcrypt.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', { user: user, name: name, pass: passwordHash }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('register', {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''//ruta a la redirecciona
            });
            //res.redirect('/');         
        }
    });
})


//11 - Metodo para la autenticacion
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHash = await bcrypt.hash(pass, 8);
    if (user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields) => {
            if (results.length == 0 || !(await bcrypt.compare(pass, results[0].pass))) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "USUARIO y/o PASSWORD incorrectas",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });

                //Mensaje simple y poco vistoso
                //res.send('Incorrect Username and/or Password!');				
            } else {
                //creamos una var de session y le asignamos true si INICIO SESSION       
                req.session.loggedin = true;
                req.session.name = results[0].name;
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexión exitosa",
                    alertMessage: "¡LOGIN CORRECTO!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
            res.end();
        });
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "¡Por favor ingresa un usuario y/ o contraseña!",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
        res.end();
    }
});



//12 - Método para controlar que está login en todas las páginas
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    res.end();
});

//Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
    })
});