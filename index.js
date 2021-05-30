/*
____________________________________________________________________________________________________________
## API TO MANAGE PAYMENT DETAILS FOR TRAKNPAY GATEWAY ##
------------------------------------------------------------------------------------------------------------
|   VERSION     |   1.0      |   CREATED_ON  |   29-Apr-2020 |   CREATED_BY  |   KIRAN BHAGANNAVAR
------------------------------------------------------------------------------------------------------------
## API INPUT    		        	##                                                                                               
------------------------------------------------------------------------------------------------------------
|   ++ p_in_json        ( JSON type In param )    - contains JSON array of Payment Details.
|   ++ p_out_mssg_flg  ( Varchar type Out param ) - contains output flag for Sucess\Failure.
|   ++ p_out_mssg      ( Varchar type Out param ) - contains output messsage for Sucess\Failure.

------------------------------------------------------------------------------------------------------------
## CHANGE LOG DETAILS 		  	##
------------------------------------------------------------------------------------------------------------
|   ++ 03-Oct-2018    v1.0     - Created the New API.
|   ++
_____________________________________________________________________________________________________________
*/
/* @details - DB Connection Params
    ++ Include require mysql package for  mysql call.
    ++ include require dbConfig JSON data to intialize and set DB params.
	
~~ Start ------------------------------------------------------------------
*/

"use strict";
var Client = require("node-rest-client").Client;
var client = new Client();

var crypto = require("crypto"),
  URL = "https://biz.traknpay.in/v2/getpaymentrequesturl";

exports.handler = (event, context, callback) => {
context.callbackWaitsForEmptyEventLoop = false;

var SALT = event.address_line_1; // the salt is present in address_line_1 for further use in return url
var API_KEY = event.api_key;

var shasum = crypto.createHash("sha512");

var eventValues = Object.values(event);
var joinEvent = eventValues.join("|");
var saltJoin = SALT + "|" + joinEvent;

var hashedkey = shasum.update(saltJoin).digest("hex").toUpperCase();

// add the hash to the json
event.hash = hashedkey;

var args = {
  // method: "POST",
  data: event,
  headers: {
    "Content-Type": "application/json",
  },
};

client.post(URL, args, function (data) {
  console.log(data);
  callback(null, data);
});
};
// ~~ End -----------------------------------------------------------------
