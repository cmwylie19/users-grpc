var PROTO_PATH = __dirname + '/user.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
const db = require('./db')
const User =require('./user')
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var user_proto = grpc.loadPackageDefinition(packageDefinition).user;

function createUser(call, callback) {
    var user = new User({
      name: call.request.name,
      email: call.request.email
    });
    console.log(call.request);
    user.save(function (err,res) {
      if (err) {
        console.error(err)
        callback(null, {message: JSON.stringify(err)});
      } else {
        console.log(JSON.stringify(res,undefined,2))
        callback(null, {message: JSON.stringify(res)});
      }
    });
}

function updateUser(call, callback){
  User.updateOne(
        { email: call.request.email },
      { $set: { friends: call.request.friends, lists: call.request.lists } },
        { runValidators: true }
      ).exec((err, result) => {
        if (err) {
          console.error(err)
          callback(null, {message: JSON.stringify(err)});
        } else {
          console.log(JSON.stringify(res,undefined,2))
          callback(null, {message: JSON.stringify(res)});
        }
      })
}
// function deleteUser(call, callback) {}
function getUser(call, callback) {
    User.find({email:call.request.email}).then(res=>{
      callback(null, {message: JSON.stringify(res)});
    })
}

// exports.delete = (req, res) => {
//   Task.deleteOne({ _id: req.body._id }).exec((err, result) => {
//     if (err) {
//       res.send(400, err);
//     }
//     res.send(result);
//   });
// };

// exports.create = function (req, res) {
//   var newTask = new Task(req.body);
//   console.log(req.body);
//   newTask.save(function (err) {
//     if (err) {
//       res.status(400).send(err + " Unable to save task to database");
//     } else {
//       // res.redirect("/tasks/gettask");
//       res.send(`added task`);
//     }
//   });
// };

// exports.update = (req, res) => {
//   Task.updateOne(
//     { _id: req.body._id },
//     { $set: { ts: Date.now().toString(), title: req.body.title } },
//     { runValidators: true }
//   ).exec((err, result) => {
//     if (err) {
//       res.send(400, err);
//     }
//     res.send(result);
//   });
// };

// exports.listOne = function (req, res) {
//   Task.find({_id:req.params.id}).exec(function (err, tasks) {
//     if (err) {
//       return res.send(500, err);
//     }
//     res.send({
//       tasks: tasks,
//     });
//   });
// };


// exports.list = function (req, res) {
//   Task.find({}).exec(function (err, tasks) {
//     if (err) {
//       return res.send(500, err);
//     }
//     res.send({
//       tasks: tasks,
//     });
//   });
// };


function main() {
  var server = new grpc.Server();
  server.addService(user_proto.User.service, {createUser: createUser,getUser:getUser,updateUser:updateUser});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
