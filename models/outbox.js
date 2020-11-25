module.exports = (sequelize, DataTypes) => {
    const outbox = sequelize.define("outbox", {
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
    return outbox;
};