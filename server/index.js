const keys = require('./keys');


//express app setup------------------------
const express = require('express');

//parse incoming request from the react app
// and turn the body of the post request into json object
const bodyParser = require('body-parser');

//cross origin resource sharing
// allow us to make request from one domain 
// that the react app be running on ,
// to different domain on which the express api are
//hosted on
const cors = require('cors'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Postgress client setup------------------------
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
    .query('CREATE TABLE IF NOT EXISTS products(id SERIAL PRIMARY KEY, product_code TEXT not null, description TEXT not null )')
    .catch(err => console.log(err));


//express route handler------------------------
// create products
app.post('/products', async (req,res) => {
    const product = req.body.product;
    console.log('from server', product.product_code, product.description);
    pgClient
    .query('INSERT INTO products(product_code, description) SELECT ($1), ($2) WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_code=($1))', [product.product_code, product.description])
    .catch(err => console.log(err));
    res.send("Added Successfully");
});

//Get all the products
app.get('/products', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM products ORDER BY id ASC').catch(err => console.log(err));
    //becoz values has other info about the query, we just need the rows returned
    console.log(values);
    res.send(values.rows);
});

// get a single product
app.get('/products/:id', async (req, res) => { 
    const id = req.params.id;
    const values = await pgClient.query('SELECT * FROM products WHERE id=($1)', [id]).catch(err => console.log(err));
    res.send(values.rows);
});


// update a product
app.put('/products/:id', async (req, res) => {
    const id = req.params.id;
    const product = req.body.product;

    pgClient
    .query('UPDATE products SET product_code=($2), description=($3) WHERE id=($1)',[id, product.product_code, product.description])
    .catch(err => console.log(err));

    res.send(`product with id: ${id} update successfully`)
});

//delete a product
app.delete("/products/:id", async (req, res) => {
    const id = req.params.id;
    pgClient.query('DELETE FROM products WHERE id=(&1)', [id]).catch(err => console.log(err));
    res.send('Product deleted successfully')
})

// app.post('/products', async (req, res) => {
//     const index = req.body.index;
     
//     if(parseInt(index) > 40) {
//         return res.status(422).send('Index value too high');
//     }

//     redisClient.hset('values', index, 'Nothing yet!');
//     redisPublisher.publish('insert', index); // here we send an insert event. THis gonna wakeup the worker which will then start processing.
//     pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

//     res.send({working: true});

// });

app.listen(5000, err => {
    console.log('Listening');
});

