import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
    const posts = await prisma.post.findMany();
    return res.status(200).json({
        posts
    })
}

export const getPost = async (req,res) => {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
        where: { id :postId },
        include: {
            postDetail: true,
            user:{
                select:{
                    email:true,
                    username:true,
                    id:true
                }
            }
        }
    });
    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }
    return res.status(200).json({
        post
    })
}

export const create_Post = async (req,res) => {
    // console.log(req.body);
    const body = req.body;
    // console.log(...body.postdata);
        try {
            const createPost = await prisma.post.create({
                data:{
                    ...body.postdata,
                    userId:req.user.userid
                }
            })
            if(!createPost){
                return res.status(400).json({message:"Unable to create Post"})
            }
            console.log(createPost);
            try {
                const add_post_details = await prisma.postDetail.create({
                    data:{
                        postId:createPost.id,
                        ...body.postDetails
                    }
                })
                if(!add_post_details){
                    return res.status(400).json({message:"Unable to create Post Details"})
                }
                return res.status(200).json({message:"Post created successfully"});

            } catch (error) {
                console.log("Error in the inner trycatch block");
                console.log(error.message);            
            }
        } catch (error) {
            console.log("Error in the outer tryCatch block");
            console.log(error);
        }
}

export const delete_post = async (req,res) => {
    const { postId } = req.params;
    const findThePost = await prisma.post.findUnique({
        where: { id: postId }
    })
    if(!findThePost){
        return res.status(400).json({message:"Post is not Available"})
    }
    try {
        // first delete associated product records
        await prisma.postDetail.delete({
            where:{postId}
        })

        // then delete the post record  i.e., first delete the child then delete the parent component in Prisma otherwise relation issues in db will be there
        await prisma.post.delete({
            where: { id: postId }
        })
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Error in deleting the post" + error.message });
    }
}

export const update_post = async (req,res) => {
    const {postId} = req.params;
    const chk_post = await prisma.post.findUnique({where:{id:postId}});
    if(!chk_post){
        return res.status(400).json({message:"Couldn't find post"});
    }
    const body = req.body;
    const keys = Object.keys(body);
    if(keys.includes("postdata")){
        await prisma.post.update({
            where:{id:postId},
            data:{...body.postdata}
        });
        return res.status(200).json({message:"Post updated successfully"});
    }else if(keys.includes("postDetails")){
        await prisma.postDetail.update({
            where:{postId},
            data:{...body.postDetails}
        });
        return res.status(200).json({message:"Post details updated successfully"});
    }else if( keys.includes("postData") && keys.includes("postDetails") ){
        await prisma.postDetail.update({
            where:{postId},
            data:{...body.postDetails}
        });
        await prisma.post.update({
            where:{id:postId},
            data:{...body.postData}
        });
        return res.status(200).json({message:"Post and Post details updated successfully"});
    }
    else{
        return res.status(400).json({message:"No valid data found in the request"});
    }
}