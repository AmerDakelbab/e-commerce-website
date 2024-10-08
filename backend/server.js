const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path')
const multer = require('multer');
const { error } = require('console');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });


const app = express();
app.use(express.json());
app.use(cors());
app.use('/Images', express.static(path.join(__dirname, 'Images')));



const SECRET_KEY = 'SECRET_KEY';

const urlDb = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}:${process.env.MYSQLHOST}:${process.env.MYSQLPORT}:${process.env.MYSQLDATABASE}`

const db = mysql.createConnection(urlDb);

db.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Database Connected!");
    };
});



app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username  || !password ) {
        res.status(404).json({message: "Username and Password Are Required!"});
    }
    try {
        db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
            if (err) {
                res.status(500).json({ message: "Try Again Later.." });
            }
            if (results.length > 0) {
                const comparedPassword = await bcrypt.compare(password, results[0].password);
                if (comparedPassword) {
                    const token = jwt.sign({
                        userId: results[0].user_id,
                        userRole: results[0].userRole
                    }, SECRET_KEY, { expiresIn: '1h' });
                    return res.status(200).json({ message: "Login Successfully!", token, userRole: results[0].userRole });
                } else {
                    res.status(401).json({ message: "Invalid Password" });
                }
            } else {
                res.status(404).json({ message: "User Not Found" });
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;
    if (!username  || !password || !email ) {
        res.status(404).json({message: "Fill in All fields!"});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query("INSERT INTO users (email,username,password) VALUES (?,?,?)", [email, username, hashedPassword], (err, results) => {
            if (err) {
                throw err;
            } else {
                res.status(200).json({ message: 'Signed Up Succesfully!' });
            }
        });
    } catch (err) {
        if (err) throw err;
    };
});


const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded;
        next();
    });
};
app.get('/admin/viewusers', (req, res) => {
    db.query("select * from users where userRole = 'user'", (err, results) => {
        if (err) {
            console.error("Error Fetching Users", err);
            res.status(500).json({ error: 'failed to fetch users' });
        } else {
            res.json(results);
        }
    })
})
app.get('/admin/viewadmins', (req, res) => {
    db.query("select * from users where userRole = 'Admin'", (err, results) => {
        if (err) {
            console.error("Error Fetching Admins", err);
            res.status(500).json({ error: 'failed to fetch Admins' });
        } else {
            res.json(results);
        }
    })
})

app.get('/admin/viewproducts', (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Failed to fetch products' });
        } else {
            res.json(results);
        }
    });
});
app.get('/admin/viewcategories', (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).json({ error: 'Failed to fetch categories' });
        } else {
            res.json(results);
        }
    });
});
app.delete('/admin/viewcategories/:id',authToken, async (req, res) => {
    const categoryId = req.params.id;
    const idInt = parseInt(categoryId, 10);
    
    if (isNaN(idInt)) {
        return res.status(400).send("Invalid product ID");
    }

    console.log("Deleting product with ID:", idInt);

    db.query("DELETE FROM categories WHERE category_id = ?", [idInt], (err, results) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).send("Error deleting product");
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Product not found");
        }

        console.log("Deleted Product successfully!");
        return res.status(200).send("Product deleted successfully");
    });
});

app.post('/admin/addproducts', upload.single('image'), async (req, res) => {
    const { product_name, category, price, stock_status, rating } = req.body;
    const image = 'Images/' + req.file.filename.replace(/\\/g, '/');
    if (!product_name || !category || !price || !stock_status || !rating) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        db.query("INSERT INTO products (product_name,category,price,stock_status,rating,image) VALUES (?,?,?,?,?,?)", [product_name, category, price, stock_status, rating, image], (err, results) => {
            if (err) {
                console.error("error occurred in  MySQL:", err);
                res.status(500).json({ message: 'Error Inserting!' });
            } else {
                console.log("Data Sent", results);
                res.status(200).json({ message: 'Product Added!' });
            };
        });
    } catch (err) {
        console.error("Error Catching /admin", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.post('/admin/addcategory', async (req, res) => {
    const { category_name } = req.body;
    
    
    try {
        db.query("INSERT INTO categories (category_name) VALUES (?)", [category_name], (err, results) => {
            if (err) {
                console.error("error occurred in  MySQL:", err);
                res.status(500).json({ message: 'Error Inserting!' });
            } else {
                console.log("Data Sent", results);
                res.status(200).json({ message: 'category Added!' });
            };
        });
    } catch (err) {
        console.error("Error Catching /admin", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete('/admin/viewproducts/:id',authToken, async (req, res) => {
    const productId = req.params.id;
    const idInt = parseInt(productId, 10);
    
    if (isNaN(idInt)) {
        return res.status(400).send("Invalid product ID");
    }

    console.log("Deleting product with ID:", idInt);

    db.query("DELETE FROM products WHERE product_id = ?", [idInt], (err, results) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).send("Error deleting product");
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Product not found");
        }

        console.log("Deleted Product successfully!");
        return res.status(200).send("Product deleted successfully");
    });
});

app.put('/admin/viewproducts/:id', upload.single('image'), authToken, async (req, res) => {
    const productId = req.params.id;
    const idInt = parseInt(productId, 10);
    
    if (isNaN(idInt)) {
        return res.status(400).send("Invalid product ID");
    }

    const { product_name, category, price, stock_status, rating } = req.body;
    const image = req.file ? 'Images/' + req.file.filename.replace(/\\/g, '/') : null;

    // Construct the SQL query dynamically based on which fields are present
    const updateFields = [product_name, category, price, stock_status, rating, idInt];
    let query = "UPDATE products SET product_name = ?, category = ?, price = ?, stock_status = ?, rating = ? ";
    if (image) {
        query += ", image = ? ";
        updateFields.splice(5, 0, image); // Insert image into the correct position
    }
    query += "WHERE product_id = ?";

    db.query(query, updateFields, (err, results) => {
        if (err) {
            console.error("Error updating the product:", err);
            return res.status(500).send("Error updating the product.");
        }
        res.status(200).send("Product edited successfully!");
    });
});
app.put('/admin/viewcategories/:id', authToken, async (req, res) => {
    const categoryId = req.params.id;
    const idInt = parseInt(categoryId, 10);
    
    if (isNaN(idInt)) {
        return res.status(400).send("Invalid product ID");
    }

    const {category_name} = req.body;
    

    db.query("UPDATE categories SET category_name = ? WHERE category_id = ?",[category_name,idInt] ,(err,results) => {
           if (err) {
               console.error("Error updating the product:", err);
               return res.status(500).send("Error updating the product.");
           }
           res.status(200).send("Product edited successfully!");
    })
    
    
   

    
});

app.get('/', async (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/categories', async (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/cart', authToken, async (req, res) => {
    const userId = req.user.userId;

    console.log("USERID IS BACKEND", userId);

    if (!userId) {
        return res.status(400).json({ error: "userID is required" });
    }

    const { productId } = req.body;
    try {
        db.query("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [userId, productId], (err, results) => {
            if (err) {
                throw err;
            }
            if (results.length > 0) {
                db.query("UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?", [userId, productId], (err, results) => {
                    if (err) throw err;
                    res.json({ success: true, message: "Quantity Updated!" });
                });
            } else {
                db.query("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)", [userId, productId, 1], (err, results) => {
                    if (err) throw err;
                    console.log("Product Added", results);
                    res.json({ success: true, message: "Product Added to Cart" });
                });
            }
        });
    } catch (err) {
        console.error("Error Catching /cart", err);
        res.status(500).json({ error: "Internal Server Error" })
    }
});

app.post('/cart/update', authToken, (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    db.query("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?", [quantity, userId, productId], (err, results) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.get('/cart', authToken, (req, res) => {
    const userId = req.user.userId;
    db.query("SELECT products.*, cart.quantity FROM products JOIN cart ON products.product_id = cart.product_id WHERE cart.user_id = ?", [userId], (err, results) => {
        if (err) {
            console.log("Error Occurred Server", err);
        } else {
            res.json(results);
        }
    });
});

app.post('/cart/increment', authToken, (req, res) => {
    const { productId } = req.body;
    const userId = req.user.userId;

    db.query('UPDATE cart SET quantity = quantity + 1 WHERE user_id=? AND product_id=?', [userId, productId], (err, results) => {
        if (err) throw err;
        res.json({ success: true, message: "Quanitity Increased" });
    })
})

app.get('/categories/:name', (req, res) => {
    const category = req.params.name;

    db.query("SELECT * FROM products WHERE category = ?", [category], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/cart/decrement', authToken, (req, res) => {
    const { productId } = req.body;
    const userId = req.user.userId;

    db.query("UPDATE cart SET quantity = GREATEST(quantity - 1,1) WHERE user_id = ? and product_id = ?", [userId, productId], (err, results) => {
        if (err) throw err;
        res.json({ success: true, message: "Quantity Decreased!" });
    });
});

app.delete('/cart/:user_id/:product_id', authToken, (req, res) => {
    const { product_id: productId, user_id: userId } = req.params;

    db.query("DELETE FROM CART WHERE user_id = ? AND product_id = ?", [userId, productId], (err, results) => {
        if (err) {
            throw err;
        } else {
            res.json({ success: true, message: 'Product removed from cart' });
        }
    })
})

app.listen(5000, () => {
    console.log("App Listening On 5000");
});
