const UserModel = require("./User");
const WorryListModel = require("./WorryList");
const WorryList = WorryListModel.WorryList;
const User = UserModel.User;

const ReadListModel = (sequelize, Sequelize) => {
  const ReadList = sequelize.define(
    "readlist",
    {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "userId",
        },
      },
      worryList_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: WorryList,
          key: "Id",
        },
      },
      createDateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return ReadList;
};

module.exports = ReadListModel;
