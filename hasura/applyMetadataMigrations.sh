hasura metadata apply --endpoint http://localhost:8080
hasura migrate apply --all-databases --endpoint http://localhost:8080
hasura metadata reload --endpoint http://localhost:8080