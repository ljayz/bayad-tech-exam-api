# Bayad Technical Exam

1. Using AnomalyInnovations/serverless-nodejs-starter template
1. To Test:
    - Clone repository
    - Run: npm install
    - Copy env.example to .env and set mysql credentials (import table.sql to create the needed table)
    - Run: serveless offline
1. API:
    - GET /users - return all users
    - GET /user/{id} - return a user details by id
    - POST /user - create a user
      - parameters (JSON)
        - firstName
        - lastName
        - description
        - mobileNumber
    - PUT /user/{id} - update a user
      - parameters (JSON)
        - firstName
        - lastName
        - description
        - mobileNumber
    - DELETE /user/{id} - delete a user
        