const express = require("express");
const UserController = require("../controller/CUser");
//고민봉
const WorryListController = require("../controller/CWorryList");
const ReadListController = require("../controller/CReadList");
const router = express.Router();

router.get("/", UserController.main);

// 새 고민 작성, 욕설필터

router.post("/regist", UserController.registUser);
router.post("/check-email", UserController.checkEmail);
router.post("/login", UserController.loginUser);
router.post("/token", UserController.validation);
router.patch("/change-pw", UserController.changePw);
router.get("/logout", UserController.logout);
router.post("/find-account", UserController.findAccount);
router.post("/deleteAccount", UserController.deleteAccount);
router.post("/makeNewPw", UserController.makeNewPw);
// router.post("/sendedMsg", UserController.sendedMsg);
// router.get("/receivedMsg", UserController.receivedMsg);

router.post("/myAnswerList", UserController.userReceviedMsg);
router.post("/myWorryList", UserController.userSendedMsg);

//고민봉 페이징 구현중
router.post("/myWorryListPage", WorryListController.myWorryListPage);

router.post("/mypage", UserController.mypage2);

//고민봉 index2
router.get("/index", UserController.index);

//고민봉 login2
router.post("/login2", UserController.loginUser2);

//고민봉 logout2
router.get("/logout2", UserController.logout2);

//고민봉 도메인 룰 테스트용 10명 회원가입 시키기
router.post("/regist10", UserController.testUserCreate);

//고민봉 도메인 룰 테스트용 고민 10명의 유저 각각 10개씩 총 100개 생성성
router.post("/addWorryList100", WorryListController.testCreateWorryList);

router.post("/mypageCopy", UserController.mypageCopy);

//고민봉 리뷰 점수 업데이트
router.patch("/updateTemp", WorryListController.updateTempRateresponder);

//고민봉 유저 고민 등록 row생성
router.post("/addWorryList", WorryListController.createWorryList);

//고민봉 나의 고민 목록 row 가져오기
router.post("/myWorryList", WorryListController.myWorryList);

//고민봉 나의 고민목록 내용 가져오기
router.post("/myWorryList/content", WorryListController.myWorryListContent);

//고민봉 나의 답변 목록 row 가져오기
router.post("/myAnswerList", WorryListController.myAnswerList);

//고민봉 나의 답변목록 내용 가져오기
router.post("/myAnswerList/content", WorryListController.myAnswerListContent);

//고민봉 내가 본 고민 목록  row생성
router.post("/addReadList", ReadListController.createReadList);

//고민봉 고민 답변 row업데이트
router.patch("/addAnswer", WorryListController.answerWorryList);

//고민봉 새로운 고민 보기
router.post("/worryList", WorryListController.findAllWorryList);

module.exports = router;
