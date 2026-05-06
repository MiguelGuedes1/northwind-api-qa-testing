const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da ligação ao SQL Server (Windows Authentication)

const dbConfig = {
  server: '127.0.0.1',
  port: 1433,
  database: 'northwind',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Função helper para correr queries
async function runQuery(sqlQuery, params = []) {
  const pool = await sql.connect(dbConfig);
  const request = pool.request();
  params.forEach(p => request.input(p.name, p.type, p.value));
  return await request.query(sqlQuery);
}

// ─── CUSTOMERS ────────────────────────────────────────────

// GET todos os customers
app.get('/api/customers', async (req, res) => {
  try {
    const result = await runQuery('SELECT * FROM Customers');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET customer por ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const result = await runQuery(
      'SELECT * FROM Customers WHERE CustomerID = @id',
      [{ name: 'id', type: sql.NVarChar, value: req.params.id }]
    );
    if (result.recordset.length === 0)
      return res.status(404).json({ error: 'Customer not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST criar customer
app.post('/api/customers', async (req, res) => {
  const { CustomerID, CompanyName, ContactName, ContactTitle, City, Country } = req.body;
  try {
    await runQuery(
      `INSERT INTO Customers (CustomerID, CompanyName, ContactName, ContactTitle, City, Country)
       VALUES (@id, @company, @contact, @title, @city, @country)`,
      [
        { name: 'id',      type: sql.NVarChar, value: CustomerID },
        { name: 'company', type: sql.NVarChar, value: CompanyName },
        { name: 'contact', type: sql.NVarChar, value: ContactName },
        { name: 'title',   type: sql.NVarChar, value: ContactTitle },
        { name: 'city',    type: sql.NVarChar, value: City },
        { name: 'country', type: sql.NVarChar, value: Country }
      ]
    );
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT atualizar customer
app.put('/api/customers/:id', async (req, res) => {
  const { CompanyName, ContactName, ContactTitle, City, Country } = req.body;
  try {
    const result = await runQuery(
      `UPDATE Customers SET
        CompanyName  = @company,
        ContactName  = @contact,
        ContactTitle = @title,
        City         = @city,
        Country      = @country
       WHERE CustomerID = @id`,
      [
        { name: 'id',      type: sql.NVarChar, value: req.params.id },
        { name: 'company', type: sql.NVarChar, value: CompanyName },
        { name: 'contact', type: sql.NVarChar, value: ContactName },
        { name: 'title',   type: sql.NVarChar, value: ContactTitle },
        { name: 'city',    type: sql.NVarChar, value: City },
        { name: 'country', type: sql.NVarChar, value: Country }
      ]
    );
    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const result = await runQuery(
      'DELETE FROM Customers WHERE CustomerID = @id',
      [{ name: 'id', type: sql.NVarChar, value: req.params.id }]
    );
    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PRODUCTS ─────────────────────────────────────────────

// GET todos os products
app.get('/api/products', async (req, res) => {
  try {
    const result = await runQuery('SELECT * FROM Products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET product por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await runQuery(
      'SELECT * FROM Products WHERE ProductID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(req.params.id) }]
    );
    if (result.recordset.length === 0)
      return res.status(404).json({ error: 'Product not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ORDERS ───────────────────────────────────────────────

// GET todas as orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await runQuery('SELECT * FROM Orders');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET order por ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const result = await runQuery(
      'SELECT * FROM Orders WHERE OrderID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(req.params.id) }]
    );
    if (result.recordset.length === 0)
      return res.status(404).json({ error: 'Order not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── EMPLOYEES ────────────────────────────────────────────

// GET todos os employees
app.get('/api/employees', async (req, res) => {
  try {
    const result = await runQuery('SELECT * FROM Employees');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET employee por ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const result = await runQuery(
      'SELECT * FROM Employees WHERE EmployeeID = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(req.params.id) }]
    );
    if (result.recordset.length === 0)
      return res.status(404).json({ error: 'Employee not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START SERVER ─────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Northwind API running on http://localhost:${PORT}`);
  console.log(`📦 Endpoints disponíveis:`);
  console.log(`   GET    /api/customers`);
  console.log(`   GET    /api/customers/:id`);
  console.log(`   POST   /api/customers`);
  console.log(`   PUT    /api/customers/:id`);
  console.log(`   DELETE /api/customers/:id`);
  console.log(`   GET    /api/products`);
  console.log(`   GET    /api/products/:id`);
  console.log(`   GET    /api/orders`);
  console.log(`   GET    /api/orders/:id`);
  console.log(`   GET    /api/employees`);
  console.log(`   GET    /api/employees/:id`);
});