const express = require("express");
const UserController = require("../controller/CUser");
//고민봉
const WorryListController = require("../controller/CWorryList");
const ReadListController = require("../controller/CReadList");
const router = express.Router();

router.get("/", UserController.main);

// 새 고민 작성, 욕설필터

router.post("/regist", UserController.registUser);
router.post("/checkEmail", UserController.checkEmail);
router.post("/login", UserController.loginUser);
router.patch("/changePw", UserController.changePw);
router.post("/findAccount", UserController.findAccount);
router.post("/deleteAccount", UserController.deleteAccount);
router.post("/makeNewPw", UserController.makeNewPw);

//고민봉 나의 고민 답변 내용 가져오기
router.post("/myAnswerList", UserController.userReceviedMsg);

//고민봉 나의 고민 목록 내용 가져오기
router.post("/myWorryList", UserController.userSendedMsg);

//고민봉 logout
router.get("/logout", UserController.logout);

//고민봉 도메인 룰 테스트용 10명 회원가입 시키기
router.post("/regist10", UserController.testUserCreate);

//고민봉 도메인 룰 테스트용 고민 10명의 유저 각각 10개씩 총 100개 생성성
router.post("/addWorryList100", WorryListController.testCreateWorryList);

//고민봉 리뷰 점수 업데이트
router.patch("/updateTemp", WorryListController.updateTempRateresponder);

//고민봉 유저 고민 등록 row생성
router.post("/addWorryList", WorryListController.createWorryList);

//내가 보낸 고민 내용
router.post("/mypage", UserController.mypage);

//고민봉 나의 답변 목록 row 가져오기
router.post("/myAnswerList", WorryListController.myAnswerList);

//고민봉 내가 본 고민 목록  row생성
router.post("/addReadList", ReadListController.createReadList);

//고민봉 고민 답변 row업데이트
router.patch("/addAnswer", WorryListController.answerWorryList);

//고민봉 새로운 고민 보기
router.post("/worryList", WorryListController.findAllWorryList);

module.exports = router;
