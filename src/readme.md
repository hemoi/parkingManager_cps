
### flask_server.py
  - Flask 서버
  - watchdog
    - parking DIR에 이미지 파일이 생성됐을 경우 event발생
  - REST API로 web과 통신
    - `curl http://localhost:5000/users/<차량번호판> -d "" -X DELETE -v`
  - user와 연결된 wallet으로 GANACHE 상호작용
  - 만약 차량이 나갈 경우
      - 들어온 시간과 현재 시간을 계산한다.
      - 현재의 가격은 1초당 0.1 ether임
      - 나가는 경우 wallet.py를 활용해서 ganache와 통신을 한다.   

  
### plate_recognizer.py
  - pytessearct, opencv를 활용해서 이미지 파일에서 string 값을 뽑아 flask_server.py에 넘겨줌
  
### wallet.py
  - GANACHE(local blockchain)와 연결
  - 트랜잭션 생성, 트랜잭션 전송, 잔고확인을 할 수 있음
