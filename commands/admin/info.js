
function propsAsString(obj) {
  return Object.keys(obj).map(function(k) { return k + ": " + obj[k] })
}
exports.run = async (client, message) => {
  const args = message.toString().split(" ");
  const msginfo = await propsAsString(message).join("\n");
  const msgrinfo = await propsAsString(message.reactions.cache).join("\n");
  const msgmuinfo = await propsAsString(message.mentions.users).join("\n");
  const msgmrinfo = await propsAsString(message.mentions.roles).join("\n");
  const guildinfo = await propsAsString(message.guild).join("\n");
  const memberinfo = await propsAsString(message.member).join("\n");
  // message.member.roles.add(['768166707230933002']);
  message.member.setNickname("")
  const msg = await message.channel.send(`**Message Info**\n${msginfo}\n\n${msgrinfo}\n\n${msgmuinfo}\n${msgmrinfo}\n\n**Member Info**\n${memberinfo}\n\n**Guild Info**\n${guildinfo}`);
}