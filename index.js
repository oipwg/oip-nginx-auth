const bitcoinMessage = require('bitcoinjs-message')
const express = require('express')
const bodyParser = require('body-parser');

const app = express()

const config = require("./config.json")

// Set the API to not care about body size
app.use(function(err, req, res, next){
	console.log(err)
	next()
});

app.get('/auth_request', (req, res) => {
	var original_request_type = req.get("X-Original-Method")
	var auth_message = req.get("OIP-Auth")

	if (auth_message === undefined){
		if (config.debug)
			console.log("Auth Message Undefined!")

		if (original_request_type === "OPTIONS"){
			if (config.debug)
				console.log(`Request type is ${original_request_type}, responding with 202 and ignoring validation`)

			res.status(202).send()
		} else {
			if (config.debug)
				console.log(`Request type is ${original_request_type}, responding with 401!`)

			res.status(401).send()
		}
	} else {
		try {
			var parsed_json = JSON.parse(auth_message)

			var valid = bitcoinMessage.verify(parsed_json.message, parsed_json.address, parsed_json.signature, "\u001bFlorincoin Signed Message:\n")

			if (valid) {
				if (config.debug)
					console.log("Signature Valid")
				
				res.status(202).send()
			} else {
				if (config.debug)
					console.log("Signed Message Invalid!")

				res.status(401).send()
			}
		} catch (e) {
			if (config.debug)
				console.log("Auth Error! \n" + e)

			res.status(401).send()
		}
	}
})

app.listen(config.port, () => console.log('OIP-Nginx-Auth listening on port ' + config.port))