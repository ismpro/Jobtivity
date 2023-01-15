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

Only accessible to administrators
If type is 'reject' an email will be sent to the user associated with the company
The endpoint does not return any data, it simply returns a success status or an error message.
The endpoint makes a change to the validation status of a company based on the provided ID and type parameters.
Before making the change, the endpoint checks that the id is a valid integer and throws an error if it is not.
If the type parameter is set to "reject", an email will be sent to the user associated with the company using the sendEmail function.
There is also a checkAdmin middleware commented out. Should be uncommented if access to this endpoint is limited to administrators.
The endpoint throws an error if there is an error during the process.


Title:
Retrieve List of Unvalidated Companies

URL:
/list

Method:
GET

URL Params:
None

Data Params:
None

Success Response:
Code: 200
Content: Array of companies in the format:
[
{
idCompany: Number,
name: String,
description: String,
logo: String,
url: String
},
...
]

Error Response:
Code: 401 UNAUTHORIZED
Content: { error : "You are not authorized to access this resource" }
Code: 500 INTERNAL SERVER ERROR
Content: { error : "An error occurred while processing the request" }

Sample Call:

Copy code
fetch('/list', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.log(error))
Notes:

This endpoint is only accessible to administrators.
The endpoint returns a list of companies that have not yet been validated.
The endpoint throws an error if any error occurs during the process.


Title:
Retrieve List of Jobs

URL:
/jobs

Method:
GET

URL Params:
None

Data Params:
None

Success Response:
Code: 200
Content: Array of jobs in the format:
[
{
id: Number,
title: String,
description: String,
salary: String,
location: String,
...
},
...
]

Error Response:
Code: 500 INTERNAL SERVER ERROR
Content: { error : "An error occurred while reading the file" }

Sample Call:

Copy code
fetch('/jobs')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.log(error))
Notes:

This endpoint retrieves the list of jobs from the local file system.
The file should be named 'jobs.json' and should be located at the root of the project.
The endpoint throws an error if there is any problem reading the file.


Retrieve email availability
URL : /checkemail

Method : POST

Auth required : No

Data constraints

Provide email, password and confirmPassword in the request body.

Copy code
{
    "email": "[valid email address]",
    "password": "[string between 8 and 16 characters, containing at least one uppercase and one lowercase letter]",
    "confirmPassword": "[same as password]"
}
Success Response
Code : 200 OK

Content example

Copy code
{}
Error Responses
Condition : If email is already in use

Code : 210

Content :

Copy code
{
    "error": "This email is already in use"
}
Condition : If the email is not valid

Code : 400 BAD REQUEST

Content :

Copy code
{
    "error": "Please enter a valid email address"
}
Condition : If the password is not valid

Code : 400 BAD REQUEST

Content :

Copy code
{
    "error": "Password must be between 8 and 16 characters"
}
or

Copy code
{
    "error": "Password must contain at least one uppercase and one lowercase letter"
}
Condition : If the confirmPassword does not match the password

Code : 400 BAD REQUEST

Content :

Copy code
{
    "error": "Passwords must be same"
}
Sample Call
Copy code
fetch('/checkemail', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "email": "example@mail.com",
        "password": "examplepassword",
        "confirmPassword": "examplepassword"
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.log(error))
Notes
This endpoint allows to check if an email is already in use
The endpoint validate the email, password and confirmPassword and respond with error messages if any validation fails
The endpoint returns a success response if the email is not in use
If the email is already in use, the endpoint returns a 210 status code with an error message