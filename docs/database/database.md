# Blue Skies

## Tables

#### users

- userId (int)
- email (string)
- password (string)
- userRole (int)

```json

"user" : {
    "user_id" : 0,
    "email": "1234567@gmail.com",
    "password": "KjghhKgLKHJgJLkhg9868yb697856f97v690vjhoH9766fh*7", // hashed and salted password
    "bio" : "1",
}

```

#### systems

- systemId (int)
- systemName (string)
- powerRating (int)
- surfaceArea (int)
- cost (int)
- batteryLife (int)

```json

"system" : {
    "systemId" : 1,
    "systemName" : "sun absorber 200",
    "powerRating" : 2000,
    "surfaceAre" : 60,
    "cost" : 300000.00,
    "batteryLife" : 100,
}

```

#### reports
- reportId (int)
- userId (int)
- systemId (int)
- solarScore (int)
- latitude (int)
- longitude (int)
- light (int)
- batteryLife (int)
- payOffTime (int)
- appliances (string)
- parameters (string)

```json

"report" : {
"reportId" : 0,
"userId" : 0,
"systemId" : 1,
"solarScore" : 67,
"latitude" : -34,
"longitude" : 18,
"light" : 60,
"batteryLife" : 90,
"payOffTime" : 108,
"appliances" : "toaster, kettle, fridge",
"parameters" : "light, batteryLife, payOffTime",
}

```

## Database setup

### Server

Azure sql server is used to host the database.
The server uses sql login authentication, to only allow certain users to access the database and to assign user roles to each user with differing amounts of access to the server.
Azure sql server also allows for the use of a firewall to block access to the server from certain ip addresses.
Azure spl server was chosen so that we can have a centralised database that can be used by all members of the team, and always have access to the latest and most up to date version of the database. This allows the team to work on the same database at the same time, without having to worry about merging different versions of the database.

### Database
Our database uses 3 tables in order for the end user to store  the results of their solar report.
The first table is the users table, which stores the user id, email, password and user role of each user.
The second table is the systems table, which stores the system id, system name, power rating, surface area, cost and battery life of each system. This table should only be accessed by the admin user.
The third table is the reports table, which stores the report id, user id, system id, solar score, latitude, longitude, light, battery life, pay off time, appliances and parameters of each report. userId and systemId are foreign keys that reference the users and systems tables respectively to show who the report belonds to and which system was used to generate the report.