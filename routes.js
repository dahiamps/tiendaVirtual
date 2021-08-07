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
router.get('/catalogo', (req, res) => {

    connection.query('SELECT * FROM products', (error, results) => {
        if (error) {
            throw error
        } else {
            res.render('catalogo', { results: results })
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


const crud = require('./controlles/crud')
router.post('/save', crud.save)
router.post('/update', crud.update)
module.exports = router;
