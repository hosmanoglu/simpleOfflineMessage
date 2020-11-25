module.exports = (sequelize, DataTypes) => {
    const loginLogs = sequelize.define("loginLogs", {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return loginLogs;
};