const { ReadList } = require("../models");
exports.createReadList = async (req, res) => {
  try {
    const { userId, worryList_Id } = req.body;
    const newReadList = await ReadList.create({
      user_Id: userId,
      worryList_Id,
    });
    res.send({ result: true, message: "성공적으로 내가 본 목록이 추가됨" });
  } catch (error) {
    //console.log("post /addReadList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};
