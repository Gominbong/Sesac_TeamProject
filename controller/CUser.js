const jwt = require("jsonwebtoken");
const { User, WorryList } = require("../models");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const SALT = 10;
const SECRET_KEY = process.env.SECRET_KEY;
//console.log(User);

/* '/' GET **/
exports.main = (req, res) => {
  const id = exports.jwtVlidation(req, res);
  console.log("userId===", id);
  if (id) {
    res.render("index", { userId: id, message: null });
  } else {
    res.render("index", { userId: null, message: null });
  }
};

exports.jwtVlidation = (req, res) => {
  const jwtToken = req.cookies.jwtToken;
  if (jwtToken == null) {
    console.log("jwt토큰이 존재하지 않습니다.");
    return;
  }
  try {
    const decoded = jwt.verify(jwtToken, SECRET_KEY);
    console.log("jwt토큰이 유효합니다. +2시간 jwt토큰 재발급", decoded);
    const token = jwt.sign({ id: decoded.id }, SECRET_KEY, {
      expiresIn: "2h",
    });
    res.cookie("jwtToken", token, {
      httpOnly: true,
      path: "/",
    });
    return decoded.id;
  } catch (error) {
    console.log("jwt토큰이 만료되었습니다 : ", error);
    res.clearCookie("jwtToken");
  }
};

exports.mypage = async (req, res) => {
  const id = exports.jwtVlidation(req, res);
  console.log("id===", id);
  if (!id) {
    res.render("index", {
      userId: null,
      result: false,
      message: "jwt 유효시간 검증실패 다시 로그인 해주세요",
    });
    return;
  }
  try {
    let { userId, currentPage, tab } = req.body;
    const user = await User.findOne({ where: { Id: userId } });
    if (tab === "myAnswerList") {
      let limit = 6;
      //console.log("userId===", userId);
      //console.log("currentPage===", currentPage);
      currentPage = parseInt(currentPage);

      const totalMyAnswerList = await WorryList.findAll({
        where: { responder_Id: userId },
        order: [["Id", "DESC"]],
      });

      //console.log("totalMyAnswerList===", totalMyAnswerList.length);
      let total = Math.ceil(totalMyAnswerList.length / limit);
      //console.log("total===", total);

      if (totalMyAnswerList.length == 0 || total == 1) {
        let startPage = 1;
        let endPage = 1;
        res.render("mypageAnswer", {
          result: true,
          userId,
          myAnswerList: totalMyAnswerList,
          myWorryList: 1,
          startPage,
          endPage,
          currentPage,
          total,
          user,
        });
        return;
      } else {
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
          order: [["Id", "DESC"]],
          limit,
          offset: limit * (currentPage - 1),
        });

        let startPage = Math.floor((currentPage - 1) / 7) * 7 + 1;
        let endPage;
        if (total < 7) {
          //console.log("첫번째");
          endPage = total;
        }
        if (startPage < total) {
          //console.log("두번째");
          endPage = startPage + 6;
        }
        if (startPage + 6 > total) {
          //console.log("세번째");
          endPage = total;
        }
        //console.log("startPage===", startPage);
        //console.log("endPage===", endPage);
        res.render("mypageAnswer", {
          result: true,
          userId,
          myAnswerList,
          myWorryList: 1,
          startPage,
          endPage,
          currentPage,
          total,
          user,
        });
      }
    }

    if (tab === "myWorryList") {
      let limit = 6;
      //console.log("userId===", userId);
      //console.log("currentPage===", currentPage);
      currentPage = parseInt(currentPage);

      const totalMyWorryList = await WorryList.findAll({
        where: { sender_Id: userId },
        order: [["Id", "DESC"]],
      });

      //console.log("totalMyWorryList===", totalMyWorryList.length);
      let total = Math.ceil(totalMyWorryList.length / limit);
      //console.log("total===", total);

      if (totalMyWorryList.length == 0 || total == 1) {
        let startPage = 1;
        let endPage = 1;
        res.render("mypage", {
          result: true,
          userId,
          myWorryList: totalMyWorryList,
          myAnswerList: 1,
          startPage,
          endPage,
          currentPage,
          total,
          user,
        });
        return;
      } else {
        const myWorryList = await WorryList.findAll({
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
          where: { sender_Id: userId },
          order: [["Id", "DESC"]],
          limit,
          offset: limit * (currentPage - 1),
        });

        let startPage = Math.floor((currentPage - 1) / 7) * 7 + 1;
        let endPage;
        if (total < 7) {
          //console.log("첫번째");
          endPage = total;
        }
        if (startPage < total) {
          //console.log("두번째");
          endPage = startPage + 6;
        }
        if (startPage + 6 > total) {
          //console.log("세번째");
          endPage = total;
        }
        //console.log("startPage===", startPage);
        //console.log("endPage===", endPage);
        res.render("mypage", {
          result: true,
          userId,
          myWorryList,
          myAnswerList: 1,
          startPage,
          endPage,
          currentPage,
          total,
          user,
        });
      }
    }
  } catch (error) {}
};

//고민봉
exports.userReceviedMsg = async (req, res) => {
  const id = exports.jwtVlidation(req, res);
  console.log("id===", id);
  if (!id) {
    res.render("index", {
      userId: null,
      result: false,
      message: "jwt 유효시간 만료 다시 로그인 해주세요",
    });
    return;
  }
  const { Id } = req.body;
  const myAnswerList = await WorryList.findOne({
    where: {
      Id,
    },
  });
  const user = await User.findOne({
    where: {
      Id: myAnswerList.responder_Id,
    },
  });

  res.render("myAnswerList", {
    myAnswerList,
    user,
    userId: id,
  });
};

exports.userSendedMsg = async (req, res) => {
  // 나의 고민에 답변이 달렸을경우 checkReviewScore가 N로 바뀜
  // checkReviewScore 이 N면 리뷰점수를 줄수 있도록 해야함
  // 리뷰점수를 줬으면 N 값에서 Y값으로 변경하고 Y값이면 리뷰점수를 줄수 없도록 해야함
  const id = exports.jwtVlidation(req, res);
  console.log("id===", id);
  if (!id) {
    res.render("index", {
      userId: null,
      result: false,
      message: "jwt 유효시간 만료 다시 로그인 해주세요",
    });
    return;
  }
  const { Id } = req.body;
  const myWorryList = await WorryList.findOne({
    where: {
      Id,
    },
  });
  const user = await User.findOne({
    where: {
      Id: myWorryList.sender_Id,
    },
  });
  res.render("myWorryList", {
    myWorryList,
    user,
    userId: id,
  });
};

//고민봉 도메인 룰 확인용 회원10명가입
exports.testUserCreate = async (req, res) => {
  try {
    password = "1234";
    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(password, salt);

    for (let i = 0; i < 10; i++) {
      const findUserId = await User.findAll({
        order: [["Id", "DESC"]],
        limit: 1,
      });
      if (findUserId.length === 0) {
        const newUser1 = await User.create({
          email: "test@naver.com",
          password: hashedPw,
          question: "출신 초등학교 이름은?",
          answer: "1234",
        });
        continue;
      }
      const newUser = await User.create({
        email: "a" + (findUserId[0].Id + 1) + "@naver.com",
        password: hashedPw,
        question: "출신 초등학교 이름은?",
        answer: "1234",
      });
    }

    res.send({
      result: true,
      message: "회원가입 10명 성공",
    });
  } catch (error) {
    //console.log("post /regist100 error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * checkEmail
 * 작성자: 하나래
 */
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({
        result: false,
        message: "이메일을 입력해 주세요.",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.send({
        result: false,
        message: "올바른 이메일 형식이 아닙니다.",
      });
    }
    const isExist = await User.findOne({ where: { email: email } });
    if (!isExist) {
      res.send({ result: false, message: "가입 가능한 이메일입니다." });
    } else {
      res.send({ result: true, message: "이미 있는 사용자입니다." });
    }
  } catch (error) {
    //console.log("post /checkEmail error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * registUser
 * 작성자: 하나래
 */
exports.registUser = async (req, res) => {
  try {
    const { email, password, question, answer } = req.body;
    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(password, salt);

    // DB 저장
    const newUser = await User.create({
      email: email,
      password: hashedPw,
      question,
      answer,
    });
    res.send({
      result: true,
      message: "회원가입 성공",
    });
  } catch (error) {
    //console.log("post /regist error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * loginUser
 * 작성자: 하나래
 */

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    console.log("user: ", user);
    console.log("Request Body:", req.body);

    if (!user) {
      return res.send({ result: false, message: "invalid_email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user.Id }, SECRET_KEY, {
        expiresIn: "2h",
      });
      res.cookie("jwtToken", token, {
        httpOnly: true,
        path: "/",
      });
      return res.send({ result: true, message: "로그인 성공" });
    } else {
      return res.send({ result: false, message: "invalid_password" });
    }
  } catch (error) {
    //console.log("post /login error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * 이메일과 질문, 대답 일치 여부
 * 작성자: 하나래
 */
exports.findAccount = async (req, res) => {
  try {
    const { email, question, answer } = req.body;
    if (!email || !question || !answer) {
      return res.send({ result: false, message: "모든 필드를 입력해주세요" });
    }
    const user = await User.findOne({
      where: {
        email,
        question,
        answer,
      },
    });

    if (!user) {
      return res.send({ result: false, message: "정보가 일치하지 않습니다" });
    }

    res.send({ result: true, message: "비밀번호 변경성공공" });
  } catch (error) {
    //console.log("post /find-account error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * validation
 * 작성자: 하나래
 */

/**
 * changePw
 * 작성자: 하나래
 */
exports.changePw = async (req, res) => {
  //
  try {
    const user = await exports.validation(req);
    const newPw = req.body.password;
    //console.log("New Password:", newPw);
    if (!newPw || newPw.length < 4) {
      return res.send({
        result: false,
        message: "비밀번호는 최소 4자 이상입니다.",
      });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(newPw, salt);

    await User.update(
      { password: hashedPw },
      { where: { email: user.email, password } }
    );

    res.send({ result: true, message: "비밀번호 변경 성공" });
  } catch (error) {
    console.error("changePw error", error.message);
    res.status(500).send({ message: error.message || "서버 에러" });
  }
};

/**
 * makeNewPw
 * 작성자: 하나래
 */
exports.makeNewPw = async (req, res) => {
  //
  try {
    const { password, email } = req.body;
    //console.log("New Password:", password);
    if (!password || password.length < 4) {
      return res.send({
        result: false,
        message: "비밀번호는 최소 4자 이상입니다.",
      });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(password, salt);

    await User.update({ password: hashedPw }, { where: { email } });

    res.send({ result: true, message: "비밀번호 변경 성공" });
  } catch (error) {
    console.error("changePw error", error.message);
    res.status(500).send({ message: error.message || "서버 에러" });
  }
};

//고민봉
exports.logout = async (req, res) => {
  try {
    console.log("logout2 호출됨");
    res.clearCookie("jwtToken");
    res.status(200).send({ result: true, message: "로그아웃 성공" });
  } catch (error) {
    console.error("logout error:", error.message);
    res.status(500).send({ result: false, message: "서버 에러" });
  }
};

/**
 * deleteUser
 * 작성자: 하나래
 */
exports.deleteAccount = async (req, res) => {
  const id = exports.jwtVlidation(req, res);
  console.log("id===", id);
  if (!id) {
    return res.send({
      success: false,
      message: "jwt 유효시간 만료 다시 로그인 해주세요",
    });
  }
  try {
    const { password, userId } = req.body;
    console.log("password:", password);
    console.log("userId:", userId);
    if (!password) {
      console.error("Password not provided in request");
      return res.send({ success: false, message: "비밀번호가 필요합니다." });
    }

    const user = await User.findOne({ where: { Id: userId } });
    if (!user) {
      console.error("User not found in database");
      return res.send({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(password, salt);

    await User.update(
      {
        email: `deleted_${user.Id}@example.com`,
        password: hashedPw,
        updatedAt: new Date(),
      },
      { where: { Id: user.Id } }
    );

    res.clearCookie("jwtToken", { path: "/" });
    res.send({
      success: true,
      message: "회원탈퇴 성공",
    });
  } catch (error) {
    console.error("deleteAccount error:", error.message);
    console.error("Error stack:", error.stack);
    res.send({
      success: false,
      message: "서버 오류가 발생했습니다. 나중에 다시 시도해주세요.",
    });
  }
};
