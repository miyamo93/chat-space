$(document).on('turbolinks:load', function(){
  function buildHTML(message){
    var img = message.image ? `<img src= ${ message.image }>` : "";
    var html = `<div class="message" data-message-id="${message.id}"> 
                <div class="message__up-info">
                <p class="message__up-info--taker">
                  ${message.user_name}
                </p>
                <p class="message__up-info--date">
                  ${message.date}
                </p>
                </div>
                <p class="message__text">
                  ${message.content}
                </p>
                  ${img}
                </div>`
    return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var message = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({  
      url: url,
      type: 'POST',
      data: message,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('#new_message')[0].reset();
      scrollBottom();
      function scrollBottom(){
        var target = $('.message').last();
        var position = target.offset().top + $('.messages').scrollTop();
        $('.messages').animate({
          scrollTop: position
        }, 300, 'swing');
      }
    })
    .fail(function(data){
      alert('エラーが発生したためメッセージは送信できませんでした。');
    })
    .always(function(data){
      $('.form__submit').prop('disabled', false);//ここで解除している
    })
  })
  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
     last_message_id = $('.message:last').data("message-id");
    $.ajax({//ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",//ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',//dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      var insertHTML = '';//追加するHTMLの入れ物を作る
      messages.forEach(function (message) {//配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        insertHTML = buildHTML(message); //メッセージが入ったHTMLを取得
        $('.messages').append(insertHTML);//メッセージを追加
      })
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');//最新のメッセージが一番下に表示されようにスクロールする。
    })
    .fail(function() {
      alert('自動更新に失敗しました');//ダメだったらアラートを出す
    });
    }
  };
  setInterval(reloadMessages, 5000);
});