
### flask_server.py
  - Flask 서버
  - watchdog
    - img DIR에 있는 번호판 사진을 parking DIR에 넣을 경우 event발생
  - REST로 web과 통신
    - `curl http://localhost:5000/users/<차량번호판> -d "" -X DELETE -v`
  - User class .py의 wallet class로 GANACHE 상호작용

  
### plate_recognizer.py
  - pytessearct, opencv를 활용해서 이미지 파일에서 string 값을 뽑아 flask_server.py에 넘겨줌
  
### wallet.py
  - GANACHE(local blockchain)와 연결
  - 트랜잭션 생성, 트랜잭션 전송, 잔고확인을 할 수 있음
