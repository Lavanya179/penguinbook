const httputil = require("./lib/HttpUtils.js")
var console = require('console')
module.exports.function = function getBooksByCategory (parentGenre, childGenre, page, format) {

    var bookCategoryItemList = [];
    var bookCategoryItem = {};  


    var fictionCategories = ["Action" ,"General","Anthologies" ,"Classics" ,"Crime","Fantasy",
            "Graphic+Novels","Horror","Poetry","Romance","Science+Fiction","Short+Stories","The+Classics" ];

    parentGenre = null;

    for (var i=0; i < fictionCategories.length; i++){
      if (fictionCategories[i]==childGenre) {
        parentGenre='Fiction';
        break;
      }
    }
    if (parentGenre == null){
      parentGenre ='NonFiction';
    }

    if (page==null || typeof page == 'undefined' || page == '' ) {
      page=1;
    } else {
      page = page.toLowerCase().replace("page ","");
    }

    var booksInPrint=0;

    var localResponse = httputil.getBooksByCategoryAPI(parentGenre, childGenre, page, format);

    var penguinBooks = JSON.parse(localResponse.responseText);

    if (penguinBooks.results != null && penguinBooks.results[0] != null) {

      for(var i = 0; i  < penguinBooks.results.length; i++) {
        var authorExists= false;

        for (var j = 0; j  < bookCategoryItemList.length; j++) {
          if (penguinBooks.results[i].authorName == bookCategoryItemList[j].author ) {
            authorExists = true;
            break; 
          }
          if (penguinBooks.results[i].bookTitle.toUpperCase().includes("DR WHO") && 
             bookCategoryItemList[j].title.toUpperCase().includes("DR WHO") ) {
            authorExists = true;
            break; 
          }
         if (penguinBooks.results[i].bookTitle.toUpperCase().includes("DOCTOR WHO") && 
             bookCategoryItemList[j].title.toUpperCase().includes("DOCTOR WHO") ) {
            authorExists = true;
            break; 
          }
          if (penguinBooks.results[i].bookTitle.toUpperCase().includes("STAR WARS") && 
             bookCategoryItemList[j].title.toUpperCase().includes("STAR WARS") ) {
            authorExists = true;
            break; 
          }          
        }
        
        if (penguinBooks.results[i].authorName == null ||
            penguinBooks.results[i].authorName == '' ||  
            typeof penguinBooks.results[i].authorName === 'undefined') {
          continue;
        }
        if (penguinBooks.results[i].coverImage.includes("default-book-jacket.png")) {
          continue;
        }
        if (penguinBooks.results[i].synopsis.toUpperCase().includes("PRE-ORDER") || penguinBooks.results[i].synopsis.toUpperCase().includes("PREORDER") ) {
          continue;
        } 
        if (!authorExists ){

   
         //   var  localResponse = httputil.getAuthorIdAPI(penguinBooks.results[i].authorName);
         //   var penguinAuthors = JSON.parse(localResponse.responseText);
         //   if (penguinAuthors.data.results != null && penguinAuthors.data.results.author != null 
         //     && penguinAuthors.data.results.author[0]  && penguinAuthors.data.results.author[0].seoFriendlyUrl != null) 
         //   {
              bookCategoryItem.parentGenre = parentGenre; 
              if (penguinBooks.pagination.next != "") {
                var integer = parseInt(page, 10);
                integer = integer + 1; 
                bookCategoryItem.page = "page "+integer;
              } else {
                bookCategoryItem.page = null;
              }

             if (parentGenre=='Fiction') {
                bookCategoryItem.parentGenreText='Stories';
              } else {
                bookCategoryItem.parentGenreText='Books';
              }
              bookCategoryItem.title = penguinBooks.results[i].bookTitle ;
              bookCategoryItem.parentGenre = parentGenre;

              bookCategoryItem.childGenreText = childGenre.replace(/\+/g," ");
              if (bookCategoryItem.childGenreText=='Science Fiction') {
                bookCategoryItem.childGenreText='Sci-Fi';
              }
              bookCategoryItem.childGenre = childGenre;
              bookCategoryItem.format= format;

              bookCategoryItem.author = penguinBooks.results[i].authorName.replace("è","e") ;
            //  bookCategoryItem.author = "▬"+" "+"▬"+" "+"♥"+" "+"♥"+" "+"♥"+bookCategoryItem.author.replace("é","e") ;
              bookCategoryItem.author = bookCategoryItem.author.replace("é","e") ;
            
              console.log("authors name: "+bookCategoryItem.author );
              bookCategoryItem.description = penguinBooks.results[i].synopsis ;
              bookCategoryItem.imageUrl =  "https://www.penguin.co.uk" +penguinBooks.results[i].coverImage + ".transform/PRHDesktopWide_small/image.jpg";

              if (format==null || format!="Ebook") {
                bookCategoryItem.theURL = "https://www.waterstones.com/books/search/term/"
                 + bookCategoryItem.title +" by "+bookCategoryItem.author;
                

                var bookURL = "https://www.waterstones.com/book/";
                var localResponse = httputil.getFirstReviewForBookAPI
                      (bookURL,bookCategoryItem.author,
                      bookCategoryItem.title,
                      penguinBooks.results[i].isbn13,
                      penguinBooks.results[i].url );

                bookCategoryItem.theURL = localResponse.shopURL;
                if (localResponse.reviewStars=="0") {
                  bookCategoryItem.reviewTitle = "No review available";
                  bookCategoryItem.reviewText = "No review available";
                  bookCategoryItem.reviewStars = " "; 
                } else {
                  var reviewArray = localResponse.reviewText.split(" ");
                  var ii=0;
                  var jj=0;
                  for (var j=0; j<reviewArray.length;j++) {
                  if (jj>2){
                    reviewArray[j] = "";
                  }
                    ii=ii+1;
                    if (ii==5) {
                      jj=jj+1;
                      if (jj==3) {
                        reviewArray[j] = reviewArray[j]+"...";
                      } else{
                        reviewArray[j] = reviewArray[j]+"\n";
                      }
                      ii=0;
                    }
                  }
                  localResponse.reviewText =reviewArray.join(" ");

                  bookCategoryItem.reviewTitle = localResponse.reviewTitle;
                
                if (localResponse.reviewStars==1) {
                  bookCategoryItem.reviewStars = "*" ;
                }
                if (localResponse.reviewStars==2) {
                  bookCategoryItem.reviewStars = "*" + " "+ "*";
                }
                if (localResponse.reviewStars==3) {
                  bookCategoryItem.reviewStars = "*" + " "+ "*"+" "+"*";
                }
                if (localResponse.reviewStars==4) {
                  bookCategoryItem.reviewStars = "*" + " "+ "*"+" "+"*"+" "+"*";
                }
                if (localResponse.reviewStars==5) {
                  bookCategoryItem.reviewStars = "*" + " "+ "*"+" "+"*"+" "+"*"+" "+"*";
                }
                bookCategoryItem.reviewText = "Book Review\n"+ bookCategoryItem.reviewStars +"\n"+  bookCategoryItem.reviewTitle+"\n" 
                              +localResponse.reviewText;
                }            

              } else {   
                bookCategoryItem.theURL ="https://www.kobo.com/gb/en/search?query="+ bookCategoryItem.title+" by "+bookCategoryItem.author
                +"&ac=1&acp=laz&ac.title="+bookCategoryItem.title+"&ac.author="+bookCategoryItem.author;  
              }
              bookCategoryItemList.push(bookCategoryItem);
              bookCategoryItem = {};
        //    }
       //   }
        }
      }
    }
    return bookCategoryItemList;
}
