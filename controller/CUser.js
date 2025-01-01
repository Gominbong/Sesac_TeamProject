const jwt = require("jsonwebtoken");
const { User, WorryList } = require("../models");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const { myAnswerList } = require("./CWorryList");
const SALT = 10;
const SECRET_KEY = process.env.SECRET_KEY;
//console.log(User);

/* '/' GET **/
exports.main = (req, res) => {
  const jwt = req.cookies.jwtToken;
  const loginStatus = req.cookies.loginStatus;

  //console.log("jwt: ", jwt);
  //console.log("loginStatus: ", loginStatus);
  if (jwt) {
    const payload = jwt.split(".")[1];
    const decodedPayload = atob(payload);
    //console.log("decodedPayload = ", decodedPayload);
    const decodedPayload2 = JSON.parse(atob(payload));
    const userId = decodedPayload2.id;
    res.render("index", { jwt, loginStatus, decodedPayload, userId });
  } else {
    res.render("index", {
      jwt,
      loginStatus,
      decodedPayload: "false",
      userId: "false",
    });
  }
};

exports.mypage2 = async (req, res) => {
  try {
    const jwt = req.cookies.jwtToken;
    const loginStatus = req.cookies.loginStatus;
    //console.log("mypage 에서 jwt = ", jwt);
    //console.log("mypage 에서 loginStatus: ", loginStatus);
    const payload = jwt.split(".")[1];
    const decodedPayload = atob(payload);
    let { userId, currentPage, tab } = req.body;
    const user = await User.findOne({ where: { userId } });

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
          jwt,
          loginStatus,
          decodedPayload,
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
          jwt,
          loginStatus,
          decodedPayload,
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
          jwt,
          loginStatus,
          decodedPayload,
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
          jwt,
          loginStatus,
          decodedPayload,
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
exports.mypage = async (req, res) => {
  const jwt = req.cookies.jwtToken;
  const loginStatus = req.cookies.loginStatus;
  //console.log("mypage 에서 jwt = ", jwt);
  //console.log("mypage 에서 loginStatus: ", loginStatus);
  const payload = jwt.split(".")[1];
  const decodedPayload = atob(payload);
  //console.log("decodedPayload = ", decodedPayload);
  const decodedPayload2 = JSON.parse(atob(payload));
  const userId = decodedPayload2.id;

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
  });
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

  res.render("mypage", {
    jwt,
    loginStatus,
    decodedPayload,
    userId,
    myWorryList,
    myAnswerList,
  });
};

//고민봉
exports.userReceviedMsg = async (req, res) => {
  const jwt = req.cookies.jwtToken;
  const loginStatus = req.cookies.loginStatus;
  //console.log("jwt: ", jwt);
  //console.log("loginStatus: ", loginStatus);

  const payload = jwt.split(".")[1];
  const decodedPayload = atob(payload);
  //console.log("decodedPayload = ", decodedPayload);
  const decodedPayload2 = JSON.parse(atob(payload));
  const userId = decodedPayload2.id;

  const { Id } = req.body;
  //console.log("내가 답장한 고민 Id: ", Id);
  //console.log("userId 값은? = ", userId);
  const myAnswerList = await WorryList.findOne({
    where: {
      Id,
    },
  });
  const user = await User.findOne({
    where: {
      userId,
    },
  });
  //console.log("myAnswerList: ", myAnswerList);
  //console.log("user: ", user);

  res.render("myAnswerList", {
    myAnswerList,
    user,
    jwt,
    loginStatus,
    userId,
    decodedPayload,
  });
};

exports.userSendedMsg = async (req, res) => {
  const jwt = req.cookies.jwtToken;
  const loginStatus = req.cookies.loginStatus;
  //console.log("jwt: ", jwt);
  //console.log("loginStatus: ", loginStatus);

  const payload = jwt.split(".")[1];
  const decodedPayload = atob(payload);
  //console.log("decodedPayload = ", decodedPayload);
  const decodedPayload2 = JSON.parse(atob(payload));
  const userId = decodedPayload2.id;

  const { Id } = req.body;
  //console.log("나의 고민리스트 Id: ", Id);
  //console.log("userId 값은? = ", userId);
  const myWorryList = await WorryList.findOne({
    where: {
      Id,
    },
  });

  const user = await User.findOne({
    where: {
      userId,
    },
  });

  //console.log("myWorryList: ", myWorryList);
  //console.log("user: ", user);

  res.render("myWorryList", {
    myWorryList,
    user,
    jwt,
    loginStatus,
    userId,
    decodedPayload,
  });
};

//고민봉
exports.index = (req, res) => {
  const jwt = req.cookies.jwtToken;
  const loginStatus = req.cookies.loginStatus;

  //console.log("jwt: ", jwt);
  //console.log("loginStatus: ", loginStatus);
  if (jwt) {
    const payload = jwt.split(".")[1];
    const decodedPayload = atob(payload);
    //console.log("decodedPayload = ", decodedPayload);
    const decodedPayload2 = JSON.parse(atob(payload));
    const userId = decodedPayload2.id;
    res.render("index copy", { jwt, loginStatus, decodedPayload, userId });
  } else {
    res.render("index copy", {
      jwt,
      loginStatus,
      decodedPayload: "false",
      userId: "false",
    });
  }
};

//고민봉 mypageCopy
exports.mypageCopy = async (req, res) => {
  const { userId } = req.body;
  res.send({ result: true, message: "마이페이지" });
};

//고민봉 도메인 룰 확인용 회원10명가입
exports.testUserCreate = async (req, res) => {
  try {
    password = "1234";
    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(password, salt);

    for (let i = 0; i < 10; i++) {
      const findUserId = await User.findAll({
        order: [["userId", "DESC"]],
        limit: 1,
      });
      if (findUserId.length === 0) {
        const newUser1 = await User.create({
          email: "test@naver.com",
          password: hashedPw,
          question: "출신 초등학교 이름은?",
          answer: "qqq",
        });
        continue;
      }
      const newUser = await User.create({
        email: "a" + (findUserId[0].userId + 1) + "@naver.com",
        password: hashedPw,
        question: "출신 초등학교 이름은?",
        answer: "qqq",
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
      userId: newUser.userId,
      message: "회원가입 성공",
    });
  } catch (error) {
    //console.log("post /regist error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

//고민봉logunUser2
exports.loginUser2 = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    //console.log("user: ", user);
    //console.log("Request Body:", req.body);

    if (user === null) {
      return res.send({ result: false, message: "이메일이 틀렸습니다" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      //console.log("isMatch 조건문 안");
      const token = jwt.sign(
        { id: user.userId, email: user.email },
        SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );
      res.cookie("jwtToken", token, {
        httpOnly: true,
        path: "/",
      });
      res.cookie("loginStatus", "true", {
        httpOnly: true,
        path: "/",
      });
      return res.send({ result: true, token: token });
    } else {
      return res.send({
        result: false,
        message: "비밀번호 틀렸습니다",
      });
    }
  } catch (error) {
    //console.log("post /login error", error);
    res.send({ result: false, message: "서버에러" });
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
    //console.log("user: ", user);
    //console.log("Request Body:", req.body);

    if (!user) {
      return res.send({ result: false, message: "invalid_email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        { id: user.userId, email: user.email },
        SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("jwtToken", token, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        maxAge: 3600000,
        path: "/",
      });
      res.cookie("loginStatus", "true", {
        httpOnly: true,
        path: "/",
      });
      return res.send({ result: true, token: token });
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

    res.send({ result: true, message: "정보가 일치합니다" });
  } catch (error) {
    //console.log("post /find-account error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * validation
 * 작성자: 하나래
 */

exports.validation = async (req) => {
  try {
    const authHeader = req.cookies.jwtToken; // 쿠키 이름 수정
    if (!authHeader || !authHeader.startsWith("ey")) {
      console.error("Token is missing or invalid");
      throw new Error("토큰이 필요합니다.");
    }

    let decoded;
    try {
      decoded = jwt.verify(authHeader, SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.error("Token has expired");
        throw new Error("토큰이 만료되었습니다.");
      }
      console.error("Invalid token:", error.message);
      throw new Error("유효하지 않은 토큰입니다.");
    }

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      console.error("User not found for email:", decoded.email);
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    return { email: decoded.email, id: decoded.id };
  } catch (error) {
    console.error("Validation error:", error.message);
    throw error;
  }
};

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
exports.logout2 = async (req, res) => {
  try {
    //console.log("logout2 호출됨");
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    //console.log("logut2 token = ", token);
    const jwtCookie = req.cookies.jwtToken;
    const loginStatusCookie = req.cookies.loginStatus;
    //console.log("jwtCookie: ", jwtCookie);
    //console.log("loginStatusCookie: ", loginStatusCookie);

    res.clearCookie("jwtToken");
    res.clearCookie("loginStatus");
    res.clearCookie(req.cookies.jwtToken);
    res.clearCookie(req.cookies.loginStatus);
    res.status(200).send({ result: true, message: "로그아웃 성공" });
  } catch (error) {
    console.error("logout error:", error.message);
    res.status(500).send({ result: false, message: "서버 에러" });
  }
};

/**
 * logout
 * 작성자: 하나래
 */
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token?.split(" ")[1];
    // const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.send({ result: false, message: "토큰이 없습니다." });
    }

    const isInvalidated = await invalidateToken(token);
    if (!isInvalidated) {
      return res.send({ result: false, message: "토큰 무효화 실패" });
    }
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
  try {
    const userInfo = await exports.validation(req);

    if (!userInfo?.email) {
      console.error("Validation did not return a valid email");
      return res.send({
        success: false,
        message: "사용자 인증에 실패했습니다.",
      });
    }

    const { password } = req.body;
    if (!password) {
      console.error("Password not provided in request");
      return res.send({ success: false, message: "비밀번호가 필요합니다." });
    }

    const user = await User.findOne({ where: { email: userInfo.email } });
    if (!user) {
      console.error("User not found in database");
      return res.send({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Password mismatch for user:", userInfo.email);
      return res.send({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash("deleted_password", salt);

    await User.update(
      {
        email: `deleted_${user.userId}@example.com`,
        password: hashedPw,
        updatedAt: new Date(),
      },
      { where: { email: userInfo.email } }
    );

    res.clearCookie("jwtToken", { path: "/" });
    res.clearCookie("loginStatus", { path: "/" });
    res.send({
      success: true,
      message: "계정이 성공적으로 비활성화되었습니다.",
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

// /**
//  * 내가 보낸 고민, 답장 가져오기
//  * 작성자: 하나래
//  */
// exports.sendedMsg = async (req, res) => {
//   try {
//     //console.log("sendedMsg 호출됨");

//     const user = await exports.validation(req);
//     //console.log("user: ", user);

//     if (user) {
//       const isReplied = await Message.findOne({
//         attributes: ["repliedOrNot"],
//         where: { userId: user.userId },
//       });
//       let msg = null;
//       if (isReplied?.repliedOrNot) {
//         msg = await Message.findOne({
//           attributes: [
//             "title",
//             "content",
//             "createdAt",
//             "repliedTitle",
//             "repliedContent",
//             "repliedDate",
//           ],
//           where: { userId: user.userId },
//         });
//       } else {
//         msg = await Message.findOne({
//           attributes: ["content", "createdAt"],
//           where: { userId: user.userId },
//         });
//       }

//       res.status(200).send({ result: msg });
//     }
//   } catch (error) {
//     console.error("sended-msg error:", error.message);
//     res.status(500).send({ result: false, message: "서버 에러" });
//   }
// };

// /**
//  * 내가 받은 고민, 답장 가져오기
//  * 작성자: 하나래
//  */
// exports.receivedMsg = async (req, res) => {
//   try {
//     const user = await exports.validation(req);
//     if (user) {
//       const isReplied = await Message.findOne({
//         attributes: ["repliedOrNot"],
//         where: { receivedUserId: user.userId },
//       });
//       let msg = null;
//       if (isReplied?.repliedOrNot) {
//         msg = await Message.findOne({
//           attributes: [
//             "title",
//             "content",
//             "createdAt",
//             "repliedTitle",
//             "repliedContent",
//             "repliedDate",
//           ],
//           where: { receivedUserId: user.userId },
//         });
//       } else {
//         msg = await Message.findOne({
//           attributes: ["content", "createdAt"],
//           where: { receivedUserId: user.userId },
//         });
//       }
//       res.status(200).send({ result: msg });
//     }
//   } catch (error) {
//     console.error("received-msg error:", error.message);
//     res.status(500).send({ result: false, message: "서버 에러" });
//   }
// };
