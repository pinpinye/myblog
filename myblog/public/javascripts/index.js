// 根据窗口宽度设置跟元素的字体大小，实现响应式设计
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            var currentSize = 20 * (clientWidth / 960);
            if (currentSize > 20) {
                docEl.style.fontSize = 20 + 'px';
            } else if (currentSize < 16) {
                docEl.style.fontSize = 16 + 'px';
            } else {
                docEl.style.fontSize = currentSize + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


/************************导航栏active状态*************************/
$(function() {
    // 获取路径
    var path = window.location.pathname;
    // 匹配
    $('.navbar-nav li a').filter(function() {
            return $(this).attr('href') == path;
        })
        // 设置字体颜色
        .css("color", "black");

});


/**************************文章详情页******************************/
// 点击点赞事件
var count = 0;
// 点赞数字变换
$(function() {
    $('.fav-icon').on('click', function(event) {
        // event.preventDefault();
        var fNumber = parseInt($('.fav-no').text());
        var tittle = $('.at-tittle').text();
        (count % 2 == 0) ? fNumber++ : fNumber--;
        var posting = $.post('/favor', { tittle: tittle, number: fNumber });
        posting.done(function(data) {
            if (data = "success") {
                $('.fav-no').text(fNumber);
            }
        });
    });
});

// 点赞图标变化
$(function() {
    $('.fav-icon').on('click', function() {
        if (count % 2 == 0) {
            $('.fa-heart-o').css('display', 'none');
            $('.fa-heart').css('display', 'inline');
            count++;
        } else {
            $('.fa-heart').css('display', 'none');
            $('.fa-heart-o').css('display', 'inline');
            count++;
        }
    });
});

//评论功能
//评论模块收起和隐藏
var comCount = 0;
$(function() {
    $('.talk-icon').on('click', function() {
        if (comCount % 2 == 0) {
            $('.submit-wrapper').css('display', 'block');
            comCount++;
        } else {
            $('.submit-wrapper').css('display', 'none');
            comCount++;
            $('.submit-name').val('');
            $('.submit-com').val('');
            $('.warn-name').css('display', 'none');
            $('.warn-com').css('display', 'none');
        }
    });
});

//提交评论
$(function() {
    $('.add-comment').on('click', function(event) {
        var tittle = $('.at-tittle').text();
        var userName = $('.submit-name').val();
        var userComment = $('.submit-com').val();
        // 评论内容和昵称不能为空
        if (userName === '') {
            $('.warn-name').css('display', 'block');
        }
        if (userComment === '') {
            $('.warn-com').css('display', 'block');
        } else {
            //发送POST请求
            var posting = $.post('/com', { tittle: tittle, username: userName, usercomment: userComment });
            posting.done(function(data) {
                var today = new Date();
                var comDay = today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate();
                var talk = parseInt($('.talk-no').text());
                var newTalk = talk + 1;
                var newCom = '<div class="comment-wrapper">' + '<div class="com-user">' + '<div class="user-pic"><img class="user-img" src="/images/com.png" alt=""></div>' + '<div class="user-name">' + userName + '</div>' + '<div class="user-time">' + comDay + '</div>' + '</div>' + '<div class="com-txt">' + userComment + '</div>';
                // 隐藏评论框
                $('.submit-wrapper').css('display', 'none');
                // 插入最新评论
                $('.all-comment').prepend(newCom);
                // 评论数更新
                $('.talk-no').text(newTalk);
                // 评论输入框清空
                $('.submit-name').val('');
                $('.submit-com').val('');
                $('.warn-name').css('display', 'none');
                $('.warn-com').css('display', 'none');
            });
        }
    });
});

$(function() {
    $('.submit-com').on('focus', function(event) {
        $('.warn-com').css('display', 'none');
    });
      $('.submit-name').on('focus', function(event) {
        $('.warn-name').css('display', 'none');
    });

});

// 如无评论时自动显示评论框
$(function() {
    var talk = parseInt($('.talk-no').text());
    if (talk == 0) {
        $('.submit-wrapper').css('display', 'block');
    }
});

/**************************文章列表页******************************/
$(function() {
    $('.filter-container .tag a').on('click', function(event) {
        // url
        var tag = $(this).text();
        var tagAttr = '/list/' + tag;
        $(this).attr("href", tagAttr);
    });

    var postTxt = $('.list-content .post-wrapper').text();
    if (postTxt == '') {
        $('.no-article').css('display', 'block');
    }
});
