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
    }
};

function initGUI() {

    gui = new dat.GUI();
    gui.add( effectController, 'popup').name("Select parts")
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

var onChangeFileName = function (value) {
    document.getElementById("parts").options.length = 0;
    document.getElementById("parts2").options.length = 0;
    mapMesh = {};
    var data = getData(value);
    initAll(data);
    animate();


    var keys = Object.keys(data);

    effectController['template'] = keys;
    updatePartsGenome(effectController.template, "parts");
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

function createCssObject(pointInfo, position, cameraPosition) {

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
    cssObject.position.x = position.x;
    cssObject.position.y = position.y;
    cssObject.position.z = position.z;
    cssObject.lookAt(cameraPosition);
    // cssObject.rotation.x = direction.x;
    // cssObject.rotation.y = direction.y;
    // cssObject.rotation.z = direction.z;


    return cssObject;
}
