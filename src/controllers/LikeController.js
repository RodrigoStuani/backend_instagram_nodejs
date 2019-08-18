const Post = require('../models/Post');

module.exports = {
    async store(req, res){
        const post = await Post.findById(req.params.id);

        post.likes += 1;

        await post.save();

        // quando um novo like for enviado, irá emitir está informação para todos 
        // os usuários conectados na aplicação.
        req.io.emit('like', post);

        return res.json(post);
    }    
};