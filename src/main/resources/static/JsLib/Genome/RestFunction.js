/**
 * Created by amois on 1/6/2017.
 */
function getData(value) {
    var jsonDataR;
    value = value.split('.').join("_");
    $.ajax({
        dataType: 'json',
        async: false,
        url: '/getGenome/'+value,
        success: function(jsondata){
            console.log("Data was received");
            console.log(Object.keys(jsondata));
            jsonDataR = jsondata;
        }
    });
    return jsonDataR;
}

function getRequest(url) {
    var jsonDataR = [];
    $.ajax({
        dataType: 'json',
        async: false,
        url: url,
        success: function(jsondata){
            jsonDataR = jsondata;
        }
    });
    return jsonDataR;
}

function uploadNewGenome(formData) {
    $.ajax({
        url: "/upload",
        type: 'POST',
        data: formData,
        async: true,
        success: function () {
            console.log("File loaded");
        },
        error: function (e1, e2, e3) {
            console.log("Error upload file: " + e1 + e2 + e3);
        },
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
}

function sendPost(json, url, action) {
    console.log(json);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url': url,
        'data': JSON.stringify(json),
        'dataType': 'json',
        success: function (msg) {
            if(action!=null){
                action(msg);
            }
        },
        async: true,
    });
}


function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}