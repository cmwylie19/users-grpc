```
curl -X PUT -H "Content-Type: application/json" -d '{"lists":[],"friends":["[Jenkins"],"email":"jenkins@ncsu.edu"}' http://localhost:8081/user 


 curl -X POST -H "Content-Type: application/json" -d '{"name":"Jenkins","email":"jenkins@ncsu.edu"}' http://localhost:8081/user


curl -X GET -H "Content-Type: application/json" -d '{"lists":[],"friends":["[Jenkins"],"email":"jenkins@ncsu.edu"}' http://localhost:8081/user/jenkins@ncsu.edu

```
