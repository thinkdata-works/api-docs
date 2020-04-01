# API Introduction

If you're looking to interact with the Namara API, you've come to the right place. This guide will cover instructions 
and conventions for using our API, with language-specific examples.

## API Fundamentals

The Namara API is built on an RPC Framework called [Twirp](https://github.com/twitchtv/twirp). Twirp runs on Protobuf and offers JSON compatibility. It generates server files and client code in almost any language, making it quick and easy to develop on. This allows us to launch with a selection of client libraries, and will allow us to create additional language options over time.

### Client Library and Language Offerings

We primarily support Python, Ruby and Go libraries, but are planning on adding more all the time. If you are using a programming language that we don't already support, please don't hesitate to reach out to us.

### Pointing to a Namara Domain

An API provides all functionality available to the app itself. This is available on the `api` subdomain of whichever Namara deployment you are using.

If you are used to accessing Namara at `app.namara.io`, then your API subdomain would be `api.namara.io`. Otherwise, if you are using a custom domain such as `app.custom-domain.com`, then the API is avilable at `api.custom-domain.com`


### Tips for accessing through cURL

- This is not a REST API, but an RPC one. Every request needs to be a `POST` request
- It is recommend to use the JSON version of the API, by sending `application/json` as `Content-Type` and `Accept` headers
- Endpoints will always follow a `/twirp/<service>.<Service>Service/<method>` naming convention. See [Creating the Client](#creating-the-client) for examples


## Your API Key

Your individual API key is required to make requests to the Namara API and is available in the account section of the
app. To access this, click on the user icon in the top corner of the application at any time, and navigate to `Account Settings > Token`. Please copy this token and store it in a secure location where it won't be shared with other users. We do not recommend committing this value to any publicly available repo.

Your API key must be used when initializing the client for our supported languages, or to be passed in the HTTP header
`X-API-Key: YOUR_KEY` if you are commmunicating with the API directly or using the legacy API.

## Dataset Versions

Our data is updated regularly and automatically, so values in rows and columns may change. The dataset version is a 
snapshot of the data set's structure and properties. When that structure changes, we create a new version of the dataset. 

It is crucial that you include both the data set ID and the version in your queries. Both are found under the API tab 
for the data set.

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

## Release notes

TODO point to release notes

## Making a Request

The following examples show how to make a request using our Data API.  Please change the examples to the right to
include your API key as well as the specific query you are trying to make.  For more information about querying the
Data API, please see the [Data API](#data-api) section.

```shell
curl -XPOST 
    -H 'X-API-Key: <key>' \
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

## Handling Pagination

Every request that returns a list of results will have pagination parameters that should be provided. `1000` results is both the default and maximum per request. For limits exceeding `1000`, either an error will be returned or a forced `1000` result limit will be applied. This may vary depending on the service. In any case, it is recommend that all listing requests have a pagination strategy.