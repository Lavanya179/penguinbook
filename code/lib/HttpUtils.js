var console = require('console')
var http = require('http')
var config = require('config')

module.exports.initCap = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



module.exports.convertBreaks = function(textBlock) {
    var textBlock = textBlock.replace(/<br>/g, "\n");
    textBlock = textBlock.replace(/<br\/>/g, "\n");
    textBlock = textBlock.replace(/<p>/g, "\n");
    textBlock = textBlock.replace(/<\/p>/g, "\n");
    textBlock = textBlock.replace(/<i>/g, "'");
    textBlock = textBlock.toLowerCase().replace(/<b>/g, "");
    textBlock = textBlock.replace(/&nbsp;/g, " ");
    textBlock = textBlock.replace(/<\/i>/g, "'");
    textBlock = textBlock.replace(/&ldquo;/g, "'");
    textBlock = textBlock.replace(/&rdquo;/g, "'");
    textBlock = textBlock.replace(/&mdash;/g, "- ");    
    textBlock = textBlock.replace(/&ndash;/g, "-");  
    textBlock = textBlock.toLowerCase().replace(/<\/b>/g, "");
    textBlock = textBlock.replace(/&rsquo;/g,"");
    textBlock = textBlock.replace(/&#8217;/g, "'");
    textBlock = textBlock.replace(/&#8220;/g, "'");
    textBlock = textBlock.replace(/&#8221;/g, "'");
    textBlock = textBlock.replace(/&#160;'/g, "' ");
    textBlock = textBlock.replace(/&#8212;/g, "-");
    textBlock = textBlock.replace(/&#151;/g, " ");
    textBlock = textBlock.replace(/&#233;/g,"é");
    textBlock = textBlock.replace(/&quot;/g,"é");
    textBlock = textBlock.replace(/&#8220;/g,"");
    textBlock = textBlock.replace(/&#8221;/g,"");
    textBlock = textBlock.replace(/&#039;/g,"'");
    textBlock = textBlock.replace(/&amp;/g,"&");
    cleanedBlock = textBlock.replace(/&#160;/g, " ");

    return cleanedBlock;
}

function getRequest(url){

  var response =  http.getUrl(
    url,
    {
      returnHeaders: true,
      format: 'json',
      headers: {
        "Content-Type": "application/json"
      }
    }
  )

  return response;

}

function getRequestText(url){

  var response =  http.getUrl(
    url,
    {
      returnHeaders: true,
      format: 'text',
      headers: {
        "Content-Type": "application/text"
      }
    }
  )

  return response;

}

module.exports.getFirstReviewForBookAPI = function (theURL,author,title,isbn, penguinURL) {

  author = author.replace(/ /g,"-");
  title = title.replace(/ /g,"-"); 
  isbns = isbn.split(",");
  var reviewTitle =" ";
  var reviewStars="0";
  var review =  "No reviews available";
  var reviewInfo = {}; 


  theURL = theURL+title+"/"+author+"/"+isbns[0];
  var waterstonesURL = theURL;
  var response = getRequestText(theURL);

  console.log(theURL);
  if (response.responseText.indexOf("We did not find any results for") >= 0) {

      theURL = penguinURL;
      reviewInfo.reviewTitle = reviewTitle;
      reviewInfo.reviewStars = reviewStars;
      reviewInfo.reviewText = review;
      reviewInfo.shopURL = theURL; 
      return reviewInfo;
  } 
  if (response.responseText.indexOf("review-top review-list-item clearfix") != -1){
    review = response.responseText.substring( response.responseText.indexOf("review-top review-list-item clearfix")+2 );
      if (review != null ) {
      review = review.substring(review.indexOf("itemprop=")+7);
      if (review!=null) {
        reviewTitle="";
        if (review.indexOf("</h3>")!=-1) {
          reviewTitle = review.substring(9,review.indexOf("</h3>"));
          reviewTitle = module.exports.convertBreaks(reviewTitle);
        }
        if (review!=null) {
          review = review.substring(review.indexOf("\"description\">")+14);
          if (review!=null) {

            reviewStars = review.substring(review.indexOf("<meta itemprop=\"bestRating\" content=\"5\"/>"));
            reviewStars = reviewStars.substring(0,reviewStars.indexOf("<a class=\"user link-invert\""));
            reviewStars = (reviewStars.match(/active/g) || []).length;

            if (review.indexOf("/books/reviews/isbn/"+isbns[0])!=-1) {
              review = review.substring(0,review.indexOf("<a href")-7);
            } else {
              review = review.substring(0,review.indexOf("</p>")-4);
            }
            review = module.exports.convertBreaks(review); 
          }
        }
      }
    }
  }
  reviewInfo.reviewTitle = reviewTitle;
  reviewInfo.reviewStars = reviewStars;
  reviewInfo.reviewText = review;
  reviewInfo.shopURL = waterstonesURL;
  return reviewInfo;
}
module.exports.getBooksByCategoryAPI = function (parentCategory, childCategory, page, format) {
  var baseURL = config.get("baseUK.url");
  var lastCategory='';
  if (childCategory=="Crime"){
    childCategory="Crime,+Thrillers+%26+Mystery";
  }

  childCategory=childCategory.replace(/&/g,"%26");

  if (childCategory=="Action"){
    childCategory="Action+%26+Adventure";
  }

  if (childCategory=="Art+Architecture+Photography") {
    childCategory="Art,+Architecture+%26+Photography";
  }
  if (format=="Ebook"){
    format="&x2=format&q2=eBook";
  } else {
    format='';
  }

  if (parentCategory=="NonFiction"){
    parentCategory="Non-Fiction";
  }

  var url = baseURL+"&x1=genre_2&q1="+childCategory+"&x2=genre_1&q2="+parentCategory+"&x3=template&q3=book"+format+"&m_sort_book=publicationDate&m_results_per_page=20&page="+page;

 console.log(url);

  var response = getRequest(url);
  return response;

}

module.exports.getCategoryDescriptionAPI = function (categoryId) {
  var baseURL = config.get("base.url");
  var apiKey = config.get("client.id");

  var url = baseURL+"/categories/"+categoryId+"?api_key="+apiKey;
  var response = getRequest(url);
  return response;

}

module.exports.hasBookBeenPublished = function (isbn){


  var baseURL = config.get("base.url");
  var apiKey = config.get("client.id");
 var url =  baseURL+"/titles/"+isbn+"?api_key="+apiKey;
  var response = getRequest(url);
  return response;
}

module.exports.getAuthorOfTextAPI = function (searchQuery) {

  var baseURL = config.get("base.url");
  var apiKey = config.get("client.id");
  var titleOfText='';
  if (searchQuery != null) {
    titleOfText = searchQuery.replace(/ /g, "+");
    titleOfText = titleOfText.replace(/'/g,"%27");
  }
  var url = baseURL+"/search?rows=1&q="+titleOfText+"&api_key="+apiKey;
  var response = getRequest(url);
  return response;
}

module.exports.getAuthorByIdAPI = function (authorId) {

  var baseURL = config.get("base.url");
  var apiKey = config.get("client.id");
  var url = baseURL+"/authors/"+authorId+"/views/author-display?api_key="+apiKey;
  var response = getRequest(url);
  return response;
}

module.exports.getContentAPI = function(bookRefId) {

  var baseURL = config.get("base.url");
  var apiKey = config.get("client.id");
  var url =  baseURL+"/titles/"+bookRefId+"/content?sort=score&api_key="+apiKey;
   var response = getRequest(url);
  return response;

}


module.exports.getAuthorIdAPI = function(author){
   var baseURL = config.get("baseUK.url");
 /* var apiKey = config.get("client.id");

  var authorArray = author.split(" ");
  for (i = 0; i < authorArray.length; i++) {
     if (authorArray[i].length==1) {
      authorArray[i] = authorArray[i]+".";
     }
     if (authorArray[0].length==4) {
       var initialArray = authorArray[0].split(".");
       if (initialArray.length==3){
         authorArray[0] = initialArray[0]+". "+initialArray[1]+".";
       }
     }
  }*/

  //https://prh.guided.lon5.atomz.com/?i=1;q=edgar+allan+poe;q1=book;sp_cs=UTF-8;sp_staged=0;x1=template
 /* authorFixed = authorArray.join();
  authorFixed = authorFixed.replace(/,/g," ");
  var authorEnc = authorFixed.replace(/ /g, "+");*/

  author = author.replace(/ /g,"+");
  var url =  baseURL+";i=1;q="+author+";q1=book;x1=template";

  var response = getRequest(url);
  return response;

}


module.exports.getBooksAPI = function(authorId, startFrom){
  if (startFrom==null) {
    startFrom=0;
  }
  var baseURL = config.get("base.url");
  var apiKey = config.get("client.id");
  var url =  baseURL+"/authors/"+authorId+"/titles?sort=score&start="+startFrom+"&api_key="+apiKey;

  var response = getRequest(url);
  return response;

}
