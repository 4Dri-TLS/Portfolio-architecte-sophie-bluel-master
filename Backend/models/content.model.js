module.exports = (sequelize, DataTypes) => {
    const Content = sequelize.define('Content', {
        key: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    return Content;
};