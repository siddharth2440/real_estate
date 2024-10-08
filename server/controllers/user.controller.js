import prisma from "../lib/prisma.js"

export const getAllUsers = async (req,res) => {
    try {
        const findAllUsers = await prisma.user.findMany();
        return res.status(200).json(findAllUsers);
    } catch (error) {
        return res.status(400).json({message:"Error in fetching the All Users Data"+error.message});
    }
}

export const getUserById = async (req,res) => {
    const id = req.params.userId;
    try {
        const get_user_details = await prisma.user.findUnique({
            where: {id}
        })
        return res.status(200).json(get_user_details);
    } catch (error) {
        return res.status(400).json({message:"Error in fetching the User details"+error.message});
    }
}

export const update_user_details = async (req,res) => {
    const id = req.params.userId;
    const { avatar,password,...input} = req.body;
    let updatedPassword;
    if(updatedPassword){
        updatedPassword = await bcrypt(password,10); 
    }
    try {
        const updated_user_details = await prisma.user.update({
            where: {id},
            data: {
                ...input,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && {avatar})
            }
        })
        return res.status(200).json(updated_user_details);
    } catch (error) {
        return res.status(400).json({message:"Error in updating the User details"+error.message});
    }
}

export const delete_user = async (req,res) => {
    const id = req.params.userId;
    try {
        await prisma.user.delete({
            where: {id}
        })
        return res.status(200).json({message:"User deleted successfully"});
    } catch (error) {
        return res.status(400).json({message:"Error in deleting the User"+error.message});
    }
}


export const savedPost = async (req,res) => {
    const {postId} = req.body;
    const {userid} = req.user;
    try {
        const save_post = await prisma.SavedPost.findUnique({
            where:{
                userId_postId:{
                    userId: tokenUserId,
                    postId,
                }
            }
        })

        if(savedPost){
            await prisma.SavedPost.delete({
                where:{
                    id:postId
                }
            })

            return res.status(200).json({message:"Post removed from saved list"});
        }else{
            await prisma.SavedPost.create({
                data:{
                    userId: tokenUserId,
                    postId
                }
            })
            return res.status(200).json({message:"Post saved to saved list"});
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Error in saving the post"+error.message});
    }
}