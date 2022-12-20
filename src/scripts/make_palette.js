var fs = require("fs");

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

var alpine = ["#C0E7D7", "#52D9A5", "#6FA88E", "#151C18"];
var lavendar = ["#D5BFEF", "#8764B3", "#8A3BEC", "#131118"];
var tidal = ["#BFE3EF", "#64A0B3", "#3BC0EC", "#111718"];
var crimson = ["#EFBFC7", "#B36473", "#EC3B5B", "#181113"];
var sunshine = ["#FFDAA8", "#FFAA2C", "#FF9218", "#311400"];
var noir = ["#E6E6E6", "#979797", "#8A8A8A", "#070707"];
var allColors = [alpine, lavendar, tidal, crimson, sunshine, noir];

var data = [];
var obj = {};
var hexColorsSet;
for (let j = 0; j < allColors.length; j++) {
  obj = {};
  hexColorsSet = allColors[j];
  for (let i = 0; i < hexColorsSet.length; i++) {
    var hex = hexColorsSet[i];
    var rgb = hexToRgb(hex);
    var prop_r = `R${i + 1}`;
    var prop_g = `G${i + 1}`;
    var prop_b = `B${i + 1}`;
    obj[prop_r] = rgb["r"].toString();
    obj[prop_g] = rgb["g"].toString();
    obj[prop_b] = rgb["b"].toString();
  }
  data.push(obj);
}

fs.writeFile("palette.json", JSON.stringify(data), function (err) {
  if (err) throw err;
  console.log("complete");
});
