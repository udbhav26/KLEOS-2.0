const machines = require("../models/machines");
const user = require("../models/user");
const jwt = require("jsonwebtoken");


async function getPrediction(data) {
    // Example features, ensure it matches your model's expected input
    const features = [];
    for(const key in data){
        features.push(data[key]);
    } 
    const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
    });
    const res = await response.json();
    console.log('Prediction:', res);
    return res;
}

exports.machineRegister = async (req,res) => {
    const {name,TotalUsedCycle,data} = req.body;
    const token = jwt.decode(req.body.token);
    const mlResult = await getPrediction(req.body.data);
    const LifeCycle = mlResult.prediction[0][0];
    const currentCondition = mlResult.pipe_pred[0];

    const Machine_entry = await machines.create({name,LifeCycle,TotalUsedCycle,currentCondition,data,assignedTo : token.id});
    const updation = await user.findByIdAndUpdate(token.id,{$push : {reg_machines : Machine_entry._id}},{new : true});
    if(Machine_entry && updation){
        return res.status(200).json({
            message : "success"
        })
    }
    else{
        return res.status(200).json({
            message : "machine registeration failed"
        })
    }
}