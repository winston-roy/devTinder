**Usage Instructions**

1. Create a folder Tools/Postman-to-openapi
2. Install package inside Tools/Postman-to-openapi
3. cd Tools/Postman-to-openapi
4. npm init
5. npm i npm i postman-to-openapi
6. add option.json, postman.json file

Then follow below steps

1. Use Postman to Develop/Test APIs.
2. Export the Postman collection in the JSON format.
3. Copy the contents of the file to postman.json.
4. Run the following commandin this directory to generate/update the openapi.json which contains the API documentation in OpenAPI Specification.
   ```
   npx p2o ./postman.json -f ./openapi.json -o ./options.json
   ```
5. options.json contains custom configurations to be included in documentation.

**Pre-requisites**
1. Use node v18.X.X to run the command.