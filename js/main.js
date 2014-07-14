(function (window, $) {
  var PrandyApp = window.PrandyApp = {};

  PrandyApp.init = function () {
    this.Util.init();
    this.event();

    // 최초 로드시 홈의 인덱스를 로드.
    $_('views/home/index').update('#body-content');
  };

  PrandyApp.event = function () {
    // 'js-link-' 로 시작하는 클래스들은 클래스 명의 뒷부분의 문자열을 잘라 이동할 곳을 결정한다. 대상의 확장자는 항상 .html이라 가정한다.
    $('#wrap').find('a[ class*="js-link-" ]').click(function (e) {
      e.preventDefault();
      var className = $(this).attr('class');
      var target = className.substring(className.lastIndexOf('-') + 1);
      $_('views/' + target).update('#body-content');
    });

    $(document).on('click', 'a.js-news', function (e) {
      e.preventDefault();
      $_('views/weareprandy/news').update('#body-content');
    });

    $('a.page_top').click(function (e) {
      e.preventDefault();
      $("html, body").animate({scrollTop: 0}, 400);
    });

    $('.menu_body > a').on('click', function() {
      var self = this;
      $(this).css({color:"#fff"});
      $('.menu_body > a').each(function() {
        if(self !== this) {
         $(this).removeAttr('style');
        }
      });
    });
  };

  PrandyApp.Util = {
    init: function () {
      // Date 객체에 format 기능을 확장
      Date.prototype.format = function (f) {
        if (!this.valueOf()) return " ";
        var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        var d = this;

        return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
          switch ($1) {
            case "yyyy":
              return d.getFullYear();
            case "yy":
              return (d.getFullYear() % 1000).zf(2);
            case "MM":
              return (d.getMonth() + 1).zf(2);
            case "dd":
              return d.getDate().zf(2);
            case "E":
              return weekName[d.getDay()];
            case "HH":
              return d.getHours().zf(2);
            case "hh":
              return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm":
              return d.getMinutes().zf(2);
            case "ss":
              return d.getSeconds().zf(2);
            case "a/p":
              return d.getHours() < 12 ? "오전" : "오후";
            default:
              return $1;
          }
        });
      };
      String.prototype.string = function (len) {
        var s = '', i = 0;
        while (i++ < len) {
          s += this;
        }
        return s;
      };
      String.prototype.zf = function (len) {
        return "0".string(len - this.length) + this;
      };
      Number.prototype.zf = function (len) {
        return this.toString().zf(len);
      };
    },
    // IE 11의 경우 navigator.userAgent에 MSIE라는 문자가 없어 아래 함수로 식별
    isIE: function () {
      return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
    }
  };

  PrandyApp.mainNewsList = function (data) {
    $('.main_news .list').html('');
    for (i = 0; i < 3 && data[i] !== undefined; i++) {
      var html = '<a class="js-news"><img src="' + data[ i ].user.profile_image_url + '"> &nbsp;&nbsp; ' + data[ i ].text + '</a>';
      $('.main_news .list').append(html);
    }
  };

  PrandyApp.pageNewsList = function (data) {
    $('.news-wrap').html('');
    for (i = 0; i < 29 && data[i] !== undefined; i++) {
      var createAt = data[ i ].created_at;
      if (PrandyApp.Util.isIE) {
        createAt = createAt.replace(/(\+)/, 'GMT$1');
      }
      var html = '<p><i>' + (new Date(Date.parse(createAt)).format('yyyy-MM-dd hh:mm:dd')) + '</i><span class="content">' + data[ i ].text + '</span></p>';
      $('.news-wrap').append(html);
    }
  };

  PrandyApp.twitterTimeline = function (options) {

    var param = {
      api: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
      count: options.count,
      callback: options.mainYn ? "PrandyApp.mainNewsList" : "PrandyApp.pageNewsList",
      consumerKey: "3er3meAFHGZSN0zyZHaerhqA2",
      consumerSecret: "uABl9uZVJpWHr03Tev7CeQ4AHYTkLOK6BzCqRJNjZ49ZUaBA7d",
      accessToken: "2492620278-9TxIcACGK0LwEi3z0mbbhLjuRFv1ETvm1IsJkNk",
      tokenSecret: "cKq7b22nkWavHbFV0w2YU0BcVpha6r4iqkELCvwZOtxIG",
      user_id: "468251827507458050"
    };

    var oauthMessage = {
      method: "GET",
      action: param.api,
      parameters: {
        count: param.count,
        callback: param.callback,
        oauth_version: "1.0",
        oauth_signature_method: "HMAC-SHA1",
        oauth_consumer_key: param.consumerKey,
        oauth_token: param.accessToken
      }
    };
    //Outh인증관련
    OAuth.setTimestampAndNonce(oauthMessage);
    OAuth.SignatureMethod.sign(oauthMessage, {
      consumerSecret: param.consumerSecret,
      tokenSecret: param.tokenSecret
    });
    //Outh인증끝
    //Outh인증하여 URL리턴(jsonType)
    var jsonPath = OAuth.addToURL(oauthMessage.action, oauthMessage.parameters);
    $.ajax({
      type: oauthMessage.method,
      url: jsonPath,
      dataType: "jsonp",
      jsonp: false,
      cache: true
    });
  }

  $(document).ready(function () {
    PrandyApp.init();
  });

})(window, jQuery);