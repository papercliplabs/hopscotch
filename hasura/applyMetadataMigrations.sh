hasura metadata apply --endpoint http://localhost:8080 --admin-secret=squidsquidsquid
hasura migrate apply --all-databases --endpoint http://localhost:8080 --admin-secret=squidsquidsquid
hasura metadata reload --endpoint http://localhost:8080 --admin-secret=squidsquidsquid