const httputil = require("./lib/HttpUtils.js")
var console = require('console')

function  processItemData(penguinBooksTitles, booksItemList){
  var booksItem = {}; 
  var  authorExists = true;
  for(var i = 0; i  < penguinBooksTitles.length; i++) {

    if (penguinBooksTitles[i]._links != null  ) {
      var linkObject = penguinBooksTitles[i]._links;
      if (linkObject != null ) {
        console.log("link object found");
        localResponse = httputil.getContentAPI(penguinBooksTitles[i].isbn);
        var bookDescription = JSON.parse(localResponse.responseText);

        if  ( booksItemList.length < 1) {
          booksItem.description =  bookDescription.data.content.flapcopy;
          booksItem.description = httputil.convertBreaks(bookDescription.data.content.flapcopy);
          booksItem.author= penguinBooksTitles[i].author;
          booksItem.imageUrl = penguinBooksTitles[i]._links[1].href;
          booksItem.title = penguinBooksTitles[i].title;
          booksItem.isbn = penguinBooksTitles[i].isbn;
          booksItem.childGenreText = findChildGenre(penguinBooksTitles[i].subjects); 
          booksItem.waterstonesURL = "https://www.waterstones.com/books/search/term/"+ booksItem.title
                +" by "+booksItem.author;
          booksItemList.push(booksItem);
          booksItem = {};
        } else {
          for (var j = 0; j  < booksItemList.length; j++) {
            authorExists=false;
            if (booksItemList[j].author == penguinBooksTitles[i].author
            && booksItemList[j].title == penguinBooksTitles[i].title ) {
              authorExists = true;
              break; 
            }
          }
          if (!authorExists) {
            booksItem.description =  bookDescription.data.content.flapcopy;
            booksItem.description = httputil.convertBreaks(bookDescription.data.content.flapcopy);
            booksItem.author= penguinBooksTitles[i].author;
            booksItem.imageUrl = penguinBooksTitles[i]._links[1].href;
            booksItem.title = penguinBooksTitles[i].title;
            booksItem.isbn = penguinBooksTitles[i].isbn;
            booksItem.childGenreText = findChildGenre(penguinBooksTitles[i].subjects); 
            booksItem.waterstonesURL = "https://www.waterstones.com/books/search/term/"+ booksItem.title
                +" by "+booksItem.author;
            booksItemList.push(booksItem);
            booksItem = {};
          } 
        }
      }
    }
  }
  return booksItemList;
}

function findChildGenre(subjects) {
  var fictionType = 'crime';

    if (subjects.toLowerCase().includes("science fiction")) {
       fictionType='science fiction';
    
    }
    if (subjects.toLowerCase().includes("dystopia")) {
       fictionType='science fiction';
     
    }
    if (subjects.toLowerCase().includes("future")) {
       fictionType='science fiction';
     
    }
    if (subjects.toLowerCase().includes("horror")) {
       fictionType='horror';
      
    }
    if (subjects.toLowerCase().includes("terror")) {
       fictionType='horror';
      
    }
    if (subjects.toLowerCase().includes("graphic")) {
       fictionType='graphic novels';
     
    }
    if (subjects.toLowerCase().includes("crime")) {
       fictionType='crime';
     
    }
    if (subjects.toLowerCase().includes("the classics")) {
       fictionType='the classics';
    
    }    
    if (subjects.toLowerCase().includes("classics")) {
       fictionType='classics';
      
    }
    if (subjects.toLowerCase().includes("action & adventure")) {
       fictionType='action';
      
    }
     if (subjects.toLowerCase().includes("thriller")) {
       fictionType='action';
    
    }
    if (subjects.toLowerCase().includes("fantasy")) {
       fictionType='fantasy';
     
    }    
    if (subjects.toLowerCase().includes("romance")) {
       fictionType='romance';
      
    } 
    if (subjects.toLowerCase().includes("love")) {
       fictionType='romance';
     
    }
    if (subjects.toLowerCase().includes("romp")) {
       fictionType='romance';
      
    }    
    if (subjects.toLowerCase().includes("historical")) {
       fictionType='romance';
      
    } 
    if (subjects.toLowerCase().includes("romantic")) {
       fictionType='romance';
     
    }
    if (subjects.toLowerCase().includes("murder")) {
       fictionType='crime';
     
    }
    if (subjects.toLowerCase().includes("Anthology")) {
       fictionType='Anthologies';
     
    } 
    if (subjects.toLowerCase().includes("short story")) {
       fictionType='short stories';
      
    }     

  console.log("fiction type = "+fictionType);
  return fictionType;

}

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}


function getNontAuthorBook (penguinBooksResult, firstName,surname) {
  var booksItem = {};
  booksItem.authorTitle = titleCase(firstName + " "+surname);
  booksItem.author = firstName + " "+surname;
  booksItem.description = httputil.convertBreaks(penguinBooksResult.synopsis);
  booksItem.author= penguinBooksResult.authorName;

  if (booksItem.author !=penguinBooksResult.contributors ) {
      booksItem.contributor = "Contributors: "+ penguinBooksResult.contributors;
  }

  booksItem.imageUrl =  "https://www.penguin.co.uk" +penguinBooksResult.coverImage + ".transform/PRHDesktopWide_small/image.jpg";
  booksItem.title = penguinBooksResult.bookTitle;
  booksItem.isbn = penguinBooksResult.isbn13;
  booksItem.childGenreText = findChildGenre(penguinBooksResult.synopsis); 
  booksItem.waterstonesURL = "https://www.waterstones.com/books/search/term/"+ booksItem.title
                +" by "+booksItem.author;
  return booksItem;              

}

module.exports.function = function getBooksByAuthor (firstName, middleNames, surname) {


    var booksItemList = [];
    var booksItemNotAuthorList = [];
    var booksItem = {}; 
    var booksNotAuthorItem = {};
    if (typeof firstName == "undefined" ) {
      firstName = "";
    } 
    if (typeof middleNames == "undefined" ) {
      middleNames = "";
    }
    var  localResponse = httputil.getAuthorIdAPI(firstName + " "+middleNames+" "+surname);

    var penguinBooks = JSON.parse(localResponse.responseText);

    if (penguinBooks.results != null && penguinBooks.results[0] != null) {

      for(var i = 0; i  < penguinBooks.results.length; i++) {
            if (middleNames=="") {
              booksItem.author = firstName + " "+surname;  
              booksItem.authorTitle = titleCase(firstName + " "+surname); 
            } else {
              booksItem.author = firstName + " "+middleNames+" "+surname;  
              booksItem.authorTitle = titleCase(firstName + " "+middleNames+" "+surname); 
            }        

            if ( (typeof(penguinBooks.results[i].authorName) == "undefined" ||  !penguinBooks.results[i].authorName.toLowerCase().includes(surname.toLowerCase()) )
                       && (penguinBooks.results[i].contributors == null ||
            !penguinBooks.results[i].contributors.toLowerCase().includes(surname.toLowerCase() ))) {

              booksNotAuthorItem = getNontAuthorBook (penguinBooks.results[i], firstName,surname);
              booksNotAuthorItem.unknownAuthor = "yes";
              booksNotAuthorItem.authorTitle =  titleCase(firstName + " "+middleNames+" "+surname) +" has no books published by Penguin but the author appears in these synopses"
              booksItemNotAuthorList.push(booksNotAuthorItem);
              continue;
            }
            booksItem.description = httputil.convertBreaks(penguinBooks.results[i].synopsis);
            booksItem.author= penguinBooks.results[i].authorName;

            if (booksItem.author !=penguinBooks.results[i].contributors ) {
              booksItem.contributor = "Contributors: "+ penguinBooks.results[i].contributors;
            }
            booksItem.unknownAuthor = "no";
            booksItem.imageUrl =  "https://www.penguin.co.uk" +penguinBooks.results[i].coverImage + ".transform/PRHDesktopWide_small/image.jpg";
            booksItem.title = penguinBooks.results[i].bookTitle;
            booksItem.isbn = penguinBooks.results[i].isbn13;
            booksItem.childGenreText = findChildGenre(penguinBooks.results[i].synopsis); 
            booksItem.waterstonesURL = "https://www.waterstones.com/books/search/term/"+ booksItem.title
                +" by "+booksItem.author;

            booksItem.waterstonesURL = encodeURI(booksItem.waterstonesURL);    
            booksItemList.push(booksItem);
            booksItem = {};

 
    }
    if (booksItemList.length<1) {

      return booksItemNotAuthorList;
    } 
    return booksItemList;

    }
}
