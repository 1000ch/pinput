var fs = require("fs");
var join = require("path").join;
var ChromeExtension = require("crx");

var crx = new ChromeExtension({
  rootDirectory: __dirname + "/src"
});

task("default", function() {
  crx.load(function(error) {
    if(error) {
      throw error;
    }
    this.pack(function(error, data) {
      if(error) {
        throw error;
      }
      var xml = this.generateUpdateXML();

      fs.writeFile(join(__dirname, "update.xml"), xml);
      fs.writeFile(join(__dirname, "Pinput.crx"), data);

      this.destroy();
    });
  });
});
