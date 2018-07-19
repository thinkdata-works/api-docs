---
title: The Namara API

language_tabs: # must be one of https://git.io/vQNgJ
  - shell: cURL
  - python
  # - javascript: JS

toc_footers:
  - <a href='https://app.namara.io/#/' target='_blank' rel='noreferrer noopener'>Go to Namara</a>

includes:
  # - errors

search: true
---

# Introduction

If you're looking to manipulate the Namara API, you've come to the right place. This guide will cover instructions and conventions for using our API, with language-specific examples.

### Our REST API

The Namara API is a REST-based service that accepts and returns `json` in most cases (we'll cover response format later). Requests should be made to:

<code>https://{namara api host}/v0/{endpoint}</code>

Unless instructed otherwise, the Namara API host is `api.namara.io`, which will be used for the duration of the documentation. 

The responses will be outlined for each endpoint.

##<div class="colour-pill"><span class="get">GET</span> Generic Endpoint</div>

>https://api.namara.io/v0/:endpoint

This is a generic endpoint, and the foundation of almost every typical call to our API. The chart below displays standard response codes:

Response | Description
-------- | -----------
200: OK | Success
202: Accepted | A background job has successfully been triggered. Continue polling for details.
401: Unauthorized | The API key you provided doesn't correspond to any user.
403: Forbidden | User is not authorized to make that request.
422: Unprocessable Entity | The server was unable to save the document. There will be more details in the full response body.
429: Too Many Requests | User has exceeded the monthly maximum for requests or downloads (see <a href="#rate-limiting">Rate Limiting</a>).

## API Keys

Three kinds of API Keys can be created for accessing the Namara API - *Organization Keys*, *Project Keys*, and *Personal Keys*. This is an overview of managing all three types, and we'll outline the different use cases for each.

### Organization API Keys

For any non-personal Organization, visit the "Settings" tab and create API Keys for that Organization. Calls made with this API Key will be limited to Data Sets and Projects that your Organization has access to.

### Project API Keys

For any project, visit the "Settings" tab and create API Keys for yourself for that Project. Calls made with this API Key will be limited to Data Sets that your Project has access to.

### Personal API Keys

The Personal Namara API Key can be obtained by clicking on the Organization tab at the bottom of the left sidebar, then clicking "Account Settings". Copy this from the "API Key" tab and use it for any API calls.

<aside class="warning">Your Personal Key gives API access to the entire Namara account. If you are thinking about sharing an API Key with another user, consider an Organization API Key or a Project API Key in order to limit their access to your account.</aside>

### Rate Limiting

<!-- check to see if this should go to an email or to the contact page on namara marketing -->

Users are limited to 10,000 requests per month, as well as 100 data set downloads per month. If you exceed this limit, the API will return `status: 429`. If you find yourself meeting the limits, <a href="mailto:sales@namara.io" target="_blank" rel="noreferrer noopener">VERIFY THIS EMAIL</a> to find a solution.
 
# Making Requests

## Parameter Authentication

```shell
curl -XGET https://api.namara.io/v0/data_sets/:data_set_id?api_key=YOUR_API_KEY

  or

curl -i \
-H "Accept: application/json" \
-X POST -d "api_key":"YOUR_API_KEY","query":"..." \
https://api.namara.io/v0/query
```

Append the key as `api_key` to any request body (either `GET` or `POST`) as long as it can be read from the base level params.
<!-- I'm unclear on what this means and therefore it might warrant explanation -->

## Header Authentication

Append the key to the headers by adding `"X-API-Key":"YOUR_API_KEY"`

## Testing Authentication

Here's how to verify your API Key:

###<div class="colour-pill"><span class="get">GET</span> Verify API Key</div>

Ping the API at `http://api.namara.io/v0/users/verify_token` to ensure that the API token is valid for the user. You don't have to pass `api_key` into the URL - you can pass it in through the headers.

>1)
`{ "status": true }`

>2)
`{ "status": false }`

Response | Description
-------- | -----------
200: OK | The API Key is valid (*example 1*)
422: Unprocessable Entity | API does not correspond to any user (*example 2*)

# Data API

> https://:namara_api_host/v0/data_sets/:data_set_id/data/:version

Here, we'll outline the specifications for accessing the Data API. Each data set can be accessed at the API URL. In Namara, click on the "API Info" tab when viewing a data set to see all information regarding ID, version, and properties.

##<div class="colour-pill"><span class="get">GET</span> Data Query</div>

> https://api.namara.io/v0/data_sets/:data_set_id/data/:version

A useful feature is the ability to query a data set by passing in parameters. The query parameters are optional; `data_set_id` and `version` are *path parameters* and **must** be in the call. Here are the ways in which you can manipulate the response:

Parameters | Type | Description
---------- | ---- | -----------
data_set_id (required) | `string` | UUID for accessing the data set
version (required) | `string` | Version identifier, eg: `en-0`
result_format | `string` | Query response format: `csv`, `json`, or `geojson` (default is `json`)
geometry_format | `string` | Either `wkt` or `geojson` for all geometry values (default is `geojson`)
geojson_feature_key | `string` | Property name to use as geometry when rendering `geojson`
limit | `integer` | Number of rows to return - the default value is also the maximum: 250 (see <a href="#pagination">Pagination</a>)
offset | `integer` | Results will be returned starting at the row number specified (see <a href="#pagination">Pagination</a>)
select | `string` | Comma-separated list of column names to return
order | `string` | Specify the order of the returned results (see <a href="#ordering">Ordering</a>)
where | `string` | Conditions for performing query (see <a href="#conditions">Conditions</a>)

<!-- ## Response and Results -->

## Pagination

Each query response is limited to 250 results. To view entire response either use the `export` endpoint to render the results of the query, or use `limit` and `offset` arguments to paginate over results, until no more values are found. 

## Ordering

> ...&order=p0 ASC

Pass in either `ASC` or `DESC` after specifying a column to see results in ascending or descending order, respectively.

## Conditions

The `where` argument supports a number of comparison operators and geospatial functions:

Symbol | Alias | Description | Use
------ | ----- | ----------- | ---
= | eq | Returns an exact, case-sensitive match of the value. | `p0=100` `p3 eq '2015-01-06'`
!= | neq | Returns an exact, case-sensitive match of the value. | `p0!=50` `p3 neq '2016-07-16'`
\> | gt | Works for numerical, date and datetime values. | `p0>100` `p0 gt '2010-01-01'`
\>= | gte | Works for numerical, date and datetime values. | `p0>=75` `p0 gte '2010-01-01'`
\< | lt | Works for numerical, date and datetime values. | `p0<200` `p0 lt '2018-04-01'`
\<= | lte | Works for numerical, date and datetime values. | `p0<=150` `p0 lte '2017-11-01'`
IS |  | Only works for boolean values. | `p1 IS true` `p1 IS NULL`
IS NOT |  | Only works for boolean values. | `p1 IS NOT true` `p1 IS NOT NULL`
LIKE |  | `%` = wildcard. Case-insensitive. | `p2 LIKE '%foo%'`
NOT LIKE |  | `%` = wildcard. Case-insensitive. | `p2 NOT LIKE '%foo%'`
IN |  | Works for values in a specified list of items. | `p0 IN (100, 'foo', true)`

<aside class="notice">Note the spaces around the aliases in the queries.</aside>

## Operator Examples

>1) <code>https://api.namara.io/v0/data_sets/057d7914-839e-4625-b8f8-2aa109f11e5a/data/en-3?api_key={YOUR_API_KEY}&where=co2_emissions_g_km<200</code> <br/>**or**<br/><code>https://api.namara.io/v0/data_sets/057d7914-839e-4625-b8f8-2aa109f11e5a/data/en-3?api_key={YOUR_API_KEY}&where=co2_emissions_g_km lt 200</code><br/><br/>2a) <code>https://api.namara.io/v0/data_sets/057d7914-839e-4625-b8f8-2aa109f11e5a/data/en-3?api_key={YOUR_API_KEY}&where=make IN ("CHEVROLET","CADILLAC")</code><br/><br/>
2b)
<code>https://api.namara.io/v0/data_sets/057d7914-839e-4625-b8f8-2aa109f11e5a/data/en-3?api_key={YOUR_API_KEY}&where=make="CHEVROLET" OR make="CADILLAC"</code><br/><br/>3) <code>https://api.namara.io/v0/data_sets/057d7914-839e-4625-b8f8-2aa109f11e5a/data/en-3?api_key={YOUR_API_KEY}&where=(make="CHEVROLET" OR make="CADILLAC") AND (fuel_consumption_city_l_100km<=12 AND fuel_consumption_hwy_l_100km<=9)</code>

  1. List all vehicles with CO<sub>2</sub> emissions less than 200g/km

  2. a) Get fuel consumption ratings for all Cadillac and Chevrolet vehicles
  
      b) The same operation with boolean operators
  
  3. List all Cadillac and Chevrolet vehicles with good city and highway mileage

  *Example 3* is a more complex query with multiple conditions while explicitly specifying the evaluation order.

## Geospatial Operators

Data Sets will commonly contain `latitude` and `longitude` as properties.

The `where` condition query parameter supports some geospatial functions for querying data sets.

## Geospatial Operator Examples

```
1) ...&where=nearby(p3, 43.653226, -79.3831843, 10km)

2) ...&where=bbox(p3, 43.5810245, -79.639219, 43.8554579, -79.11689699)
```

*Example 1* will return all rows whose specified column is within `radius` distance of the point specified by `latitude` and `longitude`. 

*Example 2* will return all rows whose specified column lies within the bounding box created by the two coordinates.

# Export

Exporting is almost identical the Data Query endpoint, with the difference being that the complete result of the query will be saved to a file, and that file will be served up.

##<div class="colour-pill"><span class="get">GET</span> Export</div>

### Request

>https://api.namara.io/v0/data_sets/:data_set_id/data/:version/export

Export path and query parameters look a lot like the parameters for accessing the data set. Let's look at the requests you can make:

Parameters | Type | Description
---------- | ---- | -----------
data_set_id (required) | `string` | UUID for accessing the data set
version (required) | `string` | Version identifier, eg: `en-0`
result_format | `string` | Query response format: `csv`, `json`, or `geojson` (default is `json`)
geometry_format | `string` | Either `wkt` or `geojson` for all geometry values (default is `geojson`)
geojson_feature_key | `string` | Property name to use as geometry when rendering `geojson`
compress_with | `string` | Compression options for final export (<a href="#compression-options">Compression Options</a>)
limit | `integer` | Number of rows to export
offset | `integer` | Results will be returned starting at the row number specified (see <a href="#pagination">Pagination<a/>)
select | `string` | Comma-separated list of column names to return
order | `string` | Specify the order of the returned results (see <a href="#ordering">Ordering</a>)
where | `string` | Conditions for performing query (see <a href="#conditions">Conditions</a>)

### Response

```
1)
  {
    "message": "Exported",
    "url": "<url to file>",
    "compressed_with": "none"
  }

2)
  { "message": "Pending" }

3)
  {
    "message": "Failed",
    "error_message": "<reason for error>"
  }
```

Here are the responses you can expect:

Response | Description
-------- | -----------
200: OK | When the export has finished and redirect is not set (*example 1*)
202: Accepted | When the export has begun (*example 2*)
422: Unprocessable Entity | Failed to export (*example 3*)

## Compression Options

Our API supports `gzip` and `zip` compression from levels 1-9. Specify parameters this way:

<code>...&compress_with=gzip-9</code>

The default compression level is 6 and the default compression type `zip`.

# Aggregation

Use aggregation functions to retrieve data set-level information.

##<div class="colour-pill"><span class="get">GET</span> Aggregate</div>

>https://api.namara.io/v0/data_sets/:data_set_id/data/:version/aggregation

### Request

Parameter | Type | Description
--------- | ---- | -----------
data_set_id (required) | `string` | UUID for accessing the data set
version (required) | `string` | Version identifier, eg. `en-0`
operation (required) | `string` | Operation function to perform (see <a href="#operations">Operations</a>)
where | `string` | Conditions for performing query (see <a href="#conditions">Conditions</a>)

## Response

Response | Description
-------- | -----------
200: OK |

## Operations

Function | Description | Use
-------- | ----------- | ---
count | The number of rows of data. If a property key is specified instead of *, this will only count the rows where the given property is not null. | `count(*)` `count(p0)`
sum | The sum of all values in a column | `sum(p0)`
avg | The average of all values in a column | `avg(p0)`
min | The minimum value in a column | `min(p0)`
max | The maximum value in a column | `max(p0)`

## Operator Examples

>1) <code>https://api.namara.io/v0/data_sets/057d7914-839e-4625-b8f8-2aa109f11e5a/data/en-3/aggregation?api_key={YOUR_API_KEY}&operation=avg(co2_emissions_g_km)&where=make="CADILLAC"</code>

>2) <code>https://api.namara.io/v0/data_sets/057d7914-839e-4625-b8f8-2aa109f11e5a/data/en-3/aggregation?api_key={YOUR_API_KEY}&operation=min(co2_emissions_g_km)&where=make="CADILLAC"</code>

>3) <code>https://api.namara.io/v0/data_sets/057d7914-839e-4625-b8f8-2aa109f11e5a/data/en-3/aggregation?api_key={YOUR_API_KEY}&operation=count(*)&where=make="CADILLAC"</code>

1. Reveals the average CO<sub>2</sub> emissions of Cadillac vehicles

2. Reveals the Cadillac vehicle with the least CO<sub>2</sub> emission

3. Reveals the Cadillac vehicles that have emissions data

# Query API

While the Data API allows query behaviour over a single data set, the Query API allow broader control over the Namara data catalog.

This API supports **NiQL** (the **N**amara **i**o **Q**uery **L**anguage), a language for viewing, aggregating, and joining data sets. It's very similar to SQL, so don't worry - no new textbooks.

##<div class="colour-pill"><span class="get">GET</span> Meta</div>

>https://api.namara.io/v0/query/meta

```
{
  "query_limit_maximum": 250,
  "formats": ["geojson", "csv", "json"],
  "default_format": "json"
}
```

This endpoint provides the meta information for querying this Namara instance. It includes the maximum limit per query, the supported formats, and the default format if none is specified. This information may differ, depending on which deployment of Namara you're using. 

##<div class="colour-pill"><span class="post">POST</span> Query</div>

>https://api.namara.io/v0/query.:format

A call here dispatches a query and returns the result.

### Request

Parameter | Type | Description
--------- | ---- | -----------
format | `string` | Query response format: `csv`, `json`, or `geojson` (default is `json`)
project_id | `string` | Project ID to use for subscription lookup. If not provided, it is inferred from API Key
organization_id | `string` | Organization ID to use for subscription lookup. If not provided, it is inferred from API Key
query (required) | `string` | NiQL query string
geojson_feature_key (may be required) | `string` | Property name to use as geometry when rendering `geojson`

The <code>geojson_feature_key</code> is required if the requested format is <code>geojson</code> - otherwise, it is not needed.

### Response

### 200: OK

Query executed successfully.

<button class="see-json">json</button> 
<button class="see-csv">csv</button> 
<button class="see-geojson">geojson</button> 

<div class="center-column response-json"></div>
```
json 
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
csv
  c0,c1,c2,c3
  foo,22,xx,POINT (-79.4 43.7)
  bar,66,yy,POINT (-78.4 42.7)
  baz,11,xx,POINT (-70.4 35.7)
```

<div class="center-column response-geojson"></div>
```
geojson
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

<!-- placeholder to stop divs from colliding -->
<div class="response-json"></div>
<div></div>
<!-- end placeholder -->

### 422: Unprocessable Entity

Something went wrong with the request.

<div class="center-column"></div>
```
{ "error": <Error message> }
```
# Query Specification

**NiQL** is modelled after standard SQL, but only supports read-only `SELECT` statements. A traditional query must at minimum have a `SELECT` and `FROM` clause in order to execute. While the `SELECT` clause can be anything, the `FROM` clause must specify a data set and version to query. 

For example, if we were looking to query a data set with an id of `2a6412c0-b3c9-420e-9487-abd21b664ac1` and the version `en-1`, our minimum query would be:

<code>SELECT *<br/>
FROM "2a6412c0-b3c9-420e-9487-abd21b664ac1/en-1" AS BramptonHomes</code>

The parser will verify the table name and handle queries that reference it, but using aliases and quotes whenever possible is recommended.

Below is a summary of supported features:

## SELECT Features


### COUNT

<div class="center-column"></div>
```sql
{
  SELECT COUNT(* | column1)
  FROM data-set-id/en-0
}
```

### DISTINCT

<div class="center-column"></div>
```sql
{
  SELECT DISTINCT column1, column2
  FROM data-set-id/en-0
}
```

### COUNT DISTINCT

<div class="center-column"></div>
```sql
{
  SELECT COUNT(DISTINCT column1)
  FROM data-set-id/en-0
}
```

### MIN AND MAX

<div class="center-column"></div>
```sql
{
  SELECT MIN(column1) AS minColumn1, MAX(column2) AS maxColumn2
  FROM data-set-id/en-0
}
```

### AVG AND SUM

<div class="center-column"></div>
```sql
{
  SELECT AVG(column1) AS avgColumn1, SUM(column1) AS sumColumn1
  FROM data-set-id/en-0
}
```

## FROM Features

### JOINS

<div class="center-column"></div>
```sql
{
  SELECT DataSet1.id, DataSet1.city, DataSet2.country
  FROM data-set-id/en-0 AS DataSet1 INNER JOIN data-set-id2/en-1 AS DataSet2
  ON DataSet1.foreign_id = DataSet2.external_id
}
```

Supports:

* INNER JOIN
* RIGHT [OUTER] JOIN
* LEFT [OUTER] JOIN
* Implicit joins

### UNIONS

<div class="center-column"></div>
```sql
{
  SELECT id
  FROM data-set-id/en-0
  UNION [ALL]
  SELECT objectid
  FROM data-set-id2/en-1
}
```

## WHERE Features


### Conditions

<div class="center-column"></div>
```sql
{
  SELECT id, address, city, province, country
  FROM data-set-id/en-0
  WHERE (country = 'Canada' AND province = 'Manitoba' AND NOT city = 'Winnipeg') OR country ='Mexico'
}
```

### LIKE

<div class="center-column"></div>
```sql
{
  SELECT *
  FROM data-set-id/en-0
  WHERE country LIKE 'C_%'
}
```

### ORDER BY

<div class="center-column"></div>
```sql
{
  SELECT *
  FROM data-set-id/en-0
  ORDER BY country, province, ... [ASC|DESC]
}
```

### IN

<div class="center-column"></div>
```sql
{
  SELECT *
  FROM data-set-id/en-0
  WHERE country IN ('Mexico', 'Canada', ...)
}
```

### BETWEEN

<div class="center-column"></div>
```sql
{
  SELECT *
  FROM data-set-id/en-0
  WHERE liquidation_date BETWEEN 2016-01-01 AND 2018-01-01
}
```

## GROUP BY and HAVING

<div class="center-column"></div>
```sql
{
  SELECT COUNT(customer_id), country
  FROM data-set-id/en-0
  GROUP BY country
  HAVING COUNT(customer_id) > 100 
}
```

### Subselects

<div class="center-column"></div>
```sql
{
  SELECT *
  FROM data-set-id/en-0
  WHERE total_count = [ANY|ALL] (SELECT COUNT(customer_id) FROM data-set-id2/en-1)
}
```

<div class="center-column"></div>
```sql
{
  SELECT *
  FROM (SELECT customer_id, parent_account_id, purchase_total FROM data-set-id2/en-1)
  AS subSelect
  WHERE purchase_total > 1500
}
```
  
## Geospatial Features

Geometry properties for data sets are stored as `geojson`, and will be rendered as that unless specified. You can do this using the transformation functions `ST_GeomFromText` to create geometry objects, which can then be manipulated and transformed. Use `ST_AsGeoJSON` or `ST_AsText` in order to turn the final result back to text from binary.  

Example (where `geometry_property` is a property from the data set of type geometry. This information can be obtained in the API Info tab when viewing a data set):

<code>SELECT ST_AsGeoJSON(ST_GeomFromText(geometry_property))<br/>FROM data-set-id/en-0</code>

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

We are very interested in expanding the geospatial capabilities of **NiQL**. If there is additional functionalities, or issues with the the implementations, please do not hesitate to <a href="https://namara.io/contact" target="_blank" rel="noreferrer noopener">reach out to us</a>.

<aside class="notice">Please refer to the <a href="https://postgis.net/docs/" target="_blank" rel="noreferrer noopener">PostGIS documentation</a> for the functional specifics</aside>

## Pagination

Like the Data API, a maximum number of rows will be returned on each query. If the query string does not contain `LIMIT X OFFSET Y`, the parser will append the maximum number of allowable rows in order to enforce the limit.

For results, larger than the allowed amount, manual pagination in subsequent requests will have to be used.

The default maximum limit is `250` rows, but this may vary depending on which deployment of Namara you are interacting with. Refer to the <a href="#get-meta">Meta endpoint</a> for instructions on how to obtain this information.


# Get In Touch

It's easy to get in contact with us. Visit our <a href="https://namara.io/contact" target="_blank" rel="noreferrer noopener">contact page</a>, or from within <a href="https://app.namara.io/#/" target="_blank" rel="noreferrer noopener">Namara</a> by using the button in the bottom right. Please get in touch with us if you:

* are experiencing any problems with the API;
* would like to increase your request or download limit;
* are looking for clarifications on the instructions;
* notice any mistakes in our documentation; or 
* would like to send us any feedback.

We would love to hear from you!