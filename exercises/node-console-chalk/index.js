const http = require("http");
const ca = require("chalk-animation");
const chalk = require("chalk");
const qs = require("querystring");

const server = http.createServer((req, res) => {
    if (req.on("error", err => console.log(err)));
    if (res.on("error", err => console.log(err)));

    if (req.method == "GET") {
        res.end(
            `
            <!doctype html>
            <html>
            <title>Colors</title>
            <form method="POST">
              <input type="text" name="text">
              <select name="color">
                <option value="red">red</option>
                <option value="blue">blue</option>
                <option value="green">green</option>
                <option value="yellow">yellow</option>
                <option value="gray">gray</option>
                <option value="magenta">magenta</option>
                <option value="cyan">cyan</option>
              </select>
              <button type="submit">Go</button>
            </form>
            </html>`
        );
    }
    if (req.method == "POST") {
        var body = "";
        req.on("data", function(chunk) {
            body += chunk;
        }).on("end", function() {
            let myBody = qs.parse(body);
            console.log(chalk.keyword(myBody.color)(myBody.text));

            res.end(`<!doctype html>
<html>
<title> ${myBody.text} </title>
<a href="/" style="color: ${myBody.color} "> ${myBody.text} </a>
</html>`);
        });
    }
});

server.listen(8080, () => ca.rainbow("listening"));

//
//
// let server = http.createServer(function(request, response) {
//     if (request.method == "GET") {
//         response.statusCode = 200;
//         response.setHeader("Content-type", "text/html");
//         response.end(
//             '<!doctype html><html><title>Colors</title><form method="POST"><input type="text" name="text"><select name="color"><option value="red">red</option><option value="blue">blue</option><option value="green">green</option><option value="yellow">yellow</option><option value="gray">gray</option><option value="magenta">magenta</option><option value="cyan">cyan</option></select><button type="submit">Go</button></form></html>'
//         );
//     }
//     if (request.method == "POST") {
//         var body = "";
//         request
//             .on("data", function(chunk) {
//                 body += chunk;
//             })
//             .on("end", function() {
//                 console.log(body);
//                 let myBody = qs.parse(body);
//                 console.log(myBody.text);
//                 var color = myBody.color;
//                 response.end("<h1>Hello " + myBody.text + " World</h1>");
//             });
//     }
// });
// server.listen(8080, () => {
//     ca.rainbow("listening");
// });
