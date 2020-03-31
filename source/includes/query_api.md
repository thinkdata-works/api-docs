# Query API (NiQL)

To make querying our data catalog easier, we have created a query language Namara.io Query Language, or NiQL for short.
If you have used SQL in your past, you should fine this language very familiar as it was based off of standard SQL.  The
largest difference between NiQL and standard SQL is that the only supported queries start with the keyword `SELECT`.  
All keywords that mutate the underlying data such as `INSERT`, `UPDATE`, `DELETE`, etc. are not supported.

## Creating a Query

A query follow the basic form you would be familiar with in SQL.  

<div class="center-column"></div>
```sql
SELECT {columns} FROM {dataset_id} WHERE {condition} LIMIT {limit}
```

When using a dataset ID, it is possible to pass in either the dataset UUID on it's own, or 
optionally include a dataset version along with it.  For more information on dataset versions,
please see the [Dataset Versions](#dataset-versions) documentation.

Using a dataset id or including a version would look like so:

<div class="center-column"></div>
```sql
SELECT ... FROM "de1049a3-e356-4251-b8f9-7a628b8b3b97"
SELECT ... FROM "de1049a3-e356-4251-b8f9-7a628b8b3b97/0"
```

## SELECT Features


### COUNT

<div class="center-column"></div>
```sql
  SELECT COUNT(*)
  FROM "data-set-id"

  SELECT COUNT(column1)
  FROM "data-set-id"
```

### DISTINCT

<div class="center-column"></div>
```sql
  SELECT DISTINCT column1, column2
  FROM "data-set-id"
```

### COUNT DISTINCT

<div class="center-column"></div>
```sql
  SELECT COUNT(DISTINCT column1)
  FROM "data-set-id"
```

### MIN AND MAX

<div class="center-column"></div>
```sql
  SELECT MIN(column1) AS minColumn1, MAX(column2) AS maxColumn2
  FROM "data-set-id"
```

### AVG AND SUM

<div class="center-column"></div>
```sql
  SELECT AVG(column1) AS avgColumn1, SUM(column1) AS sumColumn1
  FROM "data-set-id"
```

## FROM Features

### JOINS

<div class="center-column"></div>
```sql
  SELECT DataSet1.id, DataSet1.city, DataSet2.country
  FROM "data-set-id" AS DataSet1 INNER JOIN "data-set-id2" AS DataSet2
  ON DataSet1.foreign_id = DataSet2.external_id
```

<br />
Supports:

* INNER JOIN
* RIGHT [OUTER] JOIN
* LEFT [OUTER] JOIN
* Implicit joins

### UNIONS

<div class="center-column"></div>
```sql
  SELECT id
  FROM "data-set-id"
  UNION
  SELECT objectid
  FROM "data-set-id2"
```

## WHERE Features


### Conditions

<div class="center-column"></div>
```sql
  SELECT id, address, city, province, country
  FROM "data-set-id"
  WHERE (country = 'Canada' AND province = 'Manitoba' AND NOT city = 'Winnipeg') OR country ='Mexico'
```

### LIKE

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id"
  WHERE country LIKE 'C_%'
```

### ORDER BY

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id"
  ORDER BY country, province, ... [ASC|DESC]
```

### IN

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id"
  WHERE country IN ('Mexico', 'Canada', ...)
```

### BETWEEN

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id"
  WHERE liquidation_date BETWEEN 2016-01-01 AND 2018-01-01
```

## GROUP BY and HAVING

<div class="center-column"></div>
```sql
  SELECT COUNT(customer_id), country
  FROM "data-set-id"
  GROUP BY country
  HAVING COUNT(customer_id) > 100 
```

### Subselects

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id"
  WHERE total_count = [ANY|ALL] (SELECT COUNT(customer_id) FROM "data-set-id2")
```

<div class="center-column"></div>
```sql
  SELECT *
  FROM (SELECT customer_id, parent_account_id, purchase_total FROM "data-set-id2")
  AS subSelect
  WHERE purchase_total > 1500
```
  
## Geospatial Features

Geometry properties for data sets are stored as `GeoJSON`, and will be rendered as that unless instructed otherwise. You can do this using the transformation functions `ST_GeomFromText` to create geometry objects, which can then be manipulated and transformed. Use `ST_AsGeoJSON` or `ST_AsText` in order to turn the final result back to text from binary.  

Here's an example in which `geometry_property` is a property from the data set of type geometry (this information can be obtained in the API Info tab when viewing a data set):

<div class="center-column"></div>
```sql
  SELECT ST_AsGeoJSON(ST_GeomFromText(geometry_property))
  FROM "data-set-id"
```

### Supported Functions

<div class="center-column"></div>
```
ST_AsGeoJSON
ST_AsJson
ST_AsText
ST_Buffer
ST_Contains
ST_Crosses
ST_Difference
ST_Disjoint
ST_Distance
ST_DWithin
ST_Envelope
ST_Equals
ST_GeomFromText
ST_GeomFromTextSrid
ST_Intersects
ST_Overlaps
ST_PointFunc
ST_Relate
ST_Touches
ST_Transform
ST_Union
ST_UnionAggregate
ST_Within
ST_XFunc
ST_XMax
ST_XMin
ST_YFunc
ST_YMax
ST_YMin
```

We are very interested in expanding the geospatial capabilities of **NiQL**. If there is additional functionality you need, or there are any issues with the the implementations, please do not hesitate to <a href="https://www.thinkdataworks.com/contact" target="_blank" rel="noreferrer noopener">reach out to us</a>.

<aside class="notice">Please refer to the <a href="https://postgis.net/docs/reference.html" target="_blank" rel="noreferrer noopener">PostGIS documentation</a> for the functional specifics</aside>

## Pagination with **NiQL**

Like the Data API, a maximum number of rows will be returned on each query. If the query string does not contain `LIMIT X OFFSET Y`, the parser will append the maximum number of allowable rows in order to enforce the limit.

For results larger than the allowed amount, manual pagination in subsequent requests will have to be used.

The default limit is `250` rows, but this may vary depending on which deployment of Namara you are interacting with. Refer to the <a href="#get-meta">Meta endpoint</a> for instructions on how to obtain this information.
