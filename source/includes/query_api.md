# Query API (beta)

While the Data API allows query behaviour over a single data set, the Query API allows broader control over the Namara data catalog. This is a new API that will eventually replace the Data API. We wrote **NiQL** (**N**amara.<strong>i</strong>o **Q**uery **L**anguage) to view, aggregate, and join data sets. It's very similar to SQL, so it's easy to manipulate.

<aside class="notice">This feature is currently in beta - to request early access, <a href="https://namara.io/contact/" rel="noopener noreferrer" target="_blank">contact us</a>.</aside>

##<div class="colour-pill"><span class="get">GET</span> Meta</div>

>https://api.namara.io/v0/query/meta

```
{
  "query_limit_maximum": 250,
  "formats": ["geojson", "csv", "json"],
  "default_format": "json"
}
```

This endpoint provides the meta information for querying this Namara instance. It includes the limit per query, the supported formats, and the default format if none is specified. This information may differ, depending on which deployment of Namara you're using. 

##<div class="colour-pill"><span class="post">POST</span> Query</div>

>https://api.namara.io/v0/query.{FORMAT}

A call here dispatches a query and returns the result.

### Request

Parameter | Type | Description
--------- | ---- | -----------
format | `string` | Query response format: `CSV`, `JSON`, or `GeoJSON` (default is `JSON`)
project_id | `string` | Project ID to use for subscription lookup. If not provided, it is inferred from API Key
organization_id | `string` | Organization ID to use for subscription lookup. If not provided, it is inferred from API Key
query (required) | `string` | NiQL query string
geojson_feature_key (may be required) | `string` | Property name to use as geometry when rendering `GeoJSON`

The <code>geojson_feature_key</code> is required if the requested format is <code>GeoJSON</code> - otherwise, it is not needed.

### Responses

### 200: OK

Query executed successfully.

<button class="see-json">JSON</button> 
<button class="see-csv">CSV</button> 
<button class="see-geojson">GeoJSON</button> 

<div class="center-column response-json"></div>
```
  {
    "results":[
      {
        "c0":"foo",
        "c1":22,
        "c2":"xx",
        "c3":"POINT (-79.4 43.7)"
      },
      ...
    ]
  }
```

<div class="center-column response-csv"></div>
```
  c0,c1,c2,c3
  foo,22,xx,POINT (-79.4 43.7)
  bar,66,yy,POINT (-78.4 42.7)
  baz,11,xx,POINT (-70.4 35.7)
```

<div class="center-column response-geojson"></div>
```
  {
    "type":"FeatureCollection",
    "features":[
      {
        "type":"Feature",
        "geometry":{
          "type":"Point",
          "coordinates": [ -79.4, 43.7 ]
        },
        "properties":{
          "c0":"foo",
          "c1":22,
          "c2":"xx"
        }
      },
      ...
    ]
  }
```

### 422: Unprocessable Entity

Something went wrong with the request.

<div class="center-column"></div>
```
{ "error": <Error message> }
```
## Query Specification

**NiQL** is modelled after standard SQL, but only supports read-only `SELECT` statements. A traditional query must at minimum have a `SELECT` and `FROM` clause in order to execute. While the `SELECT` clause can be anything, the `FROM` clause must specify a data set and version to query. 

```shell
curl -i \
-H "Content-Type: application/json" \ 
-H "X-API-Key: {YOUR_API_KEY}" \ 
-X POST \ 
-d '{"query": "SELECT * FROM 2a6412c0-b3c9-420e-9487-abd21b664ac1/en-1 AS BramptonHomes"}' \ 
https://api.namara.io/v0/query.json
```

For example, if we were looking to query a data set with an id of `2a6412c0-b3c9-420e-9487-abd21b664ac1` and the version `en-1`, our minimum query would look like the example in the code column.

The parser will verify the table name and handle queries that reference it, but using aliases and quotes whenever possible is recommended.

Below is a summary of supported features:

## SELECT Features


### COUNT

<div class="center-column"></div>
```sql
  SELECT COUNT(*)
  FROM "data-set-id/en-0"

  SELECT COUNT(column1)
  FROM "data-set-id/en-0"
```

### DISTINCT

<div class="center-column"></div>
```sql
  SELECT DISTINCT column1, column2
  FROM "data-set-id/en-0"
```

### COUNT DISTINCT

<div class="center-column"></div>
```sql
  SELECT COUNT(DISTINCT column1)
  FROM "data-set-id/en-0"
```

### MIN AND MAX

<div class="center-column"></div>
```sql
  SELECT MIN(column1) AS minColumn1, MAX(column2) AS maxColumn2
  FROM "data-set-id/en-0"
```

### AVG AND SUM

<div class="center-column"></div>
```sql
  SELECT AVG(column1) AS avgColumn1, SUM(column1) AS sumColumn1
  FROM "data-set-id/en-0"
```

## FROM Features

### JOINS

<div class="center-column"></div>
```sql
  SELECT DataSet1.id, DataSet1.city, DataSet2.country
  FROM "data-set-id/en-0" AS DataSet1 INNER JOIN "data-set-id2/en-1" AS DataSet2
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
  FROM "data-set-id/en-0"
  UNION
  SELECT objectid
  FROM "data-set-id2/en-1"
```

## WHERE Features


### Conditions

<div class="center-column"></div>
```sql
  SELECT id, address, city, province, country
  FROM "data-set-id/en-0"
  WHERE (country = 'Canada' AND province = 'Manitoba' AND NOT city = 'Winnipeg') OR country ='Mexico'
```

### LIKE

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id/en-0"
  WHERE country LIKE 'C_%'
```

### ORDER BY

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id/en-0"
  ORDER BY country, province, ... [ASC|DESC]
```

### IN

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id/en-0"
  WHERE country IN ('Mexico', 'Canada', ...)
```

### BETWEEN

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id/en-0"
  WHERE liquidation_date BETWEEN 2016-01-01 AND 2018-01-01
```

## GROUP BY and HAVING

<div class="center-column"></div>
```sql
  SELECT COUNT(customer_id), country
  FROM "data-set-id/en-0"
  GROUP BY country
  HAVING COUNT(customer_id) > 100 
```

### Subselects

<div class="center-column"></div>
```sql
  SELECT *
  FROM "data-set-id/en-0"
  WHERE total_count = [ANY|ALL] (SELECT COUNT(customer_id) FROM "data-set-id2/en-1")
```

<div class="center-column"></div>
```sql
  SELECT *
  FROM (SELECT customer_id, parent_account_id, purchase_total FROM "data-set-id2/en-1")
  AS subSelect
  WHERE purchase_total > 1500
```
  
## Geospatial Features

Geometry properties for data sets are stored as `GeoJSON`, and will be rendered as that unless instructed otherwise. You can do this using the transformation functions `ST_GeomFromText` to create geometry objects, which can then be manipulated and transformed. Use `ST_AsGeoJSON` or `ST_AsText` in order to turn the final result back to text from binary.  

Here's an example in which `geometry_property` is a property from the data set of type geometry (this information can be obtained in the API Info tab when viewing a data set):

<div class="center-column"></div>
```sql
  SELECT ST_AsGeoJSON(ST_GeomFromText(geometry_property))
  FROM "data-set-id/en-0"
```

### Supported Functions

>`ST_AsGeoJSON`<br/>
>`ST_AsJson`<br/>
>`ST_AsText`<br/>
>`ST_Buffer`<br/>
>`ST_Contains`<br/>
>`ST_Crosses`<br/>
>`ST_Difference`<br/>
>`ST_Disjoint`<br/>
>`ST_Distance`<br/>
>`ST_DWithin`<br/>
>`ST_Envelope`<br/>
>`ST_Equals`<br/>
>`ST_GeomFromText`<br/>
>`ST_GeomFromTextSrid`<br/>
>`ST_Intersects`<br/>
>`ST_Overlaps`<br/>
>`ST_PointFunc`<br/>
>`ST_Relate`<br/>
>`ST_Touches`<br/>
>`ST_Transform`<br/>
>`ST_Union`<br/>
>`ST_UnionAggregate`<br/>
>`ST_Within`<br/>
>`ST_XFunc`<br/>
>`ST_XMax`<br/>
>`ST_XMin`<br/>
>`ST_YFunc`<br/>
>`ST_YMax`<br/>
>`ST_YMin`<br/>

We are very interested in expanding the geospatial capabilities of **NiQL**. If there is additional functionality you need, or there are any issues with the the implementations, please do not hesitate to <a href="https://namara.io/contact" target="_blank" rel="noreferrer noopener">reach out to us</a>.

<aside class="notice">Please refer to the <a href="https://postgis.net/docs/reference.html" target="_blank" rel="noreferrer noopener">PostGIS documentation</a> for the functional specifics</aside>

## Pagination with **NiQL**

Like the Data API, a maximum number of rows will be returned on each query. If the query string does not contain `LIMIT X OFFSET Y`, the parser will append the maximum number of allowable rows in order to enforce the limit.

For results larger than the allowed amount, manual pagination in subsequent requests will have to be used.

The default limit is `250` rows, but this may vary depending on which deployment of Namara you are interacting with. Refer to the <a href="#get-meta">Meta endpoint</a> for instructions on how to obtain this information.