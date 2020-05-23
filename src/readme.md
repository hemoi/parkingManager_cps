**test용 값 설정**  
`curl http://localhost:5000/users -d "" -X GET -v`

**DELETE 시 값이 삭제되고 자동으로 연결된 계정에서 돈이 빠져나감**  
`curl http://localhost:5000/users/user1 -d "" -X DELETE -v`
