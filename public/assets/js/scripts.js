var intervalGeneral = null;
var intervalGlobal = null;
var autoRefresh = false;
var topics = [];
var apiurl = "https://api.social-hound.com";
var maintopic = window.topic;
var intervalobj = {};
var emoji = new EmojiConvertor();
emoji.path = 'https://unicodey.com/js-emoji/build/emoji-data/img-emojione-64/';
emoji.sheet = 'https://unicodey.com/js-emoji/build/emoji-data/sheet_emojione_64.png';
emoji.use_sheet = true;
emoji.replace_mode = 'unified';
emoji.init_env();

$(function() {
    $("#loader").show();
    moment.locale('es');
    init(true);

    window.odometerOptions = {
      format: '(,ddd).dd'
    };
});

function init(interval) 
{
    //Init count
    getCount(function(data) {
        $("#loader").fadeOut(500);
        //Get gender and emotions
        getAnalysis(data);

        //Get TagCloud
        getTagCloud(data);

        //Get Count by platform
        getCountByPlatform(data);

        if(interval) startInterval("count",getCount,5000);
    });

    //Get emojis
    getEmojis(12);

    startEvents();
}

function startEvents() {
    $(".toggle-extra-data").unbind("click");
    $(".toggle-extra-data").click(function() {
        $(this).parents(".sprofile").find(".extra-data").slideToggle(250);
    });

    $("#refresh").unbind("click");
    $("#refresh").click(function() {
        init(false);
    });

    $(".nav-sidebar li").unbind("click");
    $(".nav-sidebar li").click(function() {
        $(".nav-sidebar li").removeClass("active");
        $(this).addClass("active");
        var section = $(this).attr("data-section");
        if(section=='all') {
            $(".graph").parents(".box-col").fadeIn(250);
        } else {
            $(".graph").parents(".box-col").fadeOut(250);
            $(".graph."+section).parents(".box-col").fadeIn(250);
        }
    });

    $("#toggle").unbind("change");
    $("#toggle").change(function() {
        autoRefresh = $("#toggle").prop('checked');
        startIntervals();
    });

    $(".pagination li").eq(0).find("a").unbind("click");
    $(".pagination li").eq(0).find("a").click(function() {
        pageDown();
    });

    $(".pagination li").eq(2).find("a").unbind("click");
    $(".pagination li").eq(2).find("a").click(function() {
        pageUp();
    });

    $(".paging").find("h3").each(function(index,elm) {
        $h3 = $(elm);
        if(!$h3.find("a.page-control").length) {
            $h3.append('<a class="page-control page-left"><i class="fa fa-arrow-left"></i></a>');
            $h3.append('<a class="page-control page-right"><i class="fa fa-arrow-right"></i></a>');

            $(".page-left").unbind("click");
            $(".page-left").bind("click",function() {
                let index = $(this).closest(".paging").find(".page.active").index();
                let total = $(this).closest(".paging").find(".page").length;

                index = index-1>=0?index-1:total-1;

                $(this).closest(".paging").find(".page.active").removeClass("active");
                $(this).closest(".paging").find(".page").eq(index).addClass("active");
            });

            $(".page-right").unbind("click");
            $(".page-right").bind("click",function() {
                let index = $(this).closest(".paging").find(".page.active").index();
                let total = $(this).closest(".paging").find(".page").length;

                index = index+1<total?index+1:0;

                $(this).closest(".paging").find(".page.active").removeClass("active");
                $(this).closest(".paging").find(".page").eq(index).addClass("active");
            });
        }
    })
}

function startInterval(interval,intervalfunc,time) {
    if(intervalobj[interval] == undefined) intervalobj[interval] = null;
    clearInterval(intervalobj[interval]);
    intervalobj[interval] = setInterval(intervalfunc,time);
}

function getCount(callback = null) {
    $.get(apiurl+"/count/"+maintopic,function(data) {
        console.log(data);
        data = data.data[0];
        let titledash = maintopic
        if(maintopic=="copihue2018") titledash = "CopihueDeOro2018";
        $("div.topic text").text("#"+titledash);
        $("div.topic .odometer").text(data.total);
        if(callback) callback(data);
    })
}

function getAnalysis(count,callback = null) {
    $.get(apiurl+"/"+maintopic+"/analysis",function(data) {
        console.log(data);
        //GENDER
        let totalgender = parseInt(data.genders.male)+parseInt(data.genders.female)+parseInt(data.genders.unisex);
        let malepercent = Math.round(parseInt(data.genders.male)/totalgender*100,2);
        let femalepercent = Math.round(parseInt(data.genders.female)/totalgender*100,2);
        let unisexpercent = 100-(malepercent+femalepercent);
        var generalGeneros = [femalepercent,unisexpercent,malepercent];

        if(window.myPieGeneros==null) {
            var configgeneros = {
                type: 'pie',
                data: {
                    datasets: [{
                        data: generalGeneros,
                        borderColor: '#434857',
                        backgroundColor: [
                            '#eab76f',
                            '#f1ebc4',
                            '#df6965'
                        ],
                        label: 'Generos general %'
                    }],
                    labels: ["Mujeres","unisex","Hombres"]
                },
                options: {
                    legend: {
                        reverse: true
                    },
                    responsive: true,
                    title: {
                        display: true,
                        text: ''
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true
                    }
                }
            };

            var ctxgeneralgeneros = document.getElementById("general-generos").getContext("2d");
            window.myPieGeneros = new Chart(ctxgeneralgeneros, configgeneros);
        } else {
            //update chart
            for(var i=0;i<generalGeneros.length;i++) {
                window.myPieGeneros.data.datasets[0].data[i] = generalGeneros[i];
            }
            window.myPieGeneros.update();
        }

        //EMOTION
        let totalemotion = parseInt(data.emotions.positive)+parseInt(data.emotions.negative)+parseInt(data.emotions.neutral);
        let positivepercent = Math.round(parseInt(data.emotions.positive)/totalemotion*100,2);
        let negativepercent = Math.round(parseInt(data.emotions.negative)/totalemotion*100,2);
        let neutralpercent = 100-(positivepercent+negativepercent);
        var generalEmotion = [positivepercent,neutralpercent,negativepercent];

        if(window.myPieSentimiento==null) {
            var configemotion = {
                type: 'pie',
                data: {
                    datasets: [{
                        data: generalEmotion,
                        borderColor: '#434857',
                        backgroundColor: [
                            '#eab76f',
                            '#f1ebc4',
                            '#df6965'
                        ],
                        label: 'Sentimiento general %'
                    }],
                    labels: ["Positivo","Neutral","Negativo"]
                },
                options: {
                    legend: {
                        reverse: true
                    },
                    responsive: true,
                    title: {
                        display: true,
                        text: ''
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true
                    }
                }
            };

            var ctxgeneralemotion = document.getElementById("general-sentimientos").getContext("2d");
            window.myPieSentimiento = new Chart(ctxgeneralemotion, configemotion);
        } else {
            //update chart
            for(var i=0;i<generalEmotion.length;i++) {
                window.myPieSentimiento.data.datasets[0].data[i] = generalEmotion[i];
            }
            window.myPieSentimiento.update();
        }
    });

    var dfd = $.Deferred().resolve();
    for(key in count.detail) {
        let platform = key;
        dfd = dfd.then(function(){
            return $.get(apiurl+"/"+maintopic+"/analysis/"+platform,function(data) {
                $holder = $(`
                    <div class="dentro_box page">
                        <h3>% Menciones `+platform+` por género</h3>
                        <div class="graph general">
                            <canvas id="`+platform+`-generos"></canvas>
                        </div>
                    </div>
                    `);
                if(!$(".generos-holder").find("#"+platform+"-generos").length) $(".generos-holder").append($holder);

                console.log(data);
                //GENDER
                let totalgender = parseInt(data.genders.male)+parseInt(data.genders.female)+parseInt(data.genders.unisex);
                let malepercent = Math.round(parseInt(data.genders.male)/totalgender*100,2);
                let femalepercent = Math.round(parseInt(data.genders.female)/totalgender*100,2);
                let unisexpercent = 100-(malepercent+femalepercent);
                var generalGeneros = [femalepercent,unisexpercent,malepercent];

                if(window["myPieGeneros"+platform]==null) {
                    var configgeneros = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: generalGeneros,
                                borderColor: '#434857',
                                backgroundColor: [
                                    '#eab76f',
                                    '#f1ebc4',
                                    '#df6965'
                                ],
                                label: 'Generos general %'
                            }],
                            labels: ["Mujeres","unisex","Hombres"]
                        },
                        options: {
                            legend: {
                                reverse: true
                            },
                            responsive: true,
                            title: {
                                display: true,
                                text: ''
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: true
                            }
                        }
                    };

                    var ctxgeneralgeneros = document.getElementById(platform+"-generos").getContext("2d");
                    window["myPieGeneros"+platform] = new Chart(ctxgeneralgeneros, configgeneros);
                } else {
                    //update chart
                    for(var i=0;i<generalGeneros.length;i++) {
                        window["myPieGeneros"+platform].data.datasets[0].data[i] = generalGeneros[i];
                    }
                    window["myPieGeneros"+platform].update();
                }

                //EMOTION
                $holder = $(`
                    <div class="dentro_box page">
                        <h3>% Menciones `+platform+` por sentimiento</h3>
                        <div class="graph general">
                            <canvas id="`+platform+`-sentimientos"></canvas>
                        </div>
                    </div>
                    `);
                if(!$(".sentimientos-holder").find("#"+platform+"-sentimientos").length) $(".sentimientos-holder").append($holder);

                let totalemotion = parseInt(data.emotions.positive)+parseInt(data.emotions.negative)+parseInt(data.emotions.neutral);
                let positivepercent = Math.round(parseInt(data.emotions.positive)/totalemotion*100,2);
                let negativepercent = Math.round(parseInt(data.emotions.negative)/totalemotion*100,2);
                let neutralpercent = 100-(positivepercent+negativepercent);
                var generalEmotion = [positivepercent,neutralpercent,negativepercent];

                if(window["myPieSentimiento"+platform]==null) {
                    var configemotion = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: generalEmotion,
                                borderColor: '#434857',
                                backgroundColor: [
                                    '#eab76f',
                                    '#f1ebc4',
                                    '#df6965'
                                ],
                                label: 'Sentimiento general %'
                            }],
                            labels: ["Positivo","Neutral","Negativo"]
                        },
                        options: {
                            legend: {
                                reverse: true
                            },
                            responsive: true,
                            title: {
                                display: true,
                                text: ''
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: true
                            }
                        }
                    };

                    var ctxgeneralemotion = document.getElementById(platform+"-sentimientos").getContext("2d");
                    window["myPieSentimiento"+platform] = new Chart(ctxgeneralemotion, configemotion);
                } else {
                    //update chart
                    for(var i=0;i<generalEmotion.length;i++) {
                        window["myPieSentimiento"+platform].data.datasets[0].data[i] = generalEmotion[i];
                    }
                    window["myPieSentimiento"+platform].update();
                }
                startEvents();
            })
        });
        if(callback) callback(data);
    }
}

function getEmojis(size,callback = null) {
    $.get(apiurl+"/"+maintopic+"/emojis",function(data) {
        let minsize = null;
        let maxsize = null;
        let realmaxsize = 80;
        let realminsize = 30;
        let emojisArr = [];
        for(key in data[0].emojis) {
            let emojiObject = { "emoji": key, "size": data[0].emojis[key]};
            emojisArr.push(emojiObject);
        }
        emojisArr.reverse();
        let maxemoji = size<emojisArr.length?size:emojisArr.length;
        $("#emojiscloud").empty();
        for(let i=0;i<maxemoji;i++) {
            if(minsize==null||minsize>emojisArr[i].size) minsize = emojisArr[i].size;
            if(maxsize==null||maxsize<emojisArr[i].size) maxsize = emojisArr[i].size;
            $("#emojiscloud").append("<text data-size='"+emojisArr[i].size+"'>"+emoji.replace_unified(emojisArr[i].emoji)+"</text>");
        }
        $("#emojiscloud").find("text").each(function(index,icon) {
            $emoji = $(icon);
            let size = $emoji.attr("data-size");
            $emoji.css("font-size",calculateSize(size,realminsize,realmaxsize,minsize,maxsize)+"pt");
        })
        if(callback) callback(data);
    })
}

function getTagCloud(count,callback = null) {
        var dfd = $.Deferred().resolve();
        var response = [];
        for(key in count.detail) {
            let platform = key;
            dfd = dfd.then(function(){
                return $.get(apiurl+"/"+maintopic+"/tagcloud/"+platform,function(data) {
                    data.platform = platform
                    response.push(data);
                });
            });
        }
        dfd.then(function() {
            response.forEach(function(tagcloud) {
                console.log(tagcloud);
                if(!$(".tagcloud-holder").find("#tagcloud-"+tagcloud.platform).length) {
                    $tagcloud = $(`
                        <div class="dentro_box">
                            <h3>Nube de palabras para `+tagcloud.platform+`</h3>
                            <div class="graph invitados">
                                <div class="cloud" id="tagcloud-`+tagcloud.platform+`"></div>
                            </div>
                        </div>
                        `);
                    let tags = tagcloud.tagcloud.split(" | ");
                    tags.forEach(function(tag) {
                        $tagcloud.find("#tagcloud-"+tagcloud.platform).append("<text class='tag'>"+tag+"</text>");
                    });
                    $(".tagcloud-holder").append($tagcloud);
                } else {
                    $("#tagcloud-"+tagcloud.platform).empty();
                    let tags = tagcloud.tagcloud.split(" | ");
                    tags.forEach(function(tag) {
                        $("#tagcloud-"+tagcloud.platform).append("<text class='tag'>"+tag+"</text>");
                    });
                }
            })
            if(callback) callback(data);
        });
}

function getCountByPlatform(count,callback = null) {
    let labels = [];
    let platformData = [];
    for(key in count.detail) {
        let platform = key;
        labels.push(platform);
        platformData.push(count.detail[platform]);
    }
    console.log(labels);
    console.log(platformData);

    if(window.plataformasMenciones==null) {
        var plataformasMencionesData = {
            labels: labels,
            datasets: [{
                type: 'bar',
                label: 'Menciones',
                    backgroundColor: [
                        '#eab76f',
                        '#f1ebc4',
                        '#df6965',
                        '#96bdb2',
                        '#594b51',
                        '#ecf0f1'
                    ],
                data: platformData,
                
                borderWidth: 2
            }]

        };
        
        var ctxplataformasmenciones = document.getElementById("plataformas-menciones").getContext("2d");
        window.plataformasMenciones = new Chart(ctxplataformasmenciones, {
            type: 'bar',
            data: plataformasMencionesData,
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: ''
                },
                tooltips: {
                    mode: 'index',
                    intersect: true
                }
            }
        });
    } else {
        //update chart
        for(var i=0;i<platformData.length;i++) {
            window[plataformasMenciones].data.datasets[0].data[i] = platformData[i];
        }
        window[plataformasMenciones].update();
    }
    startEvents();
}

function calculateSize(size,realminsize,realmaxsize,minsize,maxsize) {
    let pendiente = (realmaxsize-realminsize)/(maxsize-minsize);
    let newsize = Math.abs(Math.ceil(pendiente*(maxsize-size)-realmaxsize));
    console.log(newsize);
    return newsize;
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

var formatNumber = {
     separador: ".", // separador para los miles
     sepDecimal: ',', // separador para los decimales
     formatear:function (num){
         num += '';
         var splitStr = num.split('.');
         var splitLeft = splitStr[0];
         var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
         var regx = /(\d+)(\d{3})/;
         while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
         }
         return this.simbol + splitLeft + splitRight;
     },
     new:function(num, simbol){
         this.simbol = simbol ||'';
         return this.formatear(num);
     }
}