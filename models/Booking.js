const mongoose=require('mongoose');
const Schema=mongoose.Schema;

// const Bookschemma=new Schema({
//     to:{
//         require:true,
//         type:String
//     },
//     from:{
//         require:true,
//         type:String
//     },
//     date:{
//         require:true,
//         type:Date
//     },
//     preference:{
//         require:true,
//         type:String
//     }
// })

const bookingSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    train: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Train', required: true 
    },
    seatClass: { 
        type: String, 
        enum: ['sleeper', 'ac', 'general'], 
        required: true 
    },
    seatNumber: String,
    date: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'Booked' 
    }, // Booked, Cancelled
    fare: Number
}, { timestamps: true });


module.exports=mongoose.model('Booking',bookingSchema)