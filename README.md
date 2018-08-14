# oip-nginx-auth
Validate Nginx Subrequest Auths

## Installation Instructions
1. Download the repository using `git clone https://github.com/oipwg/oip-nginx-auth`
2. Install the dependencies required using `npm install`
3. Run the application `node index.js`

## How it works
This micro-api accepts requests, and attempts to validate the HTTP Header `OIP-Auth`. 

The header sent to the API should have this structure:
```javascript
{
	"address": "flo-address-used-to-create-signature",
	"message": "timestamp" + "oipmessage",
	"signature": "the-generated-signature"
}
```

Example
```json
{
	"address":"oNRs1nuR1vUAjWJwhMtxJPQoTFAm9MWz1G",
	"message":"1534278675842{\"oip042\":{}}",
	"signature":"Hw2iuomv/fhYYoKX8bNroVXmOvbh/e9gqZjP+I9kZymHD72mqtDw1qjN6/Qh4nhTDOHI8mkxbWtsaLSTuCkSihU="
}
```

The server will respond with status `202` if the message is validated successfully, and responds with `401` if the validation failed.