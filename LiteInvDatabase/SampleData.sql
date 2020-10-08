INSERT INTO Customer (CustomerName, CustomerEmail) VALUES ('customer1', 'customer1@email.com');
INSERT INTO Customer (CustomerName, CustomerEmail) VALUES ('customer2', 'customer2@email.com');
INSERT INTO Customer (CustomerName, CustomerEmail) VALUES ('customer3', 'customer3@email.com');

INSERT INTO Employee (EmployeeName, EmployeeEmail) VALUES ('employee1', 'employee1@email.com');
INSERT INTO Employee (EmployeeName, EmployeeEmail) VALUES ('employee2', 'employee2@email.com');
INSERT INTO Employee (EmployeeName, EmployeeEmail) VALUES ('employee3', 'employee3@email.com');

INSERT INTO Seller (SellerName, SellerEmail) VALUES ('seller1', 'seller1@email.com');
INSERT INTO Seller (SellerName, SellerEmail) VALUES ('seller2', 'seller2@email.com');
INSERT INTO Seller (SellerName, SellerEmail) VALUES ('seller3', 'seller3@email.com');

INSERT INTO Tag (TagName) VALUES ('tag1');
INSERT INTO Tag (TagName) VALUES ('tag2');
INSERT INTO Tag (TagName) VALUES ('tag3');

INSERT INTO Inventory (ItemName, ItemCount) VALUES ('item1', 100);
INSERT INTO Inventory (ItemName, ItemCount) VALUES ('item2', 200);
INSERT INTO Inventory (ItemName, ItemCount) VALUES ('item3', 300);

INSERT INTO Categorization (ItemId, TagId) VALUES (1, 1);
INSERT INTO Categorization (ItemId, TagId) VALUES (1, 2);
INSERT INTO Categorization (ItemId, TagId) VALUES (1, 3);
INSERT INTO Categorization (ItemId, TagId) VALUES (2, 1);

INSERT INTO CustomerOrder (ItemId, CustomerId, EmployeeId, Amount, OrderDate) VALUES (1, 1, 1, 10, NOW());
INSERT INTO CustomerOrder (ItemId, CustomerId, EmployeeId, Amount, OrderDate) VALUES (1, 2, 1, 20, NOW());
INSERT INTO CustomerOrder (ItemId, CustomerId, EmployeeId, Amount, OrderDate) VALUES (2, 1, 2, 30, NOW());

INSERT INTO EmployeePurchase (ItemId, EmployeeId, SellerId, Amount, PurchaseDate) VALUES (1, 1, 1, 10, NOW());
INSERT INTO EmployeePurchase (ItemId, EmployeeId, SellerId, Amount, PurchaseDate) VALUES (1, 2, 1, 20, NOW());
INSERT INTO EmployeePurchase (ItemId, EmployeeId, SellerId, Amount, PurchaseDate) VALUES (2, 1, 2, 30, NOW());

INSERT INTO CustomerRefund (ItemId, CustomerId, EmployeeId, Amount, RefundDate) VALUES (1, 1, 1, 10, NOW());
INSERT INTO CustomerRefund (ItemId, CustomerId, EmployeeId, Amount, RefundDate) VALUES (1, 2, 1, 20, NOW());
INSERT INTO CustomerRefund (ItemId, CustomerId, EmployeeId, Amount, RefundDate) VALUES (2, 1, 2, 30, NOW());