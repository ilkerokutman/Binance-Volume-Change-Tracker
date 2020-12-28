// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var counter = 0;

var cellBuilder = function (val, apendix) {
    var $td = $("<td>").html(val).addClass('text-right').appendTo(apendix);
};

var alertView = function (r, vc) {
    var $h = $(".result");
    $h.prepend('<p><strong>' + r["symbol"] + '</strong> has changed to: <strong>' + parseFloat(vc).toFixed(8) + '</strong> at ' + (new Date().toTimeString()).replace(' GMT+0300 (GMT+03:00)','') + '</p>');
}

var displayData = function (r) {
    var $tr;
    var symbol = r["symbol"];
    if ($("tr.symbol_"+symbol).length > 0) {
        //update ref
        $tr = $("tr.symbol_" + symbol);
    } else {
        //create row
        $tr = $("<tr>").addClass("symbol_" + symbol).appendTo(".table-binance tbody");
    }
    $tr.html('<td>' + r["symbol"] + '</td>').removeClass("table-success, table-danger");
    
    cellBuilder(r["priceChange"], $tr);
    cellBuilder(r["priceChangePercent"], $tr);
    cellBuilder(r["lastPrice"], $tr);
    cellBuilder(r["highPrice"], $tr);
    cellBuilder(r["lowPrice"], $tr);
    cellBuilder(r["volume"], $tr);
    var previousVolume = $tr.data('previous-volume');
    if (previousVolume === undefined || previousVolume === null) {
        cellBuilder('-', $tr);
    } else {
        var volumeChange = previousVolume / r["volume"];
        var $tdC = $("<td>").html(volumeChange);
        var treshold = parseFloat($("#treshold").val().replace(",","."));
        if (treshold !== undefined && treshold !== null) {
            if (volumeChange >= (1+treshold) || volumeChange <= (1 - treshold)) {
                $tdC.addClass("table-primary");
                
                alertView(r, volumeChange);
            } else {
                $tdC.removeClass("table-primary");
            }
            if (volumeChange > 1) $tr.addClass("table-success");
            if (volumeChange < 1) $tr.addClass("table-danger");
        }

        $tdC.appendTo($tr);
    }
    $tr.data('previous-volume', r["volume"]);


};

var fetchData = function () {
    $.ajax({
        url: "/get-data",
        contentType: "application/json",
        beforeSend: function (xhr) {
            console.log("starting fetch");
            $(".counter").html("Fetching...");
        },
        error: function (err) {
            console.log(JSON.stringify(err));
            $(".counter").html("ERROR");
        },
        success: function (res) {
            if (res.success && res.list !== null && res.list.length > 0) {
                counter++;
                $(".counter").html('State: fetched(' + counter+')');
                var ph = $(".result").html();
                for (var i = 0; i < res.list.length; i++) {
                    displayData(res.list[i]);
                }
                var pa = $(".result").html();
                if (ph !== pa) {
                    var alarm = new Sound();
                    alarm.start();
                }
                var intervalInSecs = $("#fetch-interval").val();
                if (intervalInSecs !== undefined && intervalInSecs !== null && intervalInSecs > 0) {
                    setTimeout(function () {
                        fetchData();
                    }, intervalInSecs * 1000);
                }
            } else {
                $(".counter").html("ERROR");
            }
        },
    });
};

function Sound() {
    this.source = "/sound/half-life-2-episode-2-base-alarm.mp3";
    this.volume = 100;
    this.loop = false;
    var son;
    this.son = son;
    this.finish = false;
    this.stop = function () {
        document.body.removeChild(this.son);
    }
    this.start = function () {
        if (this.finish) return false;
        this.son = document.createElement("embed");
        this.son.setAttribute("src", this.source);
        this.son.setAttribute("hidden", "true");
        this.son.setAttribute("volume", this.volume);
        this.son.setAttribute("autostart", "true");
        this.son.setAttribute("loop", this.loop);
        document.body.appendChild(this.son);
    }
    this.remove = function () {
        document.body.removeChild(this.son);
        this.finish = true;
    }
    this.init = function (volume, loop) {
        this.finish = false;
        this.volume = volume;
        this.loop = loop;
    }
}