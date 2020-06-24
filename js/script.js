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

// h2については、IDの振り直しついでにIndex用にh2の内容を配列に入れて、チェックボックス化して、Webページの上部に挿入する
var secArray = []; // 空の配列の準備

// 前半はID振り直し。後半はh2のテキストを取得して、配列に入れ込んでいる。
$("h2").each(function(i){
  var sectionID = $(this).attr("id");
  var parent = $(this).parent();
  $(parent).find("h3").each(function(n){
    n=n+1;
    $(this).attr("id", "sub" + sectionID + "-" + n);
  });
  var secHead = $(this).text()
  secArray.push(secHead);
});
// console.log(secArray);
var secArray_sorted = secArray.reverse(); // このままだとhtml挿入時に逆順になってしまうので、あらかじめ配列の中身を逆順に変えておく。

// 配列の中身を使って、Sort用のHTMLパーツの生成
$.each(secArray_sorted, function(i, val){
  var chkbox = '<label for="'+i+'"><input id="'+i+'" type="checkbox">' + val + '</label>';
  console.log(chkbox);
  $("h1").after(chkbox);
});