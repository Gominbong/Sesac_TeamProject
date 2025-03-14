const { Op, where } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {
  ReadList,
  User,
  WorryList,
  sequelize,
  Sequelize,
} = require("../models");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const CUser = require("./CUser");
const jwtVlidation = CUser.jwtVlidation;
// 도메인 룰 테스트용 고민 10명의 유저 각각 10개씩 총 100개 생성성
exports.testCreateWorryList = async (req, res) => {
  try {
    const findUserId = await User.findAll({
      order: [["Id", "DESC"]],
      limit: 10,
    });

    for (let i = 0; i < 10; i++) {
      let userId = findUserId[i].Id;
      //console.log("userId 확인 ===", userId);
      for (let j = 0; j < 10; j++) {
        const newWorryList = await WorryList.create({
          sender_Id: userId,
          title: userId + "의" + j + "고민",
          senderContent: userId + "의" + j + "고민 내용",
          senderSwearWord: "N",
        });
      }
    }

    res.send({
      result: true,
      message:
        "성공적으로 10명의 유저 각각 10개씩 총 100개 고민 등록되었습니다.",
    });
  } catch (error) {
    //console.log("post /addWorryList100 error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.createWorryList = async (req, res) => {
  const id = jwtVlidation(req, res);

  console.log("id===", id);
  if (!id) {
    res.send({
      result: false,
      message: "jwt토큰 유효시간 검증실패 로그인 다시 해주세요",
    });
    return;
  }

  try {
    const { title, senderContent, userId } = req.body;
    const filePath = path.join(__dirname, "../config/badwords.txt");

    // 파일 읽기
    const data = await readFileAsync(filePath, "utf8");

    // 데이터를 배열로 변환하고, 줄 바꿈, 캐리지 리턴, 쉼표 및 빈 문자열 제거
    const badwords = data
      .split(/[\n\r,]+/)
      .map((word) => word.trim())
      .filter((word) => word !== "");

    // badwords 배열에 있는 단어가 senderContent 문자열에 포함되어 있는지 검사
    const containsBadWord = badwords.some((word) =>
      senderContent.includes(word)
    );
    //console.log("containsBadWord===", containsBadWord);
    if (containsBadWord) {
      senderSwearWord = "Y";
    } else {
      senderSwearWord = "N";
    }
    //console.log("senderSwearWord===", senderSwearWord);
    const newWorryList = await WorryList.create({
      sender_Id: userId,
      title,
      senderContent,
      senderSwearWord,
    });
    res.send({ result: true, message: "성공적으로 고민이 등록되었습니다." });
  } catch (error) {
    //console.log("post /addWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.answerWorryList = async (req, res) => {
  const id = jwtVlidation(req, res);

  console.log("id===", id);
  if (!id) {
    res.send({
      result: false,
      message: "jwt토큰 유효시간 검증실패 로그인 다시 해주세요",
    });
    return;
  }
  try {
    //Id 는 WorryList 테이블의 Id
    const { Id, userId, responderContent } = req.body;
    const filePath = path.join(__dirname, "../config/badwords.txt");

    //같은고민을 2명이 답변하고있는경우 마지막으로 답변한사람꺼로 덮어쓰기가 됨.. 답변등록시
    //답변된건지 아닌지 조회를 먼저하고 답변이 된거면 예외처리로 이미답변됫다고 해야함
    const findWorryList = await WorryList.findOne({ where: { Id } });
    console.log("findWorryList길이확인 ==", findWorryList.length);
    if (findWorryList.responder_Id != null) {
      console.log("이미 답변 됬");
      res.send({ result: false, message: "이미 답변된 고민입니다." });
      return;
    }
    // 파일 읽기
    const data = await readFileAsync(filePath, "utf8");

    // 데이터를 배열로 변환하고, 줄 바꿈, 캐리지 리턴, 쉼표 및 빈 문자열 제거
    const badwords = data
      .split(/[\n\r,]+/)
      .map((word) => word.trim())
      .filter((word) => word !== "");

    // badwords 배열에 있는 단어가 senderContent 문자열에 포함되어 있는지 검사
    const containsBadWord = badwords.some((word) =>
      responderContent.includes(word)
    );
    //console.log("containsBadWord===", containsBadWord);
    if (containsBadWord) {
      responderSwearWord = "Y";
    } else {
      responderSwearWord = "N";
    }

    const answerWorryList = await WorryList.update(
      {
        responder_Id: userId,
        responderContent,
        responderPostDateTime: new Date(),
        responderSwearWord,
        checkReviewScore: "N",
      },
      { where: { Id } }
    );

    res.send({ result: true, message: "성공적으로 답변을 했습니다." });
  } catch (error) {
    //console.log("post /addAnswer error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

// 답변받은 유저가 리뷰점수를 줌.
exports.updateTempRateresponder = async (req, res) => {
  const id = jwtVlidation(req, res);
  console.log("id===", id);
  if (!id) {
    res.send({
      result: false,
      message: "jwt 유효시간 검증실패 다시 로그인 해주세요",
    });
    return;
  }
  try {
    //tempScore는 1,2,3,4,5 5개 단계로 점수를 줄수 있도록함
    //온도점수공식
    // 1: -0.2
    // 2: -0.1
    // 3: 0
    // 4: +0.1
    // 5: +0.2
    const { Id, tempScore } = req.body;
    //console.log("updateTemp에서 Id 값 = ", Id);
    //console.log("updateTemp에서 tempScore 값 = ", tempScore);
    let calulateTempScore = parseFloat(tempScore);
    if (calulateTempScore == 1) {
      calulateTempScore = -0.2;
    }
    if (calulateTempScore == 2) {
      calulateTempScore = -0.1;
    }
    if (calulateTempScore == 3) {
      calulateTempScore = 0;
    }
    if (calulateTempScore == 4) {
      calulateTempScore = 0.1;
    }
    if (calulateTempScore == 5) {
      calulateTempScore = 0.2;
    }

    //console.log("calulateTempScore===", calulateTempScore);
    const findWorryList = await WorryList.findOne({ where: { Id } });

    //console.log("findWorryList===222", findWorryList);
    if (findWorryList.checkReviewScore == "Y") {
      res.send({ result: false, message: "이미 평가한 고민입니다." });
      return;
    } else {
      await findWorryList.update({
        tempRateResponder: tempScore,
        checkReviewScore: "Y",
      });
    }

    const findUser = await User.findOne({
      where: { Id: findWorryList.responder_Id },
    });

    await findUser.update({
      temp: parseFloat(findUser.temp) + calulateTempScore,
    });

    res.send({ result: true, message: "성공적으로 평가했습니다." });
  } catch (error) {
    //console.log("patch /updateTempRateresponder error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.myAnswerList = async (req, res) => {
  const id = jwtVlidation(req, res);

  console.log("id===", id);
  if (!id) {
    res.send({
      result: false,
      message: "jwt토큰 유효시간 검증실패 로그인 다시 해주세요",
    });
    return;
  }
  try {
    const { userId } = req.body;
    const myAnswerList = await WorryList.findAll({
      attributes: [
        "Id",
        "sender_Id",
        "title",
        "senderContent",
        "senderSwearWord",
        "senderPostDateTime",
        "responder_Id",
        "responderContent",
        "responderSwearWord",
        "responderPostDateTime",
        "tempRateresponder",
        "checkReviewScore",
      ],
      where: { responder_Id: userId },
    });

    //console.log("myAnswerList===", myAnswerList);
    res.send({ result: true, myAnswerList });
  } catch (error) {
    //console.log("post /myAnswerList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};
exports.findAllWorryList = async (req, res) => {
  const id = jwtVlidation(req, res);

  console.log("id===", id);
  if (!id) {
    res.send({
      result: false,
      message: "jwt토큰 유효시간 검증실패 로그인 다시 해주세요",
    });
    return;
  }
  try {
    const { userId } = req.body;

    //console.log("백엔드에서 userId===", userId);
    //console.log("백엔드에서 token===", token);

    // 최근 50개 조회 (내가 쓴 글 제외 답변이 달린글 제외 읽었던 고민 제외)
    const findAllWorryList = await sequelize.query(
      `SELECT worrylist.*
     FROM worrylist
     WHERE worrylist.sender_Id != :id
     AND worrylist.Id NOT IN (
     SELECT readlist.worryList_Id
     FROM readlist
     WHERE readlist.user_Id = :id
     )
      AND worrylist.Id NOT IN (
     SELECT worrylist.Id
      FROM worrylist
      WHERE worrylist.responder_Id IS NOT NULL
      )
    ORDER BY worrylist.Id DESC
    LIMIT 50;`,
      { replacements: { id: userId }, type: Sequelize.QueryTypes.SELECT }
    );

    if (findAllWorryList.length == 0) {
      res.send({ result: false, message: "현재 고민이 없습니다." });
      return;
    }

    let randomWorryList = [];
    let randomIndex = Math.floor(Math.random() * findAllWorryList.length);
    console.log("randomIndex====", randomIndex);
    randomWorryList.push(findAllWorryList[randomIndex]);
    console.log("randomWorryList", randomWorryList[0]);
    console.log("randomWorryList", randomWorryList[0].Id);

    //고민을 읽었다면 readlist에 추가해야함
    const newReadList = await ReadList.create({
      user_Id: userId,
      worryList_Id: randomWorryList[0].Id,
    });

    res.send({
      result: true,
      randomWorryList,
      message: "고민받기성공",
    });
  } catch (error) {
    //console.log("get /worryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};
