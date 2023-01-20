const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    id:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull:false,
      primaryKey:true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    lanzamiento:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    plataformas:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    rating:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdInDb:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue:'https://w7.pngwing.com/pngs/716/526/png-transparent-playstation-4-game-controllers-computer-icons-video-game-control-miscellaneous-white-monochrome.png'
    },
  });

  // opcion 2 https://static.vecteezy.com/system/resources/previews/002/568/002/non_2x/video-game-control-line-and-fill-style-icon-free-vector.jpg
};
