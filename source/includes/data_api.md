# Data API

> https://:namara_api_host/v0/data_sets/:data_set_id/data/:version

Each data set can be accessed at the API URL. In Namara, click on the "API Info" tab when viewing a data set to see all information regarding ID, version, and properties.

##<div class="colour-pill"><span class="get">GET</span> Data Query</div>

> https://api.namara.io/v0/data_sets/:data_set_id/data/:version

This endpoint is used for creating selection and aggregation views on a single data set. For full SQL access to the Namara catalog, see the <a href="#query-api">Query API</a>.

Path Parameters | Type | Description
---------- | ---- | -----------
data_set_id (required) | `string` | UUID for accessing the data set
version (required) | `string` | Version identifier, eg: `en-0`

Query Parameters | Type | Description
---------------- | ---- | -----------
result_format | `string` | Query response format: `csv`, `json`, or `geojson` (default is `json`)
geometry_format | `string` | Either `wkt` or `geojson` for all geometry values (default is `geojson`)
geojson_feature_key | `string` | Property name to use as geometry when rendering `geojson`
limit | `integer` | Number of rows to return - the default value is also the maximum: 250 (see <a href="#pagination">Pagination</a>)
offset | `integer` | Results will be returned starting at the row number specified (see <a href="#pagination">Pagination</a>)
select | `string` | Comma-separated list of column names to return
order | `string` | Specify the order of the returned results (see <a href="#ordering">Ordering</a>)
where | `string` | Conditions for performing query (see <a href="#conditions">Conditions</a>)

## Result Formats

The Namara Data API produces results in different formats, `json`, `csv`, or `geojson`, depending on the value you pass into the `result_format` parameter in your query. In examples of results, you'll see three buttons above the code block which will show example results in your preferred format. Here's how they look:

<button class="see-json">json</button> 
<button class="see-csv">csv</button> 
<button class="see-geojson">geojson</button> 

<div class="center-column response-json"></div>
```
  {
    "results":[
      {
        "c0":"format",
        "c1":"example"
      },
      ...
    ]
  }
```

<div class="center-column response-csv"></div>
```
  c0,c1
  format,example
```

<div class="center-column response-geojson"></div>
```
  {
    "type":"GeojsonResponseFormat",
    "features":[
      {
        "type":"Feature",
        "geometry":{
          "type":"Point",
          "coordinates": [ -79.4, 43.7 ]
        },
        "properties":{
          "c0":"format",
          "c1":"example"
        }
      },
      ...
    ]
  }
```

## Pagination

Each query response is limited to 250 results. To view the entire response, either use the `export` endpoint to render the results of the query, or use `limit` and `offset` arguments to paginate over results, until no more values are found. 

## Ordering

> ...&order=p0 ASC

Pass in either `ASC` or `DESC` after specifying a column to see results in ascending or descending order, respectively.

## Conditions

The `where` argument supports a number of comparison operators and geospatial functions:

Symbol | Alias | Description | Use
------ | ----- | ----------- | ---
= | eq | Returns an exact, case-sensitive match of the value | `p0=100` `p3 eq '2015-01-06'`
!= | neq | Returns an exact, case-sensitive match of the value | `p0!=50` `p3 neq '2016-07-16'`
\> | gt | Works for numerical, date and datetime values | `p0>100` `p0 gt '2010-01-01'`
\>= | gte | Works for numerical, date and datetime values | `p0>=75` `p0 gte '2010-01-01'`
\< | lt | Works for numerical, date and datetime values | `p0<200` `p0 lt '2018-04-01'`
\<= | lte | Works for numerical, date and datetime values | `p0<=150` `p0 lte '2017-11-01'`
IS |  | Only works for boolean values | `p1 IS true` `p1 IS NULL`
IS NOT |  | Only works for boolean values | `p1 IS NOT true` `p1 IS NOT NULL`
LIKE |  | `%` = wildcard, case-insensitive | `p2 LIKE '%foo%'`
NOT LIKE |  | `%` = wildcard case-insensitive | `p2 NOT LIKE '%foo%'`
IN |  | Works for values in a specified list of items | `p0 IN (100, 'foo', true)`

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

Data sets will commonly contain `latitude` and `longitude` as properties.

The `where` condition query parameter supports some geospatial functions for querying data sets.

## Geospatial Operator Examples

```
1) ...&where=nearby(p3, 43.653226, -79.3831843, 10km)

2) ...&where=bbox(p3, 43.5810245, -79.639219, 43.8554579, -79.11689699)
```

*Example 1* will return all rows in which the value in the specified column is within `radius` distance of the point specified by `latitude` and `longitude`. 

*Example 2* will return all rows in which the value in the specified column lies within the bounding box created by the two coordinates.

# Export

Exporting is almost identical to the Data Query endpoint, with the difference being that the complete result of the query will be saved to a file, and that file will be served up.

##<div class="colour-pill"><span class="get">GET</span> Export</div>

### Request

>https://api.namara.io/v0/data_sets/:data_set_id/data/:version/export

Export path and query parameters look a lot like the parameters for accessing the data set. Let's look at the requests you can make:

Path Parameters | Type | Description
--------------- | ---- | -----------
data_set_id (required) | `string` | UUID for accessing the data set
version (required) | `string` | Version identifier, eg: `en-0`

Query Parameters | Type | Description
---------------- | ---- | -----------
result_format | `string` | Query response format: `csv`, `json`, or `geojson` (default is `json`)
geometry_format | `string` | Either `wkt` or `geojson` for all geometry values (default is `geojson`)
geojson_feature_key | `string` | Property name to use as geometry when rendering `geojson`
compress_with | `string` | Compression options for final export (see <a href="#compression-options">Compression Options</a>)
limit | `integer` | Number of rows to export
offset | `integer` | Results will be returned starting at the row number specified (see <a href="#pagination">Pagination<a/>)
select | `string` | Comma-separated list of column names to return
order | `string` | Specify the order of the returned results (see <a href="#ordering">Ordering</a>)
where | `string` | Conditions for performing query (see <a href="#conditions">Conditions</a>)

### Responses

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

## Responses

Response | Description
-------- | -----------
200: OK | Success

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