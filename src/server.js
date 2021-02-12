var PROTO_PATH = __dirname + "/user.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const db = require("./db");
const User = require("./user");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var user_proto = grpc.loadPackageDefinition(packageDefinition).user;

function getAllUsers(call, callback) {
  User.find({}).then((res) => {
    callback(null, { message: JSON.stringify(res) });
  });
}
function createUser(call, callback) {
  var user = new User({
    name: call.request.name,
    email: call.request.email,
  });
  console.log(call.request);
  user.save(function (err, res) {
    if (err) {
      console.error(err);
      callback(null, { message: JSON.stringify(err) });
    } else {
      console.log(JSON.stringify(res, undefined, 2));
      callback(null, { message: JSON.stringify(res) });
    }
  });
}

function updateUser(call, callback) {
  console.log(`_id: ${call.request._id}`);
  console.log(`friends: ${call.request.friends}`);
  User.updateOne(
    { _id: call.request._id },
    { $set: { friends: call.request.friends, lists: call.request.lists } },
    { runValidators: true }
  ).then((err, result) => {
    if (err) {
      console.error(JSON.stringify(err));
      callback(null, { message: JSON.stringify(err) });
    } else {
      console.log(JSON.stringify(result, undefined, 2));
      callback(null, { message: JSON.stringify(result) });
    }
  });
}
// function deleteUser(call, callback) {}
function getUser(call, callback) {
  User.find({ email: call.request.email }).then((res) => {
    callback(null, { message: JSON.stringify(res) });
  });
}

function deleteUser(call, callback) {
  User.deleteOne({ email: call.request.email }).then((res) => {
    callback(null, { message: JSON.stringify(res) });
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(user_proto.User.service, {
    createUser: createUser,
    getUser: getUser,
    getAllUsers: getAllUsers,
    deleteUser: deleteUser,
    updateUser: updateUser,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();
