// CSSの準備
$("style").remove();
$("head").append('<link href="https://fonts.googleapis.com/css2?family=Jaldi:wght@400&display=swap" rel="stylesheet">');
$("head").append('<link rel="stylesheet" href="./css/style.min.css">');

// 章ごとにWrapする
$("body").find("h2").each(function(){
  var $this = $(this); //nextUntilの中に入れるため
  $this.nextUntil($this.prop("tagName")).addBack().wrapAll("<section class='chapter__wrapper displayed'></section>");
});

// Wrapされた章ごとの中で各条項をWrapする
$(".chapter__wrapper").find("h3").each(function(){
  var $this = $(this); //nextUntilの中に入れるため
  $this.nextUntil($this.prop("tagName")).addBack().wrapAll("<section class='article__wrapper'></section>");
});

// Contents Area
$(".chapter__wrapper").wrapAll('<section class="contents"></section>')
$(".contents").prepend('<h4 class="secHead">Contents</h4>');

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
    $(this).attr("class", "subSection")
  });
  var secHead = $(this).text()
  secArray.push(secHead);
});
// console.log(secArray);
var secArray_sorted = secArray.reverse(); // このままだとhtml挿入時に逆順になってしまうので、あらかじめ配列の中身を逆順に変えておく。

// 配列の中身を使って、Sort用のHTMLパーツの生成
$.each(secArray_sorted, function(i, val){
  // var chkbox = '<label for="'+i+'"><input id="'+i+'" type="checkbox">' + val + '</label>';
  var filters = '<li class="filter__item filter-checked" id="'+i+'">' + val + '</li>';
  // console.log(chkbox);
  $("h1").after(filters);
  //$(filters).wrapAll('<ul class="filter__list"></ul>')
});

// Filter Area
$(".filter__item").wrapAll('<section class="filter"><ul class="filter__list"></ul></section>');
$(".filter").prepend('<h4 class="secHead">Filter</h4>');

// 全選択ボタン(現時点のFilter判定に合わないため、一旦外す)
$(".filter__list").prepend('<li id="check_all" class="filter__item filter-checked">全てを選択する</li>');

// h1をHeader内に入れる。
$("h1").wrap('<header class="header"></header>');

// HeaderとFilter AreaとContents AreaをWrapしてgridでコントロールできるようにする。
$("header, .filter, .contents").wrapAll('<div class="grid"></div>');

// 上で作ったSort用のパーツへのアクションから、各セクションに対してClassの付与を行う
$(".filter__item").not("#check-all").on("click", function(){
  // ボタンをチェックボックス的に動かす為に、クリックごとにClassの付け外しをする。
  if($(this).hasClass("filter-checked")){
    $(this).removeClass("filter-checked");
  } else {
    $(this).addClass("filter-checked");
  }

  var filter_itemNum = $(".filter__item").not("#check_all").length;
  var filtered_num = $(".filter-checked").not("#check_all").length;
  // console.log(filter_itemNum);
  // console.log(filtered_num);

  if(filter_itemNum == filtered_num){
    if(!$("#check_all").hasClass("filter-checked")){
      $("#check_all").addClass("filter-checked");
    }
  } else if (filter_itemNum > filtered_num){
    $("#check_all").removeClass("filter-checked");
  }

  var click_num = $(".filter__item").index(this); // クリックしたボタンがFilter用のボタンの何番目にあるかを取得する。
  var click_num = click_num - 1; // 全選択のボタンが入っている分、一つマイナスを入れる。ただし、全選択のボタンを現在検討中のため、一旦外す
  var $filtered_h2 = $('h2:eq(' + click_num + ')'); // Filter用のボタンの順番と同じ順番のh2を指定する。h2を配列に入れているので、ここの順番は常に一致するはず。
  var $filtered_section = $filtered_h2.parent(".chapter__wrapper"); // 上記で指定したh2の親要素を取りに行く

  // 以下で条件分岐。クリック時にfilter対象のセクションに特定のクラスが存在しているかを確認する。これによって、必要な要素を出し分ける。
  if($filtered_section.hasClass("filtered") && !$filtered_section.hasClass("displayed")){
    $filtered_section.removeClass("filtered");
    $filtered_section.addClass("displayed");
    $filtered_section.fadeIn(); 
  } else if (!$filtered_section.hasClass("filtered") && $filtered_section.hasClass("displayed")){
    $filtered_section.addClass("filtered");
    $filtered_section.removeClass("displayed");
    $filtered_section.fadeOut();
  };
});

$("#check_all").on("click", function(){
  var filter_itemNum = $(".filter__item").not("#check_all").length;
  var filtered_num = $(".filter-checked").not("#check_all").length;
  if(filter_itemNum == filtered_num){
    $(".filter__item").removeClass("filter-checked");
    $(".chapter__wrapper").removeClass("displayed").addClass("filtered");
    $(".chapter__wrapper").fadeOut();
  } else {
    $(".filter__item").addClass("filter-checked");
    $(".chapter__wrapper").removeClass("filtered").addClass("displayed");
    $(".chapter__wrapper").fadeIn();
  }
})

// コピーボタンの実装
// コピーについてはテキストをクリックしたらコピーできるようにする。
// CSSで該当のliのhoverやcursolやTransitionを入れて、それっぽく見せる。
// クリップボードへのコピーはtextareaかinput を利用する必要があるので、今回はtextareaを使用。
$(".article__wrapper ul ul ul > li").on("click", function(){
  var copyText = $(this).text(); // クリックされた部分のテキストを取得
  var $textarea = $('<textarea style="opacity: 0; height: 0; margin: 0; padding: 0;"></textarea>'); // textareaの定義。念の為、removeがうまく動作しない等あってもtextareaは見えないようにstyle設定。
  $textarea.text(copyText); // textareaにcopyしたいテキストを挿入
  $(this).append($textarea); // textareaを一時的にコピーしたいテキストの後に挿入。
  $textarea.select(); // コピーのためにテキストを選択させる
  document.execCommand("copy"); // jQuery側でクリップボードにコピーさせる。
  $textarea.remove(); // コピーのためのtextareaをremoveする
  // コピーしたことを知らせるメッセージは別途設定。
});

// nextUntilを使ってWrapしているせいで、scriptタグまでsection内に入ってしまうので外だし。
$("#jquery").appendTo("body").removeAttr("id");
$("#script").appendTo("body").removeAttr("id");