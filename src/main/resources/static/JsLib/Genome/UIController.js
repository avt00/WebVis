/**
 * Created by user on 10.01.2017.
 */

var gui;
var previousPartofGene = [];

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
            filesName.push(file.name);
            effectController.fileNameList = filesName;
            gui.__controllers[4].remove();
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
    updatePartsGenome(effectController.template);
    $(document).ready(function(){
        //Скрыть PopUp при загрузке страницы
        PopUpHide();
    });
}

function UpdatePartGenome(selectElement) {
    var selectedValue = selectElement.value;
    if(selectElement.id === "parts"){
        $('#parts :selected').remove();
        $("#parts2").append($('<option>', {
            value: selectedValue,
            text: selectedValue
        }));
    }
    else if(selectElement.id === "parts2"){
        $('#parts2 :selected').remove();
        $("#parts").append($('<option>', {
            value: selectedValue,
            text: selectedValue
        }));
    }

    $("#parts").html($("#parts option").sort(function (a, b) {
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
    }));

    $("#parts2").html($("#parts2 option").sort(function (a, b) {
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
    }));
}

function updatePartsGenome(parts) {
    document.getElementById("parts").options.length = 0;
    $.each(parts, function (i, part) {
        $('#parts').append($('<option>', {
            value: part,
            text : part
        }));
    });
}

//Функция скрытия PopUp
function PopUpHide(){
    $("#popup1").hide();
    var newOptions = $('#parts2 option').map(function () {
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
        updateAlpha(mapMesh[element], 0);
    });
    previousPartofGene = newOptions;
    $.each(previousPartofGene, function(index, element){
        updateAlpha(mapMesh[element], 1);
    });
}

var onChangeFileName = function (value) {
    scene.remove(group);
    group = new THREE.Group();
    mapMesh = {};
    var data = getData(value);
    initAll(data);
    animate();
    scene.add( group );

    var keys = Object.keys(data);

    effectController['template'] = keys;
    updatePartsGenome(effectController.template);
};