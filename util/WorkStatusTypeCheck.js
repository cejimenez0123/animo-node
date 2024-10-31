


module.exports = function workStatusTypeCheck(workStatus){
    switch(workStatus.toLowerCase()){
        case "unemployed":{
            return "unemployed"
        }
        case "student":{
            return "student"
        }
        case "full time work":{
            return "fulltime"
        }
        case "self employed":{
            return "selfemployed"
        }
        case "retired":{
            return "retired"
        }
        case "part time work":{
            return "parttime"
        }
            
            
          
           
        }
}