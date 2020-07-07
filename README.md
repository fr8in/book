

## API Exposed


## Graphql and Table used



## API Exposed

Read this befor writing your api ;- https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design

✅ GET:   /api/branchEmployee/
❌ GET:   /api/branchEmployee/byEmployee
✅ GET:   /api/branchEmployee?employeID=1&limit=25&offset=50
✅ POST:   /api/branchEmployee/
✅ GET:   /api/branchEmployee/:id
❌ GET:   /api/branchEmployee/by/:id
GET:   /api/branchEmployee/:customerCompanyId/:branchId
    ❌GET:   /api/branchEmployee/delete/by/:id
    DELETE:   /api/branchEmployee/delete/by/:id
    POST:   /api/branchEmployee/and/customerBranchEmployee
    ✅ GET:   /api/customerCity/
    GET:   /api/customerCity/bySourceCity
    ✅ GET:   /api/customerCity/:id
    GET:   /api/customerCity/by/:customerId
    POST:   /api/customerCity/increment
    POST:   /api/customerCity/decrement
    POST:   /api/customerCity/byConnectedCities
    POST:   /api/customerBranchEmployee/create

      "postdev": "apollo service:push --variant=dev --serviceURL=${DEV_ORG_GQL}/graphql --serviceName=organisation"
 
 yarn add @apollo/federation apollo-server-express body-parser cors dataloader-sequelize express graphql graphql-relay graphql-sequelize kafka-node loadash mysql2 sequelize serverless-http