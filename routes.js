const express = require('express');
const router = express.Router();
const connection = require('./database/db');

router.get('/products', (req, res) => {

    connection.query('SELECT * FROM products', (error, results) => {
        if (error) {
            throw error
        } else {
            res.render('products', { results: results })
        }
    })

})

router.get('/infoContactos', (req, res) => {

    connection.query('SELECT * FROM contacto', (error, results) => {
        if (error) {
            throw error
        } else {
            res.render('infoContactos', { results: results })
        }
    })

})

router.get(`/create`, (req, res) => {
    res.render(`cproduct`)
})


router.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM products WHERE id=?', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            res.render('editProduct', { product: results[0] })
        }
    })
})

//ruta para eliminar el registro
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM products WHERE id = ?', [id],(error,results)=> {
        if(error) {
            throw error
        } else {
            res.redirect('/products')
        }
    })
})

router.get('/deleteContacto/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM contacto WHERE id = ?', [id], (error, results) => {
        if (error) {
            throw error
        } else {
            res.redirect('/infoContactos')
        }
    })
})





const crud = require('./controlles/crud')
router.post('/save', crud.save)
router.post('/update', crud.update)
router.post('/saveContact', crud.saveContact)
module.exports = router;
