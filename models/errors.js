module.exports = (sequelize, DataTypes) => {
    const errors = sequelize.define("errors", {
        err: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return errors;
};