import prisma from "../lib/prisma.js"

export const getChats = async (req,res) => {
    const {userid} = req.user;
    try {
        const chats = await prisma.chat.findMany({
            where:{
                userIds:{
                    hasSome:[userid]
                }
            }
        })
        // console.log(chats);

        //getting the another user details which is chating with me
        for (const chat of chats) {
            // console.log(chat.id);
            const receiverId = chat.userIds.find((id)=>id!=userid);
            const receiver = prisma.user.findUnique({
                where:{
                    id:receiverId
                },
                select:{
                    id:true,
                    username:true
                }
            })
        }
        return res.status(200).json({message:"All Chats retrieved successfully",chats})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({message:"Unable to get all Chats"});
    }
}

export const addChat = async (req,res) => {
    const {userid} = req.user;
    try {
        const newChat = await prisma.chat.create({
            data:{
                userIds:[userid,req.body.receiverId]
            }
        })  
        return res.status(200).json({message:"Chat created successfully",newChat})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({message:"Unable to create chat"})
    }
}

export const get_chat = async (req,res) => {
    const {chatId} = req.params;
    // const get_chat_info = await prisma.chat.findUnique({
    //     where:{id:chatId},
    //     include:{
    //         messages:{
    //             orderBy:{createdAt: "asc"}
    //         },
    //         users:{
    //             select:{
    //                 id:true,
    //                 name:true
    //             }
    //         }
    //     }
    // })

    const get_chat_info = await prisma.chat.findUnique({
        where:{
            id:chatId,
            userIds:{
                hasSome:[req.user.userid]
            }
        },
        include:{
            messages:{
                orderBy:{createdAt: "asc"},
                select:{
                    text:true
                }
            }
            // users:{
            //     select:{
            //         id:true,
            //         name:true
            //     }
            // }
        }
    })

    await prisma.chat.update({
        where:{id:chatId},
        data:{
            seenBy:{
                push: [req.user.userid]
            }
        }
    })

    return res.status(200).json({message:"Success",data:get_chat_info})
}

export const readChat = async (req, res) => {
    const {chatId} = req.params;
    const {userid} = req.user;
    const chat = await prisma.chat.update({
        where:{
            id:chatId,
            userIds:{
                hasSome:[userid]
            }
        },
        data:{
            seenBy:{
                set:[ userid]
            }
        }
    })
    return res.status(200).json({message:"Chat read",chat});
}