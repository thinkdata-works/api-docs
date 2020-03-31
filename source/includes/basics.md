# API Introduction

If you're looking to interact with the Namara API, you've come to the right place. This guide will cover instructions 
and conventions for using our API, with language-specific examples.

## API Fundamentals

There is an API available for all functions that are available on the app itself is available on the `api` subdomain of 
the specific Namara deployment you use.  So if you are used to accessing Namara at `app.namara.io` then the API 
subdomain would be `api.namara.io`. Or if you use Namara on a custom domain, such as `app.custom-domain.com` then the
API would be available at `api.custom-domain.com`.

The API itself uses an RPC Framework called Twirp which was originally developed by Twitch.tv.  We decided to use Twirp
to build our API because it was not only easy and quick for us to develop on but very user friendly for anyone using it
as it offered very efficient communication using Protobuf or easier-to-use communication using JSON.  Fortunately, if
you are interfacing with Namara using a programming language we have support for, you don't even need to know about
the differences here as we have taken that for you.

Currently, we have supported libraries in Python, Ruby and Go with more being added all the time. If you are using a
programming language that we don't already support, don't hesitate to reach out to us and we can look at getting support
for it soon.  A few caveats if you are using an unsupported language or making requests directly are:
- This is not a REST API but is instead using RPC so everything is a POST request
- For making a request without a client library, it is recommended to use the JSON version of the API
- Endpoints always follow: `/twirp/<service>.<Service>Service/<method>`. So for example, when making the 
ListOrganizationDatasets API call from the Catalog service, the endpoint is 
`/twirp/catalog.CatalogService/ListOrganizationDatasets`.  An example using this service is shown in the 
[Creating the Client](#creating-the-client) section of the docs.

## Your API Key

Your individual API key is required to make requests to the Namara API and is available in the account section of the
app which is accessible if you click on the user section in the top right corner of the app, and then navigate to 
Account Settings > Token.  Please copy this token and store it in a secure location and do not share it with out users.

Your API key must be used when initializing the client for our supported languages, or to be passed in the HTTP header
`X-API-Key: YOUR_KEY` if you are commmunicating with the API directly or using the legacy API.


## Our Legacy API

TODO: Add Delorean docs

## Dataset Versions

Our data is updated regularly and automatically, so values in rows and columns may change. The dataset version is a 
snapshot of the data set's structure and properties. When that structure changes, we create a new version of the dataset. 

It is crucial that you include both the data set ID and the version in your queries. Both are found under the API tab 
for the data set.

## Temporary Header

```shell
# shell
```

```python
# python
```

```ruby
# ruby
```

```go
// go
```

# Getting Started

## Adding Packages

To the right you will see the various entries that will need to be added in the language specific package managers.

```shell

```

```python
# requirements.txt

```

```ruby
# Gemfile
 
gem "namara", github: "thinkdata-works/namara-ruby" 
```

```go
// go.mod

require github.com/thinkdata-works/namara-go v0.1.10
```

## Making a Request

The following examples show how to make a request using our Data API.  Please change the examples to the right to
include your API key as well as the specific query you are trying to make.  For more information about querying the
Data API, please see the [Data API](#data-api) section.

```shell
curl -H 'X-API-Key: <key>' \
    -H 'Content-type: application/json' \
    -d '{"statement": "SELECT ... FROM ..."}' \ 
    https://api.namara.io/twirp/query.QueryService/Query
```

```python
from namara_python.client import Client

namara = Client(
    api_key='YOUR_API_KEY',  
    auth_url='https://account.namara.io',
    api_url='https://api.namara.io'
)

res = namara.query_client().query(statement='SELECT ... FROM ...')
print(res)
```

```ruby
require "namara"

namara = Namara.new(domain: "namara.io")
namara.with_api_key!("YOUR_API_KEY")

resp = namara.query("SELECT ... FROM ...")
puts resp
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/thinkdata-works/namara-go"
)

func main() {
	client := namara.NewClient("namara.io", "YOUR_API_KEY")

	resp, err := client.Query(context.Background(), "SELECT ... FROM ...")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(resp)
}
```
