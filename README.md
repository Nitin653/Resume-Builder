# Resume-Builder

Installation
This is a Node.js module available through the npm registry. Installation is done using the npm install command:

$ npm install cookie
API
var cookie = require('cookie');
cookie.parse(str, options)
Parse an HTTP Cookie header string and returning an object of all cookie name-value pairs. The str argument is the string representing a Cookie header value and options is an optional object containing additional parsing options.

var cookies = cookie.parse('foo=bar; equation=E%3Dmc%5E2');
// { foo: 'bar', equation: 'E=mc^2' }
Options
cookie.parse accepts these properties in the options object.

decode
Specifies a function that will be used to decode a cookie's value. Since the value of a cookie has a limited character set (and must be a simple string), this function can be used to decode a previously-encoded cookie value into a JavaScript string or other object.

The default function is the global decodeURIComponent, which will decode any URL-encoded sequences into their byte representations.

note if an error is thrown from this function, the original, non-decoded cookie value will be returned as the cookie's value.

cookie.serialize(name, value, options)
Serialize a cookie name-value pair into a Set-Cookie header string. The name argument is the name for the cookie, the value argument is the value to set the cookie to, and the options argument is an optional object containing additional serialization options.

var setCookie = cookie.serialize('foo', 'bar');
// foo=bar
![Screenshot 2025-03-24 172523](https://github.com/user-attachments/assets/340b7e62-6e4f-4b8f-b2f9-1e5d221cbf4b)

Options
![Screenshot 2025-03-24 172549](https://github.com/user-attachments/assets/aa26243a-075e-45a1-a2c9-7bfb98b1e75b)



