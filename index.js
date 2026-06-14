const express = require('express');
const app = express();
dotenv = require('dotenv');
const port = process.env.PORT || 4000 ;
app.use(express.json());
dotenv.config();
const pool = require('./connection/db');


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/create-user', async (req, res) => {
    const { username , gender } = req.body;
    const userData = await pool.query('INSERT INTO users (usename , gender) VALUES($1,$2) returning *', [username , gender]) ;

    if ( username === undefined) {
        res.status(400).json({ error: 'Username is required' });
    } else if (gender === undefined) {
        res.status(400).json({ error: 'Gender is required' });
    } 
    if ( userData ) {
        res.status(201).json({
            success: true,
            data: userData.rows[0]
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Failed to insert data'
        });
    }
});

app.get('/api/get-all-users' , async (req, res) =>{
    const query = await pool.query('SELECT * FROM users');
    if ( query) {
        res.status(200).json({
            success: true,
            data: query.rows
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data'
        });
    }
})


// app.delete('/api/user/detele/:user_Id', async ( req , res) => {
//     const {user_Id} = req.params;
//     const query = await pool.query('DELETE FROM users WHERE user_Id= $1 returning *',[user_Id],(row , error)=> {
//         if (error ) return res.status(500).json("error someting : " , error) ;
//         return res.status(200).json({data : row}) ;
//     });

// })

app.delete('/api/user/delete/:user_Id', async (req, res) => {
  try {
    const { user_Id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE "user_Id" = $1 RETURNING *',
      [user_Id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'User deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });
  }
});


app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
});
