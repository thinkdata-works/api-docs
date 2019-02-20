# Advanced Features

## Version Locking

We have created **Version Locking** in the event that it's important to maintain the properties from a previous version of the data set. Simply add `/data/{VERSION}` after the data set ID for the Data API, or `/{VERSION}` after the data set ID for the Query API.

For example, if we needed the first version of the data set with the ID `2a6412c0-b3c9-420e-9487-abd21b664ac1`, our query to the Data API would read: 

<div class="center-column"></div>
```
https://api.namara.io/v0/data_sets/2a6412c0-b3c9-420e-9487-abd21b664ac1/data/en-0
```
<br />
Or, for the Query API:

<div class="center-column"></div>
```sql
FROM "2a6412c0-b3c9-420e-9487-abd21b664ac1/en-0"
```
<br />
Making a query to `https://api.namara.io/v0/data_sets/{DATA_SET_ID}` will allow you to see all imported versions for the data set.