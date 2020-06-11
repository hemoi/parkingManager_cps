# parkingManager_cps

## CPS 팀원

- 유정규
- 정두영
- 최중현
- 홍석현

## DIR구조

- src  
  ㄴ flask_server.py: 웹과 연결  
  ㄴ plate_recognizer.py: 번호판 이미지를 받아서 string 값을 추출함  
  ㄴ wallet.py: local blockchain과 통신

- web  
  ㄴ index.html, database.html: 웹 페이지를 위한 기본적인 틀  
  ㄴ button_control.js: 프로그램의 전체적인 기능을 위한 파일(서버 통신, 주차 기능, 정보 저장, 주차공간 시각화 등)  
  ㄴ clock.js: 메인 페이지에서 시계 기능을 위한 파일(Date)  
  ㄴ db_button.js, dbList.js: database 페이지를 위한 파일(데이터베이스 초기화, 데이터베이스 내용의 시각화 등)  
  ㄴ css파일들: UI 및 주차공간 시각화를 위한 파일들

- truffle(삭제예정)

## Version

- ubuntu 18.04
- python 3.7.2
- opencv-python 4.2.0.34
- web3 5.9.0
- Flask 1.1.2
- Flask-restful 0.3.8

## Flow

`python flask_server.py` : flask 서버 실행

### 진입

1. 번호판 이미지 pakring 폴더에 생성
2. watchdog library를 이용, 이미지의 생성을 감지함
3. 이후 plate_recognizer.py 이용, 생성 된 이미지에서 string을 추출
   > 1. plateProcessor에서 이미지 전처리가 일어남
   > 2. plateRecognizer에서 pytesseract library를 이용해서 text를 추출
4. 추출한 번호판의 정보를 유저의 정보(지갑)과 연결
   > - 만약 지갑이 없을 경우, 사용 가능한 wallet을 번호판 정보와 연결
5. parkingUser 클래스의 객체를 생성
   > - 해당 클래스에는 현재 시간, 주차 장소, 유저 정보가 들어감
6. parkingUserList 리스트에 추가
   > - 이후 웹에서는 해당 정보를 json 형식으로 받는다.

### 주차

1. 서버로부터 1초마다 json을 받아 정보를 처리함.
   > 1. local Storage에 중복 저장되지 않도록 검사함
   > 2. 중복되지 않도록 저장함
   > 3. 만약 서버에서 삭제된 경우(출차한 경우) local Storage 삭제
2. 데이터 베이스(local Storage)에 저장된 정보들을 표시함
   > 1. 시각화된 주차 공간을 색칠하여 자리를 표현함
   > 2. 화면의 콘솔 창에 주차정보들을 출력함
   > 3. Database 페이지에 이를 출력(저장)함

### 출차

1. 웹에서 나가는 이벤트 발생
   > 1. 해당 차의 정보를 이용해 delete 요청을 서버로 보냄
   > 2. local Storage에서 해당 차량의 정보를 삭제
   > 3. 화면 주차 공간을 색을 지움
   > 4. 화면 콘솔에 출차 정보를 출력
2. 서버는 해당 요청을 받음
   > 1. 해당 parkingUser 객체에서 user 정보 확인
   > 2. 연결된 wallet을 확인
   > 3. 현재 시간과 들어 온시간을 비교해서 주차 시간 계산
   > 4. 요금 계산
3. 계산된 요금과 연결된 wallet을 이용 블록체인을 통해 요금을 정산한다.
   > 1. rawTx를 만듦
   > 2. 보관 중인 개인키를 통해서 서명
   > 3. 블록체인 네트워크(ganache)로 전송
4. 이후 parkingUser 객체 삭제
   > - 웹에서 이를 감지해서 반영
