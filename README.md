## Requirement :->

User designation-based login, where admin should have all access to data R/W operations whereas supervisor
should have R/W operations on the assigned data tables.
APIs for Login, User Creation, Data Table CRUD operations and Data push to Api call.
Logging for each and every methods, triggers, requests and data CRUD operations.
Create dynamic table data with the help of joins and other calculation methods.
Code API for the tables provided below where supervisor can login -&gt; place order -&gt; edit/cancel order -
&gt; payment. And admin can login -&gt; view product table -&gt; CRUD (Price, ProductID, Product Name).

# Data Preparation :->

Master User Table :- (Userbase Creation)

ID, Username, Password, Designation, Assigned, Table, (ALL/Any One)

Derived Product Table :-Date Product
ID, Product Name, Quantity, Total Price, Paid(Y/N), Refund(Y/N)

Master Product + Price Table
Product ID Price
PID1 800
PID2 56
PID3 45
PID4 678
PID5 987
PID6 86

Master Product ID + Product Name Table
Product ID Product Name
PID1 App1
PID2 App2
PID3 App3
PID4 App4
PID5 App5
PID6 App6
