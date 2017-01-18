/**
 * Created by amois on 1/6/2017.
 */
function getData(value) {
    var jsonDataR;
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

function getFilesName() {
    var jsonDataR = [];
    $.ajax({
        dataType: 'json',
        async: false,
        url: '/getFiles',
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