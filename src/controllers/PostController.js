const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path'); 
const fs = require('fs');

module.exports = {
    async index(req, res){
        const posts = await Post.find().sort('-createdAt');
        
        return res.json(posts);
    },

    async store(req, res){
        const { author, place, description, hashtags } = req.body;
        const { filename: image } = req.file;

        // Alterando a extensão da imagem com o split
        const [name] = image.split('.');
        const fileName = `${name}.jpg`;
        
        // Teste a requisição json da imagem com as informações do caminho exato 
        //aonde o arquivo vai ser salvo    
        // return res.json(req.file);

        await sharp(req.file.path)
            .resize(500)
            .jpeg(70)
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            )    

        fs.unlinkSync(req.file.path);    

        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName,
        });

        // quando um novo post for enviado, irá emitir está informação para todos 
        // os usuários conectados na aplicação.
        req.io.emit('post', post);

        return res.json(post);            
    }
};