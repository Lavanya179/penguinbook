const httputil = require("./lib/HttpUtils.js")
var console = require('console')
module.exports.function = function getAuthorByTitle (title) {

  var authorItem = {};
  authorItem.title = httputil.initCap(title);
  var  localResponse = httputil.getAuthorOfTextAPI(title);
  var penguinAuthor = JSON.parse(localResponse.responseText);


   if (penguinAuthor.data.results[0] != null && penguinAuthor.data.results[0].author[0] != null 
       && penguinAuthor.data.results[0].author[0] ) {
          var workData = penguinAuthor.data.results[0].author[0] ;
          var authorIdArr = workData.split("|");
          var authorId =  authorIdArr[0];
          authorItem.title = penguinAuthor.data.results[0].name;
          localResponse = httputil.getAuthorByIdAPI(authorId);
          penguinAuthor = JSON.parse(localResponse.responseText);
           
           
          authorItem.imageUrl = penguinAuthor.data._links[1].href;
          if (penguinAuthor.data.spotlight != null) {
            authorItem.description = httputil.convertBreaks(penguinAuthor.data.spotlight);
          }
          authorItem.author = penguinAuthor.data.display;
         // authorItem.title = penguinAuthor.data.name;

       }
  return authorItem;

}
