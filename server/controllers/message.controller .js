import prisma from "../lib/prisma.js"

export const addMessage = async (req,res) => {
    const {userid} = req.user;
    const {chatId} = req.params;
    const {text} = req.body

    try {
        // checking that the particular chat belong to us or not
        const chat = await prisma.chat.findUnique({
            where:{
                id:chatId,
                userIds:{
                    hasSome:[userid]
                }
            }
        })
        if(!chat) return res.status(404).json({message:"Chat do not belongs to you OR Chat does not exist"});

        const newMessage = await prisma.message.create({
            data:{
                text,
                chatId,
                userId:userid
            }
        })
        await prisma.chat.update({
            where:{
                id:chatId
            },
            data:{
                seenBy:[userid],
                lastMessage:text
            }
        })

        return res.status(200).json({message:"Message sent successfully",message:newMessage});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }
}