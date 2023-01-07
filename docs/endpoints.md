Endpoint: /alterValid

Title: Alter Validation Status of a Company
URL: /alterValid
Method: POST
URL Params: None
Data Params:
id (required): The ID of the company that you want to alter the validation status for.
type (required): The type of alteration to be made. Can be either 'accept' or 'reject'.
Success Response:
Code: 200
Content: true
Error Response:
Code: 500
Content: Error object
Sample Call:
Copy code
$.ajax({
  url: "/alterValid",
  dataType: "json",
  data : { 
    id: 12,
    type : "accept"
  },
  type : "POST",
  success : function(r) {
    console.log(r);
  }
});
Notes:

This endpoint is only accessible to administrators.
If the provided company ID does not exist, an error will be thrown.


Endpoint: /list

Title: List Unvalidated Companies
URL: /list
Method: GET
URL Params: None
Data Params: None
Success Response:
Code: 200
Content: An array of unvalidated companies, each represented as an object with the following properties:
idCompany: The ID of the company.
name: The name of the company.
description: The description of the company.
logo: The logo of the company.
url: The website URL of the company.
Error Response:
Code: 500
Content: Error object
Sample Call:
Copy code
$.ajax({
  url: "/list",
  dataType: "json",
  type : "GET",
  success : function(r) {
    console.log(r);
  }
});
Notes:

This endpoint is only accessible to administrators.
It returns a list of companies that have not yet been validated.