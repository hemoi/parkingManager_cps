
- **Api.py**  
  - Flask 서버
  - REST로 web과 통신
    - `curl http://localhost:5000/users -d "" -X GET -v` : dummy 값 생성
    - `curl http://localhost:5000/users/user1 -d "" -X DELETE -v`: delete
  - User class web3py.py의 wallet class로 GANACHE 통신

  - [ ] 입장시 plate_recognizer 호출 할 수 있게 구현
  
- **img(dir)**
  - 차량 번호판 사진
  
- **plate_recognizer.py**  
  - pytessearct, opencv를 활용해서 이미지 파일에서 string 값을 뽑아 Api.py에 넘겨줌
  
- **web3py.py**
  - GANACHE(local blockchain)와 연결
  - 트랜잭션 생성, 트랜잭션 전송, 잔고확인을 할 수 있음
