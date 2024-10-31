

module.exports= function SedentaryCheck(level){

    switch(level.toLowerCase()){
        case "low":{
            return 0
        }
        case "medium":{
            return 1
        }
        case "high":{
            return 2
        }
    }
}