function propsAsString(obj) {
  return Object.keys(obj).map(function(k) { return k + ": " + obj[k] })
}
exports.run = async (client, message) => {
  const msg = await message.channel.send("Ping?");
  msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${client.ping}ms`);
}