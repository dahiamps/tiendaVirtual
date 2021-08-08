const conexion = require('../database/db');


exports.save = (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const value = req.body.value;
    const stock = req.body.stock;
    const img = req.body.img;
    conexion.query('INSERT INTO products SET ?', { name: name, description: description, value: value, stock: stock, img: img }, ( error, results )=> {
        if (error) {
                console.log(error);
        } else {
            res.redirect('/products')
        }
    })
}


exports.update = (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    const value = req.body.value;
    const stock = req.body.stock;
    const img = req.body.img;
    conexion.query('UPDATE products SET ? WHERE id = ?', [{ name: name, description: description, value: value, stock: stock, img: img },id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/products')
        }
    })
}