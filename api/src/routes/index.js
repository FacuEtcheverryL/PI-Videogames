const { Router, application } = require('express');
const express = require('express');
const axios = require('axios')
const {Genre , Videogame} = require('../db');

const {
    API_KEY,
  } = process.env;
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const url = 'https://api.rawg.io/api/games'


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


const getInfoApi =  async () =>{
    let zero = [];
    let alpha = [];
    let beta = (await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=1`,
    {headers: {"accept-encoding": "application/json" }})).data.results;

    for(let i = 2; i <=6 ; i++){
        alpha.push((await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`,
        {headers: {"accept-encoding": "application/json" }})).data.results)
    }

    for(let i = 0; i < alpha.length; i++){
        for(let j = 0; j < alpha[i].length ; j++) {
        
        zero.push(alpha[i][j])
    }}

    let apiUrl= beta.concat(zero)
    
   
    apiUrl = apiUrl.map(e => {
        return{
            id: e.id,
            image: e.background_image,
            name: e.name,
            genres: e.genres.map(e => e),
            rating: e.rating
        }
    })
    
       return apiUrl; 
}


const getDataBase = async () =>{
    return await Videogame.findAll({
        include:{ 
            model: Genre,
            attributes: ['name'],
            through:{
                attributes: [],
            },
        }
    })
} 

const getAllCharacters = async () =>{
    const apiInformacion = await getInfoApi();
    const dbInfo = await getDataBase();
    const infototal = apiInformacion.concat(dbInfo);
    //console.log(infototal)
    return infototal

} 
 

router.get('/videogames' , async (req, res) =>{
    const name = req.query.name
    let characterTotal = await getAllCharacters();
    //try{
    if (name){
        
        let characteName = await characterTotal.filter(e => e.name.toLowerCase().includes(name.toLowerCase()))
        characteName.length ? 
        res.status(200).send( characteName) :
        res.status(404).send("No existe el Videojuego");
    }//}
   // catch (error){
    else{
        
        res.status(200).send(characterTotal)
    }
    //}
}) 
 
 
router.get('/genres', async (req,res)=>{
    let zero = [];
    let alpha = [];
    let beta = (await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=1`,
    {headers: {"accept-encoding": "application/json" }})).data.results;

    for(let i = 2; i <=30 ; i++){
        alpha.push((await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`,
        {headers: {"accept-encoding": "application/json" }})).data.results)
    }

    for(let i = 0; i < alpha.length; i++){
        for(let j = 0; j < alpha[i].length ; j++) {
        
        zero.push(alpha[i][j])
    }}

    let apiUrl= beta.concat(zero)
    
    const genress= apiUrl.map(e => e.genres)
    const genreFiltro = genress.map(e => {
        for (let i = 0; i < e.length; i++) return e[i].name})
        
        
    genreFiltro.forEach(e=>{
        Genre.findOrCreate({
            where: {name:e}
        })
    })
    const allGenres = await Genre.findAll();
   
    res.send(allGenres);
})


router.post('/videogames' , async (req,res) =>{
    let {
        name,
        image,
        description,
        lanzamiento ,
        rating,
        createdInDb, 
        genres,
        plataformas,
    } = req.body
    
 
        
    let characterCreated = await Videogame.create ({
        name,
        image,
        description,
        lanzamiento,
        rating,
        createdInDb,
        plataformas,
    })

    let genreDb = await Genre.findAll({
        where: {name: genres}
    })

    characterCreated.addGenre(genreDb)
    res.json('Personaje creado')
})


router.get('/videogames/:id', async (req, res) =>{
	const id = req.params.id;
	
    const url = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
	try{
        if(id.includes('-')) {
            const gameDb = await Videogame.findOne({
                    where: {id},
                    include: Genre,                               
                });
                return res.status(200).send(gameDb)
           }
		const urlInfo = await axios.get(url, { headers: { "accept-encoding": null }})
		const game = {
        id: urlInfo.data.id,
        name: urlInfo.data.name,
        image: urlInfo.data.background_image,
        genres: urlInfo.data.genres.map((d) => d.name),
        released: urlInfo.data.released,
        rating: urlInfo.data.rating,
        platforms: urlInfo.data.platforms.map((d) => d.platform.name),
        description: urlInfo.data.description_raw,
      }
      res.status(200).json(game)
	}catch(error){
		res.status(404).send('Juego no encontrado')
	}

})

router.delete('/videogames/:id', async (req, res) => {
    const {id} = req.params;
    Videogame.destroy({
        where: {id}
    })
res.status(200).send('Juego eliminado')
})

module.exports = router;
