console.log("register function");
// register Caman Processing
Caman.Filter.register("channel2", function (adjust) {
    this.process("channel2", function (rgba) {
        rgba.r = rgba.g;
        rgba.b = rgba.g;
        return rgba;
    });
})

Caman.Filter.register("channel3", function (adjust) {
    this.process("channel3", function (rgba) {
    rgba.g = rgba.r;
    rgba.b = rgba.r;
    return rgba;
    })
})

// Caman.Plugin.register("crop", function(width, height, x, y) {
//     var canvas, ctx;
//     if (x == null) {
//       x = 0;
//     }
//     if (y == null) {
//       y = 0;
//     }
  
//     // Support NodeJS by checking for exports object
//     if (typeof exports !== "undefined" && exports !== null) {
//       canvas = new Canvas(width, height);
//     } else {
//       canvas = document.createElement('canvas');
//       canvas.width = width;
//       canvas.height = height;
//     }
  
//     // Get the new context and draw a portion of the current canvas
//     // to the new canvas.
//     ctx = canvas.getContext('2d');
//     ctx.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
  
//     // Tell CamanJS to replace the current canvas with our new cropped one.
//     this.replaceCanvas(canvas);
//   });
  
//   // Register our filter for the plugin
//   Caman.Filter.register("crop", function() {
//     // Here we call processPlugin so CamanJS knows how to handle it
//     this.processPlugin("crop", arguments);
//   });