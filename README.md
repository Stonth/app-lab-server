# App Lab Server
This project represents three examples of a server communicating with a client application that has been created using [Code.org](https://studio.code.org/home)'s App Lab. Essentially, it is a method for getting around with whitelist of domains that you can make HTTP requests to.

## YouTube Video
Who like reading? [How about you watch my video instead!](https://youtu.be/i-pE1P4cHIs) This repository is simply meant to provide more technical details for those who are so inclined.

## How Does It Work?
App Lab's startWebRequest function resticts the domains you can access. XMLHttpRequest is unavailable. However, App Lab will load images from any domain you want. Now, App Lab has something similiar to HTML5's Canvas API. This means that you can load images from any domain (like, a server that you are running) and paint them onto a canvas. Luckily, App Lab has a getImageData function, which I use to get the Red, Green, and Blue values from each pixel (unsigned, 8 bit integers).

So, I start by loading an image from my server. But this isn't a static image. The server parses the path and query, and treats the GET request for the image like an API call. The sever can then do some processing, which spits out some JSON. This JSON is stringified, then written as pixels in the image (using UTF-8, so 4 pixels per 3 characters). This image is then converted to PNG. I was all excited to do this without an external image processing library by writing a BMP into a buffer pixel by pixel, but sadly App Lab does not support BMP.

When the image gets recieved, it is drawn to a canvas. Then, the reversal process occurs. Bytes are put into an array, and then the array is decoded to a UTF-8 string. Then, it is parsed and returned as an object.

## App Lab Projects
The three examples (each defined by a seperate route) have seperate client projects on App Lab. Here are the links to those.
 - [Hello World](https://studio.code.org/projects/applab/9qYTMHCwXtOzNFMQm_7BroiPkUEob_oLrb_d7zjiiGw)
 - [Proxy](https://studio.code.org/projects/applab/5gPBz4yS0pvbLxQaSz3rmKcH1D81DjtO6gj3MWewq9Q)
 - [Message Board](https://studio.code.org/projects/applab/akr_ClyzQaU8oAF1T_fpVTWsgOGuTgTpnv_Ak2NHDtw)

## Why?
Watch the video.

## License
MIT License

Copyright (c) 2020 David Fine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
