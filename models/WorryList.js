const UserModel = require("./User");
const User = UserModel.User;
const WorryListModel = (sequelize, Sequelize) => {
  const WorryList = sequelize.define(
    "worrylist",
    {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      senderContent: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      responderContent: {
        type: Sequelize.TEXT,
      },
      tempRateResponder: {
        type: Sequelize.FLOAT,
      },
      checkReviewScore: {
        type: Sequelize.STRING(1),
      },
      senderSwearWord: {
        type: Sequelize.STRING(1),
      },
      responderSwearWord: {
        type: Sequelize.STRING(1),
      },
      senderPostDateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      responderPostDateTime: {
        type: Sequelize.DATE,
      },
      sender_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "userId",
        },
      },
      responder_Id: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: "userId",
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return WorryList;
};

module.exports = WorryListModel;
