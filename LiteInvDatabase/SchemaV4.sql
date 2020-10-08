DROP TABLE IF EXISTS CustomerOrder;
DROP TABLE IF EXISTS EmployeePurchase;
DROP TABLE IF EXISTS CustomerRefund;
DROP TABLE IF EXISTS Categorization;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Tag;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Seller;

CREATE TABLE Tag (
    TagId INTEGER AUTO_INCREMENT,
    TagName VARCHAR(200) NOT NULL,
    PRIMARY KEY(TagId),
	UNIQUE(TagName)
);

CREATE TABLE Inventory (
    ItemId INTEGER AUTO_INCREMENT,
    ItemName VARCHAR(200) NOT NULL,
    ItemCount INTEGER DEFAULT 0,
    PRIMARY KEY(ItemId),
	UNIQUE(ItemName)
);

CREATE TABLE Categorization (
	ItemId INTEGER,
	TagId INTEGER,
	PRIMARY KEY(ItemId, TagId),
	FOREIGN KEY(ItemId) REFERENCES Inventory(ItemId),
	FOREIGN KEY(TagId) REFERENCES Tag(TagId)
);

CREATE TABLE Customer (
    CustomerId INTEGER AUTO_INCREMENT,
    CustomerName VARCHAR(200) NOT NULL,
    CustomerEmail VARCHAR(200) NOT NULL UNIQUE,
    PRIMARY KEY(CustomerId)
);

CREATE TABLE Employee (
    EmployeeId INTEGER AUTO_INCREMENT,
    EmployeeName VARCHAR(200) NOT NULL,
    EmployeeEmail VARCHAR(200) NOT NULL UNIQUE,
	PRIMARY KEY(EmployeeId)
);

CREATE TABLE Seller (
	SellerId INTEGER AUTO_INCREMENT,
	SellerName VARCHAR(200) NOT NULL,
	SellerEmail VARCHAR(200) NOT NULL UNIQUE,
	PRIMARY KEY(SellerId)
);

CREATE TABLE CustomerOrder (
    OrderId INTEGER AUTO_INCREMENT,
    ItemId INTEGER,
    CustomerId INTEGER,
    EmployeeId INTEGER,
    Amount INTEGER NOT NULL,
    OrderDate DATETIME NOT NULL,
    PRIMARY KEY(OrderId),
	FOREIGN KEY(ItemId) REFERENCES Inventory(ItemId),
	FOREIGN KEY(CustomerId) REFERENCES Customer(CustomerId),
	FOREIGN KEY(EmployeeId) REFERENCES Employee(EmployeeId)
);

CREATE TABLE EmployeePurchase (
	PurchaseId INTEGER AUTO_INCREMENT,
	ItemId INTEGER,
	EmployeeId INTEGER,
	SellerId INTEGER,
	Amount INTEGER NOT NULL,
	PurchaseDate DATETIME NOT NULL,
	PRIMARY KEY(PurchaseId),
	FOREIGN KEY(ItemId) REFERENCES Inventory(ItemId),
	FOREIGN KEY(EmployeeId) REFERENCES Employee(EmployeeId),
	FOREIGN KEY(SellerId) REFERENCES Seller(SellerId)
);

CREATE TABLE CustomerRefund (
	RefundId INTEGER AUTO_INCREMENT,
	ItemId INTEGER,
	CustomerId INTEGER,
	EmployeeId INTEGER,
	Amount INTEGER NOT NULL,
	RefundDate DATETIME NOT NULL,
	PRIMARY KEY(RefundId),
	FOREIGN KEY(ItemId) REFERENCES Inventory(ItemId),
	FOREIGN KEY(CustomerId) REFERENCES Customer(CustomerId),
	FOREIGN KEY(EmployeeId) REFERENCES Employee(EmployeeId)
);

DROP VIEW IF EXISTS StockHistory;

CREATE VIEW StockHistory AS
SELECT ItemId,
       (Amount * -1) AS Amount,
	   'Order' AS Type,
	   OrderDate AS Date
FROM CustomerOrder
UNION
SELECT ItemId,
       Amount,
	   'Purchase' AS Type,
	   PurchaseDate AS Date
FROM EmployeePurchase
UNION
SELECT ItemId,
       Amount,
	   'Refund' AS Type,
	   RefundDate AS Date
FROM CustomerRefund;

DROP INDEX IF EXISTS orderDateSearch ON CustomerOrder;
DROP INDEX IF EXISTS purchaseDateSearch ON purchaseDateSearch;
DROP INDEX IF EXISTS refundDateSearch ON CustomerRefund;
DROP INDEX IF EXISTS tagNameSearch ON Tag;

CREATE UNIQUE INDEX orderDateSearch
ON CustomerOrder(OrderDate)
USING BTREE;

CREATE INDEX purchaseDateSearch
ON EmployeePurchase(PurchaseDate)
USING BTREE;

CREATE INDEX refundDateSearch
ON CustomerRefund(RefundDate)
USING BTREE;

CREATE INDEX CategoryItemSearch
ON Categorization(ItemId)
USING BTREE;

CREATE INDEX CategoryTagSearch
ON Categorization(TagId)
USING BTREE;
