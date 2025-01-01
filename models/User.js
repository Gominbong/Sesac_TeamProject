module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      question: {
        type: Sequelize.ENUM(
          "출신 초등학교 이름은?",
          "학창시절 별명은?",
          "조부모님의 성함은?"
        ),
        allowNull: false,
      },
      answer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      temp: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 36.5,
      },
    },
    {
      freezeTableName: true,
      // timestamps: false,
      updatedAt: true,
    }
  );
  return User;
};
