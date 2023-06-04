const piexif = require("piexifjs");
const fs = require("fs");
const Jimp = require("jimp");
if (!fs.existsSync("./location.json")) {
  fs.writeFileSync("./location.json", JSON.stringify({}));
}
let locations = fs.readFileSync("./location.json");
locations = JSON.parse(locations);

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / 3600;

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  }

  return dd;
}

function arrToVal(arr) {
  return arr[0] / arr[1];
}

let file_path = "./images/";
var mime = "image/jpg";
var encoding = "base64";
for (let img of fs.readdirSync(file_path)) {
  if (img == ".DS_Store") continue;
  if (locations[img] == undefined) {
    var data = fs.readFileSync(file_path + img).toString(encoding);

    var uri = "data:" + mime + ";" + encoding + "," + data;

    let exifObj = piexif.load(uri);
    let stripped = piexif.remove(uri);
    piexif.remove(uri);

    let lat = exifObj.GPS[2];
    let lon = exifObj.GPS[4];

    Jimp.read(Buffer.from(stripped.substring(23), "base64"))
      .then((pic) => {
        return pic
          .resize(1000, Jimp.AUTO)
          .quality(60)
          .write("./stripped/" + img);
      })
      .catch((err) => {
        console.error(err);
      });
    locations[img] = {
      lat: ConvertDMSToDD(
        arrToVal(lat[0]),
        arrToVal(lat[1]),
        arrToVal(lat[2]),
        exifObj.GPS[1]
      ),
      lng: ConvertDMSToDD(
        arrToVal(lon[0]),
        arrToVal(lon[1]),
        arrToVal(lon[2]),
        exifObj.GPS[3]
      ),
    };
    fs.writeFileSync("./location.json", JSON.stringify(locations));
  }
}
