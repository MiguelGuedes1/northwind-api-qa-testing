-- =====================================================
-- NORTHWIND API - SQL VALIDATION QUERIES
-- Author: Miguel Guedes
-- Description: Queries to validate API test data
-- =====================================================


-- =====================================================
-- 1. DATABASE OVERVIEW
-- =====================================================

-- Total de registos por tabela
SELECT 'Customers' AS TableName, COUNT(*) AS TotalRecords FROM Customers
UNION ALL
SELECT 'Products', COUNT(*) FROM Products
UNION ALL
SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL
SELECT 'Employees', COUNT(*) FROM Employees
UNION ALL
SELECT 'OrderDetails', COUNT(*) FROM [Order Details];


-- =====================================================
-- 2. CUSTOMERS VALIDATION
-- =====================================================

-- Todos os customers
SELECT * FROM Customers;

-- Customer específico usado nos testes (ALFKI)
SELECT * FROM Customers WHERE CustomerID = 'ALFKI';

-- Customers por país
SELECT Country, COUNT(*) AS Total
FROM Customers
GROUP BY Country
ORDER BY Total DESC;

-- Customers sem ContactName (dados em falta)
SELECT CustomerID, CompanyName
FROM Customers
WHERE ContactName IS NULL;

-- Validar que customer de teste não existe
SELECT * FROM Customers WHERE CustomerID = 'TESTE';


-- =====================================================
-- 3. PRODUCTS VALIDATION
-- =====================================================

-- Todos os produtos
SELECT * FROM Products;

-- Produto específico usado nos testes (ID = 1)
SELECT * FROM Products WHERE ProductID = 1;

-- Produtos descontinuados
SELECT ProductID, ProductName, Discontinued
FROM Products
WHERE Discontinued = 1;

-- Produtos com stock baixo (menos de 10 unidades)
SELECT ProductID, ProductName, UnitsInStock
FROM Products
WHERE UnitsInStock < 10
ORDER BY UnitsInStock ASC;

-- Preço médio dos produtos por categoria
SELECT CategoryID, 
       AVG(UnitPrice) AS AvgPrice,
       MIN(UnitPrice) AS MinPrice,
       MAX(UnitPrice) AS MaxPrice
FROM Products
GROUP BY CategoryID
ORDER BY CategoryID;


-- =====================================================
-- 4. ORDERS VALIDATION
-- =====================================================

-- Todas as orders
SELECT * FROM Orders;

-- Order específica usada nos testes (ID = 10248)
SELECT * FROM Orders WHERE OrderID = 10248;

-- Orders por customer
SELECT CustomerID, COUNT(*) AS TotalOrders
FROM Orders
GROUP BY CustomerID
ORDER BY TotalOrders DESC;

-- Orders com detalhes (JOIN)
SELECT 
    o.OrderID,
    o.CustomerID,
    o.OrderDate,
    od.ProductID,
    od.Quantity,
    od.UnitPrice
FROM Orders o
JOIN [Order Details] od ON o.OrderID = od.OrderID
WHERE o.OrderID = 10248;

-- Total de vendas por order
SELECT 
    o.OrderID,
    o.CustomerID,
    SUM(od.Quantity * od.UnitPrice) AS TotalAmount
FROM Orders o
JOIN [Order Details] od ON o.OrderID = od.OrderID
GROUP BY o.OrderID, o.CustomerID
ORDER BY TotalAmount DESC;


-- =====================================================
-- 5. EMPLOYEES VALIDATION
-- =====================================================

-- Todos os employees
SELECT * FROM Employees;

-- Employee específico usado nos testes (ID = 1)
SELECT * FROM Employees WHERE EmployeeID = 1;

-- Employees e as suas orders
SELECT 
    e.EmployeeID,
    e.FirstName + ' ' + e.LastName AS FullName,
    COUNT(o.OrderID) AS TotalOrders
FROM Employees e
LEFT JOIN Orders o ON e.EmployeeID = o.EmployeeID
GROUP BY e.EmployeeID, e.FirstName, e.LastName
ORDER BY TotalOrders DESC;


-- =====================================================
-- 6. DATA INTEGRITY CHECKS
-- =====================================================

-- Orders sem customer válido
SELECT o.OrderID, o.CustomerID
FROM Orders o
LEFT JOIN Customers c ON o.CustomerID = c.CustomerID
WHERE c.CustomerID IS NULL;

-- Order Details sem product válido
SELECT od.OrderID, od.ProductID
FROM [Order Details] od
LEFT JOIN Products p ON od.ProductID = p.ProductID
WHERE p.ProductID IS NULL;

-- Products sem categoria
SELECT ProductID, ProductName
FROM Products
WHERE CategoryID IS NULL;