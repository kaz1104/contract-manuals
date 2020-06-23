
// 章ごとにWrapする
$("body").find("h2").each(function(){
  var $this = $(this); //nextUntilの中に入れるため
  $this.nextUntil($this.prop("tagName")).addBack().wrapAll("<section class='chapter__wrapper'></section>");
});

// Wrapされた章ごとの中で各条項をWrapする
$(".chapter__wrapper").find("h3").each(function(){
  var $this = $(this); //nextUntilの中に入れるため
  $this.nextUntil($this.prop("tagName")).addBack().wrapAll("<section class='article__wrapper'></section>");
});

// IDの振り直し
$("h2").each(function(i){
  i=i+1;
  $(this).attr("id", "section_"+i);
});

// $("h3").each(function(i){
//   i=i+1;
//   $(this).attr("id", "subSection_"+i);
// })

$("h2").each(function(i){
  var sectionID = $(this).attr("id");
  var parent = $(this).parent();
  $(parent).find("h3").each(function(n){
    n=n+1;
    $(this).attr("id", "sub" + sectionID + "-" + n);
  });
});