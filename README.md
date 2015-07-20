#Pong

This is a clone of Pong created using pure JavaScript. This is a toy project
created in order to understand the quirks of creating a game for the web.
Other features will be included as I feel the need to it.

#Playing

Just use the UP and DOWN keys. Touch still not supported.

#Building

To build this project you need to have **gulp.js** installed. Along with the **gulp**
it is necessary to install some additional plugins.

To install them, execute the following commands:

    npm install gulp-jshint --save-dev
    npm install gulp-changed --save-dev
    npm install gulp-imagemin --save-dev
    npm install gulp-strip-debug --save-dev
    npm install gulp-uglify --save-dev

To run the building process:

    gulp

It will run **jshint** on the source code, compress the images and compress the
JavaScript code.

#Embedding

Copy the content of the **dist** directory.

Include **game.js** script in your web page and create a **canvas** element.
After that, create a **Pong** object and call the **startGame** method. See
the example below:

{% highlight html %}
    <script type="text/javascript" src="js/game.js"></script>

    <script type="text/javascript">
        game = new Pong();
        game.startGame("game-canvas", "");
    </script>
{% endhighlight %}

The first parameter of the **startGame** method is the id of the canvas being used.
The second parameter is the directory where the source and images of the game are.

#License

See LICENSE file in this directory.
