/**
 * Created by user on 10.01.2017.
 */

var gui;
var previousPartofGene = [];
// var filesName = [];
var effectController = {
    showDots: true,
    showLines: true,
    maxOpacity: 1,
    minDistance: 150,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500,
    fileNameList: [],
    template: [],
    message: [],
    fileName : "Name",
    loadFile:function(){
        var inputFile = document.getElementById('InputFile');
        var submit = document.getElementById('submit');
        var data = $("form#data");
        data.submit(function () {
            var formData = new FormData($(this)[0]);
            uploadNewGenome(formData);
            return false;
        });
        inputFile.addEventListener('change', function() {
            var file = inputFile.files[0];
            effectController['fileName'] = file.name;
            // update all controllers
            for (var i in gui.__controllers) {
                gui.__controllers[i].updateDisplay();
            }
            effectController.fileNameList.push(file.name);
            // effectController.fileNameList = filesName;
            gui.__controllers[2].remove();
            // gui.__controllers[4].remove();
            gui.add( effectController, 'fileNameList', effectController.fileNameList).name("Loaded file").onChange(onChangeFileName);
            // gui.add( effectController, 'template', effectController.template).name("Part name").onChange(onChangeList); // controller 1
            submit.click();
        });
        inputFile.click();
    },
    popup : function () {
        //Функция отображения PopUp
        $("#popup1").show();
    },
    saveState : function () {
        saveState(effectController.fileName, camera);
    }
};

function initGUI() {

    gui = new dat.GUI();
    gui.add( effectController, 'popup').name("Select parts");
    gui.add(effectController, 'saveState').name('Save current state');
    gui.add( effectController, 'loadFile').name('Load CSV file');
    // gui.add( effectController, "showDots" ).name("Show Dots").onChange( function( value ) {
    //     for (var key in mapMesh) {
    //         // if(previousValue==key)
    //         //     continue;
    //         var meshArray = mapMesh[key];
    //         meshArray[0].visible = value;
    //     }
    // } );
    // gui.add( effectController, "showLines" ).name("Show Lines").onChange( function( value ) {
    //     for (var key in mapMesh) {
    //         // if(previousValue==key)
    //         //     continue;
    //         var meshArray = mapMesh[key];
    //         meshArray[1].visible = value;
    //         meshArray[2].visible = value;
    //     }
    // } );

    // gui.add( effectController, "maxOpacity", 0, effectController.maxOpacity, 0.05 ).name('Opacity').onChange( function( value ) {
    //     var opacityColor = parseFloat( value );
    //     for (var key in mapMesh) {
    //         var meshArray = mapMesh[key];
    //         updateAlpha(meshArray, opacityColor);
    //     }
    // });

    gui.add( effectController, 'fileNameList', effectController.fileNameList).name("Selected file").onChange(onChangeFileName);
    // gui.add( effectController, 'template', effectController.template).name("Part name").onChange(onChangeList); // controller 1
    updatePartsGenome(effectController.template, "parts");
    $(document).ready(function(){
        //Скрыть PopUp при загрузке страницы
        PopUpHide();
    });


    $('#closeButton').on('click', function(e) {
        if (e.target !== this)
            return;
        PopUpHide();
    });

}

function UpdatePartGenome(selectElement) {
    var selectedValue = selectElement.value;
    if(selectElement.id === "parts2"){
        $('#parts2 :selected').remove();
        $("#parts").append($('<option>', {
            value: selectedValue,
            text: selectedValue
        }));
    }
    else if(selectElement.id === "parts"){
        $('#parts :selected').remove();
        $("#parts2").append($('<option>', {
            value: selectedValue,
            text: selectedValue
        }));
    }

    $("#parts2").html($("#parts2 option").sort(function (a, b) {
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
    }));

    $("#parts").html($("#parts option").sort(function (a, b) {
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
    }));
}

function updatePartsGenome(parts, idSelector) {
    document.getElementById(idSelector).options.length = 0;
    $.each(parts, function (i, part) {
        $('#'+idSelector).append($('<option>', {
            value: part,
            text : part
        }));
    });
}

//Функция скрытия PopUp
function PopUpHide(){
    $("#popup1").hide();
    var newOptions = $('#parts option').map(function () {
        return $( this ).val();
    }).toArray();
    var deletedOptions = [];
    if(previousPartofGene.length > 0){
        $.each(previousPartofGene, function (index, value) {
            if(newOptions.indexOf(value)===-1){
                deletedOptions.push(value);
            }
        })
    }
    $.each(deletedOptions, function (index, element) {
        // updateAlpha(mapMesh[element], 0);
        // updateAlphaMesh(meshSpheres, element, 0);
        updateAlphaBead(mapBeads[element], 0);
    });
    previousPartofGene = newOptions;
    $.each(previousPartofGene, function(index, element){
        //updateAlpha(mapMesh[element], 1);
        // updateAlphaMesh(meshSpheres, element, 1);
        updateAlphaBead(mapBeads[element], 1);
    });
}

var onChangeFileName = function (value, state) {
    document.getElementById("parts").options.length = 0;
    document.getElementById("parts2").options.length = 0;
    mapMesh = {};
    effectController['fileName'] = value;
    var data = getData(value);
    initAll(data);
    animate();


    var keys = Object.keys(data);
    effectController['template'] = keys;
    if(state!=null && state.selected!=null){
        effectController['template'] = state.selected;
    }
    var invisibleObjKeys = keys.diff(effectController['template']);
    updatePartsGenome(effectController['template'], "parts");
    updatePartsGenome(invisibleObjKeys, "parts2");
    $.each(effectController['template'], function (index, element) {
        updateAlphaBead(mapBeads[element], 1);
    });
    $.each(invisibleObjKeys, function (index, element) {
        updateAlphaBead(mapBeads[element], 0);
    });
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


function searchKeyUp() {
    var input = document.getElementById("searcher");
    var filterText = input.value.toUpperCase();
    var selectedOption = $('#parts option');
    var unSelectedOption = $('#parts2 option');
    for(var i = 0; i < selectedOption.length; i++) {
        if(selectedOption[i].value.toUpperCase().indexOf(filterText) > -1) {
            selectedOption[i].style.display = "";
        }
        else{
            selectedOption[i].style.display = "none";
        }
    }

    for(var i = 0; i < unSelectedOption.length; i++) {
        if(unSelectedOption[i].value.toUpperCase().indexOf(filterText) > -1) {
            unSelectedOption[i].style.display = "";
        }
        else{
            unSelectedOption[i].style.display = "none";
        }
    }
}

function MoveOptionTo(idFrom, idTo) {
    var fromOption = document.getElementById(idFrom).options;

    $.each(fromOption, function (i, part) {
        $('#'+idTo).append($('<option>', {
            value: part.value,
            text : part.text
        }));
    });
    document.getElementById(idFrom).options.length = 0;
}

function redirectToBead(id) {
    var url = 'https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position='+id;
    console.log(url);
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Please allow popups for this website');
    }
}

function createPopup(id, position) {
    var newLabel = $('<div class="LabelBead" id='+ id +'>'+ id +'</div>');
    newLabel.click(function() {redirectToBead(id);});
    $('body').append(newLabel);
    newLabel.offset({top:position.clientY,left:position.clientX});
    newLabel.show();
}

function showShortLink(link, position) {
    var currentUrl = window.location;
    var newLabel = $('<div class="ShortLink" id="'+link+'"><a href="/point?state='+link +'">'+currentUrl.protocol + "//" + currentUrl.host +'/point?state='+link+'</a>'+
                '</div>');
    var closeButton = $('<div class="btn btn col-sm-2 col-md-offset-5 text-center">Close</div>');
    closeButton.click(function () {
        newLabel.remove();
    });
    newLabel.append(closeButton);
    $('body').append(newLabel);
    if(position!=null)
        newLabel.offset({top:position.Y, left:position.X});
    else
        newLabel.offset({top:30, left:30});
    newLabel.show();
}

function createCssObject(pointInfo, cameraPosition) {

    var element = document.createElement( 'div' );
    element.className = "element";
    // element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
    var html = [
        // '<div style="width:' + 1 + 'px; height:' + 1 + 'px;">',
        // id,
        '<div id='+ pointInfo.beadName +'>',
        pointInfo.beadName,

        '</div>',
        ''
    ].join('\n');
    var newDiv = $(html);
    $.each(pointInfo.geneInfos, function(i)
    {
        $('<p/>')
        // .addClass('LabelBead')
            .text(pointInfo.geneInfos[i].genomeName)
            .appendTo(newDiv[0])
            .click(function() {redirectToBead(pointInfo.beadName.split('_')[0]+':'+pointInfo.geneInfos[i].startGene+'-'+pointInfo.geneInfos[i].endGene)});
    });
    newDiv[0].className = 'LabelBead';
    element.append(newDiv[0]);
    $('#container').append(element);
    var cssObject = new THREE.CSS3DObject(element);
    cssObject.scale.set(0.003,0.003,0.003);
    cssObject.position.x = pointInfo.x;
    cssObject.position.y = pointInfo.y;
    cssObject.position.z = pointInfo.z;
    cssObject.lookAt(cameraPosition);
    return cssObject;
}

function saveState(filename, camera) {
    // scene.name = "test";
    var options = document.getElementById("parts").options;
    var selectedOptions = [];
    for(var i = 0; i< options.length; i++){
        selectedOptions.push(options[i].value);
    }

    sendPost({filename: filename, selected: selectedOptions, pointInfo: currentPointInfo, camera: camera.toJSON()}, '/saveState', showShortLink);
}
