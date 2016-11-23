var express = require('express');
var router = express.Router();
var article = require('../model/db.js');
/*日期计算*/
var dayFunc = function(docs) {
    for (a in docs) {
        var d1 = docs[a].updated;
        var d2 = new Date(); // now
        var diff = d2 - d1,
            sign = diff < 0 ? -1 : 1,
            milliseconds, seconds, minutes, hours, days, months, years;
        diff /= sign; // or diff=Math.abs(diff);
        diff = (diff - (milliseconds = diff % 1000)) / 1000;
        diff = (diff - (seconds = diff % 60)) / 60;
        diff = (diff - (minutes = diff % 60)) / 60;
        diff = (diff - (hours = diff % 24)) / 24;
        diff = (diff - (days = diff % 30)) / 30;
        years = (diff - (months = diff % 12)) / 12;
        (years === 0) ? years = "": years = years + "年";
        (days === 0) ? days = "": days = days + "天";
        (months === 0) ? months = "": months = months + "个月";
        (hours === 0) ? hours = "": hours = hours + "小时";
        (minutes === 0) ? minutes = "": minutes = minutes + "分钟";
        if (years != 0) { docs[a].day = years + months; } else if (months != '') { docs[a].day = months; } else if (days != '') { docs[a].day = days; } else {
            years + months + days + hours + minutes == '' ? docs[a].day = 1 + "分钟" : docs[a].day = years + months + days + hours + minutes;
        }
    };
};

// 点赞请求
router.post('/favor', function(req, res, next) {
    var tittle = req.body.tittle;
    var number = parseInt(req.body.number);
    article.findOneAndUpdate({ tittle: tittle }, { favorite: number }, function(err, docs) {
        if (err) return next(err);
        else res.send("success");
    });
});

// 评论提交请求
router.post('/com', function(req, res, next) {
    var tittle = req.body.tittle;
    var comment = { name: req.body.username, comment: req.body.usercomment, date: new Date() };
    article.findOneAndUpdate({ tittle: tittle }, { $push: { comment: comment } }, function(err, docs) {
        if (err) return next(err);
        else {
            res.send("success");
        }
    });
});

/* GET 主页 */
router.get('/', function(req, res, next) {
    article.find(function(err, docs) {
        if (err) return next(err);
        dayFunc(docs);
        res.render('index', {
            articles: docs,
        });
    }).sort({ updated: -1 });
});

/*文章列表页*/
router.get('/list', function(req, res, next) {
    article.find(function(err, docs) {
        if (err) return next(err);
        dayFunc(docs);
        res.render('list', {
            articles: docs,
        });
    }).sort({ updated: -1 });
});
/*文章列表筛选页面*/
router.get('/list/:id', function(req, res, next) {
    var tag = req.params.id;
    if (tag == "全部") {
        article.find(function(err, docs) {
            if (err) return next(err);
            dayFunc(docs);
            res.render('list', {
                articles: docs,
            });
        }).sort({ updated: -1 });
    } else {
        article.find({ tag: tag }, function(err, docs) {
            if (err) return next(err);
            dayFunc(docs);
            res.render('list', {
                articles: docs,
            });
        }).sort({ updated: -1 });
    }
});

// 文章内容页
router.get('/articles/:id', function(req, res, next) {
    var id = req.params.id;
    article.find({ _id: id }, function(err, docs) {
        if (err) return next(err);
        res.render('page', {
            article: docs[0],
        });
    });
});

// 个人简历页面
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'Express' });
});
router.get('/page', function(req, res, next) {
    res.render('page', { title: 'Express' });
});
router.get('/myadminypp', function(req, res, next) {
    article.find(function(err, docs) {
        if (err) return next(err);
        res.render('admin', {
            title: docs.tittle,
            author: docs.author,
            summary: docs.summary,
            articles: docs,
        });
    }).sort({ updated: -1 });
});

router.post('/myadminypp', function(req, res, next) {
    article.create(req.body, function(err) {
        if (err) return next(err);
    });
    res.redirect("myadminypp");
});

router.post('/shanchuarticle', function(req, res, next) {
    article.remove({ tittle: req.body.tittle }, function(err) {
        if (err) return next(err);
        res.send("success");
    });
});

module.exports = router;
