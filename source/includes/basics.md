# API Introduction

If you're looking to interact with the Namara API, you've come to the right place. This guide will cover instructions and conventions for using our API, with language-specific examples.

### Our REST API

The Namara API is a REST-based service that accepts and returns `JSON` in most cases (we'll cover [response formats](#formats-pagination-amp-ordering) later). Requests should be made to:

<code>https://:namara_api_host/v0/:endpoint</code>

Unless indicated otherwise, the Namara API host is `api.namara.io`, which will be used throughout the documentation. 

The responses will be outlined for each endpoint.

##<div class="colour-pill"><span class="get">GET</span> Generic Endpoint</div>

>https://api.namara.io/v0/:endpoint

In the code column on the right is a generic endpoint, and the foundation of almost every call to our API. The chart below displays standard response codes:

Response | Description
-------- | -----------
200: OK | Success
202: Accepted | A background job has successfully been triggered - continue polling for details
401: Unauthorized | The API key you provided doesn't correspond to any user
403: Forbidden | User is not authorized to make that request
422: Unprocessable Entity | The server was unable to save the document; there will be more details in the full response body
429: Too Many Requests | User has exceeded the monthly maximum for requests or downloads (see <a href="#rate-limiting">Rate Limiting</a>)

## API Keys

Three kinds of API Keys can be created for accessing the Namara API - *Organization Keys*, *Project Keys*, and *Personal Keys*. This is an overview of managing all three types, and we'll outline the different use cases for each.

<!-- we don't actually outline use cases here -->

### Organization API Keys

For any non-personal Organization, visit the "Settings" tab and create API Keys for that Organization. Calls made with this API Key will be limited to Data Sets and Projects that your Organization has access to.

### Project API Keys

For any project, visit the "Settings" tab and create API Keys for yourself for that Project. Calls made with this API Key will be limited to Data Sets that your Project has access to.

### Personal API Keys

The Personal Namara API Key can be obtained by clicking on the Organization tab at the bottom of the left sidebar, then clicking "Account Settings". Copy this from the "API Key" tab and use it for any API calls.

<aside class="warning">Your Personal Key gives its user access to the entire Namara account. If you are thinking about sharing an API Key with another user, consider an Organization API Key or a Project API Key in order to limit their access to your account.</aside>

### Rate Limiting

Users are limited to 10,000 requests per month, as well as 100 data set downloads per month. If you exceed this limit, the API will return `status: 429`. If you find yourself meeting the limits, contact your account manager or <a href="mailto:info@thinkdataworks.com" target="_blank" rel="noreferrer noopener">email us</a> to find a solution.
 
## Making Requests

### Parameter Authentication

```shell
curl -XGET https://api.namara.io/v0/data_sets/:data_set_id?api_key=:YOUR_API_KEY

  or

curl -i \
-H "Content-Type: application/json" \
-H "X-API-Key: {YOUR_API_KEY}" \
-X POST \
-d '{"query":"..."}' \
https://api.namara.io/v0/query.:format
```

Append the key as `api_key` to any request body (either `GET` or `POST`) as long as it is included in the parameters.

### Header Authentication

The API Key can be sent in the request headers as `X-API-Key`. Append the key to the headers by adding `"X-API-Key: {YOUR_API_KEY}"`

### Testing Authentication

Here's how to verify your API Key:

###<div class="colour-pill"><span class="get">GET</span> Verify API Key</div>

Ping the API at `http://api.namara.io/v0/users/verify_token` to ensure that the API token is valid for the user.

>1)
`{ "status": true }`

>2)
`{ "status": false }`

Response | Description
-------- | -----------
200: OK | The API Key is valid (*example 1*)
422: Unprocessable Entity | API does not correspond to any user (*example 2*)