module.exports = (sequelize, DataTypes) => {
    const inbox = sequelize.define("inbox", {
        from_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: 'id'
            }
        },
        target_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: 'id'
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });
    return inbox;
};