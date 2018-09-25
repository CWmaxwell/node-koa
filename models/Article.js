const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ArticleSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        default: Date.now
    },
    text:{
        type:String,
        required: true
    },
    visits:{
        type:Number
    },
    tar:{
        type:String
    },
    likes:[
        {
            email:{
                type:String
            },
            avatar:{
                type: String
            },
            name:{
                type: String
            }
        }
    ],
    comments:[
        {
            email:{
                type:String,
                required: true
            },
            avatar:{
                type: String
            },
            name:{
                type: String,
                required: true
            },
            date:{
                type: Date,
                default: Date.now
            },
            text:{
                type: String,
                required: true
            }
        }
    ]

})

module.exports = Article = mongoose.model("articles", ArticleSchema);