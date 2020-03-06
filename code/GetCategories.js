const httputil = require("./lib/HttpUtils.js")
var console = require('console')
module.exports.function = function getCategories () {

  var categoryItem = {};

  // var j=0;
 // for (var i=1; i<239 ; i++) {

 //   var  localResponse = httputil.getCategoryDescriptionAPI(i);
 //   var penguinCategory = JSON.parse(localResponse.responseText);

 //    categoryItem.data = categoryItem.data + penguinCategory.data.categories[0].catId+ "|"+ penguinCategory.data.categories[0].description+"|";
 //    console.log(penguinCategory.data.categories[0].catId+ "|"+ penguinCategory.data.categories[0].description);
 // }

  categoryItem.formatText = "eBooks and books";
  categoryItem.fiction =  "Action and Adventure\n"+ 
         "General literary\n"+
         "Anthologies\n"+
         "Classics\n"+
         "Crime, Thrillers and Mystery\n"+
         "Fantasy\n"+
         "Graphic Novel\n"+
         "Horror\n"+
         "Romance\n"+   
         "Poetry\n"+ 
         "Science Fiction\n"+   
         "Short Stories\n";   

  categoryItem.nonFiction =  "Art Architecture and Photography\n"+ 
         "Biographies\n"+
         "Business Economics and Law\n"+
         "Computing and Technology\n"+
         "Education and Reference\n"+
         "Food and Drink\n"+
         "Health and Lifestyle\n"+
         "History\n"+
         "Music Stage and Screen\n"+   
         "Politics Philosophy and Culture\n"+ 
         "Science and Nature\n"+   
         "Spirituality and Beliefs\n"+   
         "Sports\n"+ 
         "Travel\n";                                                     

  return categoryItem;
}
