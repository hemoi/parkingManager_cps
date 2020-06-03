# parkingManager_cps

## CPS 팀원

- 유정규
- 정두영
- 최중현
- 홍석현

## DIR구조

- src  
  ㄴ flask_server.py  
  ㄴ plate_recognizer.py  
  ㄴ web3py.py  
  ㄴ wallet.py

- web
  ㄴ index.html, database.html: 웹 페이지를 위한 기보적인 틀  
  ㄴ button_control.js: 프로그램의 전체적인 기능을 위한 파일(서버 통신, 주차 기능, 정보 저장, 주차공간 시각화 등)  
  ㄴ clock.js: 메인 페이지에서 시계 기능을 위한 파일(Date)  
  ㄴ db_button.js, dbList.js: database 페이지를 위한 파일(데이터베이스 초기화, 데이터베이스 내용의 시각화 등)  
  ㄴ css파일들: UI 및 주차공간 시각화를 위한 파일들  
  ㄴ text_control.js: 삭제 예정

- truffle(삭제예정)

## Version

- ubuntu 18.04
- python 3.7.2
- opencv-python 4.2.0.34
- web3 5.9.0
- Flask 1.1.2
- Flask-restful 0.3.8
