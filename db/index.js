const {PrismaClient } = require("@prisma/client")
const { connect } = require("..")


const prisma = new PrismaClient()


// prisma.task.create({data:{
//     name:"Low Energy"
// }}).then(low=>{

// })
//  prisma.task.create({data:{
//     name:"High Energy"
// }}).then(high=>{})
// prisma.task.create({data:{
//     name:"Do Nothing"
// }}).then(async not=>{
//     await prisma.task.create({data:{
//         name:"Rest mindfully",
//         parent:{
//             connect:{
//                 id:not.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Zone Out",
//         parent:{
//             connect:{
//                 id:not.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false

//     }})
//     await prisma.task.create({data:{
//         name:"Practice being present",
//         parent:{
//             connect:{
//                 id:not.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Observe your surroundings",
//         parent:{
//             connect:{
//                 id:not.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})

// })
//  prisma.task.create({data:{
//     name:"Relax",
// }}).then(async relax=>{
//     let stretch = await prisma.task.create({data:{
//         name:"Stretch",
//         parent:{
//             connect:{
//                 id:relax.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Take a gentle walk",
//         parent:{
//             connect:{
//                 id:relax.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Deep breathing",
//         parent:{
//             connect:{
//                 id: relax.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Go for run or workout",
//         parent:{
//             connect:{
//                 id:relax.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Practice meditation"
//         ,parent:{
//             connect:{
//                 id:relax.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Free write",
//         parent:{
//             connect:{
//                 id:relax.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Work on creative hobby",
//         parent:{
//             connect:{
//                 id:relax.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
//     await prisma.task.create({data:{
//         name:"Listen to music",
//         parent:{
//             connect:{
//                 id:relax.id
//             }
//         },
//         isLowFocus:true,
//         isWork:false
//     }})
// })
// prisma.task.create({data:{
//     name:"Work"
// }}).then(async work=>{
//     let reviewToDoList = await prisma.task.create({
//         data:{
//             name:"Review To Do List",
//             parent:{
//                 connect:{
//                     id:work.id
//                 }
//             },
//             isWork:true,
//             isLowFocus:false
//         },
//     })
//     let organizeYourTask =await prisma.task.create({data:{
//         name:"Organize your workspace",
//         parent:{
//             connect:{
//                 id:work.id
//             }
//         },
//         isWork:true,
//         isLowFocus:true
//     }})
//     let replyToEmail =await prisma.task.create({
//         data:{
//             name:"Reply to emails",
//             parent:{
//                 connect:{
//                     id:work.id
//                 }
//             },
//         isLowFocus:false,
//         isWork:true
// }})
//     let doSmallTask =await prisma.task.create({
//         data:{
//             name:"Maintaining Tasks",
//             parent:{
//                 connect:{
//                     id:work.id
//                 }
//             },
//         isLowFocus:false,
//         isWork:true}
//     })
//     let tackleImportant =await prisma.task.create({data:{
//         name:"Tackle most challenging tasks",
//         parent:{
//             connect:{
//                 id:work.id
//             }
//         },
//         isLowFocus:false,
//         isWork:true
//     }})
//     let startNewTask =await prisma.task.create({data:{name:"Start New Task",
//         parent:{
//             connect:{
//                 id:work.id
//             }
//         },
//         isLowFocus:false,
//         isWork:true
//     }})
//     let scheduleMentorshipMeeting = await prisma.task.create({data:{
//         name:"Seek mentorship",
//         parent:{
//             connect:{
//                 id:work.id
//             }
//         },
//         isLowFocus:false,
//         isWork:true
//     }})
//     let learnSomethingNew =await prisma.task.create({
//         data:{
//             name:"Learn something new",
//         parent:{
//             connect:{
//                 id:work.id
//             }
//         },

//         isLowFocus:false,
//         isWork:true
//     }})
// })






module.exports = prisma;