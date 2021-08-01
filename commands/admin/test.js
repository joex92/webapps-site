const request = require('request');

function ValidateEmail(inputText) {
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(inputText.match(mailformat)) {
    return true;
  } else {
    return false;
  }
}

function propsAsString(obj) {
  return Object.keys(obj).map(function(k) { return k + ": " + obj[k] })
}

exports.run = async (client, message) => {
  const args = message.toString().split(" ");
  const msg = await message.channel.send(`${args[0]}?`);
  if (ValidateEmail(args[1])){
    // var data;
    const trumail = `https://api.trumail.io/v2/lookups/json?email=${args[1]}`;
    const emailchecker = `https://api.emailverifyapi.com/v3/lookups/json?key=95C087C09D71E5B7&email=${args[1]}`;
    const options = {
      method: 'GET',
      url: 'https://rapidapi.p.rapidapi.com/',
      qs: {domain: 'mailinator.com'},
      headers: {
        'x-rapidapi-host': 'mailcheck.p.rapidapi.com',
        'x-rapidapi-key': '04d5b2143bmshabb0e353d730796p134d05jsn907a25772e31',
        useQueryString: true
      }
    };
    request(options, function (error, response, body) {
      if (error) {
          msg.edit(error.toString());
      };
      msg.edit(`${options.url}\n${propsAsString(body).join('\n')}`);
    });
    // const ops = {json: true};
    // request(trumail, ops, (error, res, body) => {
    //   if (error) {
    //       msg.edit(error.toString());
    //   };
    //   if (!error && res.statusCode == 200) {
    //       // do something with JSON, using the 'body' variable
    //       if (propsAsString(body).length > 1){
    //         msg.edit(`${trumail}\n${propsAsString(body).join('\n')}`);
    //       }
    //       else {
    //         request(emailchecker, ops, (error, res, body) => {
    //           if (error) {
    //               msg.edit(error.toString());
    //           };
    //           if (!error && res.statusCode == 200) {
    //               // do something with JSON, using the 'body' variable
    //               msg.edit(`${emailchecker}\n${propsAsString(body).join('\n')}`);
    //           };
    //         });
    //       }
    //   };
    // });
  }
  else {
    msg.edit(`${args[1]} is not valid`)
  }
}