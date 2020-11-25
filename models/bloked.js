module.exports = (sequelize, DataTypes) => {
    const bloked = sequelize.define("bloked", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: 'id'
            }
        },
        bloked_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: 'id'
            }
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'bloked_id']
            }
        ]
    });
    return bloked;
};