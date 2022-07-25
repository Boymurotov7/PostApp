import PostModel from '../models/post.js'

export const getAll = async(req,res)=>{
    try{
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: 'ne udalos poluchit stati'
        }); 
    }
}
export const getOne = async(req,res)=>{
    try{

        const postId = req.params.id
        PostModel.findOneAndUpdate({
            _id: postId,
        },{
            $inc: { viewsCount: 1 }
        },
        {
            returnDocument: 'after'
        },
        (err,doc) => {
            if(err){
                console.log(err)
                return res.status(500).json({
                    message: 'ne udalos vernut stati'
                }); 
            }
            if(!doc){
                return res.status(404).json({
                    message: 'statya ne naydena'
                }); 
            }

            res.json(doc)
        },
        );

    }catch(err){
        console.log(err)
        res.status(500).json({
            message: 'ne udalos poluchit stati'
        }); 
    }
}

export const remove = async(req,res)=>{
    try{
        const postId = req.params.id
        PostModel.findOneAndDelete({
            _id: postId,
        },
        (err,doc) => {
            if(err){
                console.log(err)
                return res.status(500).json({
                    message: 'ne udalos udalit stati'
                }); 
            }
            if(!doc){
                return res.status(404).json({
                    message: 'statya ne naydena'
                }); 
            }

            res.json({
                success: true
            })
        },
        );

    }catch(err){
        console.log(err)
        res.status(500).json({
            message: 'ne udalos poluchit stati'
        }); 
    }
}

export const update = async(req,res)=>{
    try{
        const postId = req.params.id
        await PostModel.updateOne({
            _id: postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        },
        );

        res.json({
            success: true
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message: 'ne udalos obnovit stati'
        }); 
    }
}
export const create = async(req,res)=>{
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save()
        console.log(post)

        res.json(post)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: 'ne udalos sozdat statyu'
    })
}
}