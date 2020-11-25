module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define("users", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return users;
};