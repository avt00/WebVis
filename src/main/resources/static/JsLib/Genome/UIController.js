/**
 * Created by user on 10.01.2017.
 */

var gui;
var previousPartofGene = [];
// var filesName = [];
var effectController = {
    showDots: true,
    showLines: true,
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
            gui.add( effectController, 'fileNameList', effectController.fileNameList).name("Loaded file").onChange(function (value) {
                onChangeFileName(value);
            });
            // gui.add( effectController, 'template', effectController.template).name("Part name").onChange(onChangeList); // controller 1
            submit.click();
        });
        inputFile.click();
    },
    popup : function () {
        //Функция отображения PopUp
        // $("#popup1").show();
        $(".leftPanel").toggleClass('clicked');
    },
    popupSearcher : function () {
        $("#searcherGene").show();
    },
    saveState : function () {
        saveState(effectController.fileName, genome);
    },
    useExpression : function () {
        var keys =Object.keys(genome.beads);
        for(var i =0; i < keys.length; i++){
            genome.beads[keys[i]].material.uniforms.u_UseExpression.value = !genome.beads[keys[i]].material.uniforms.u_UseExpression.value;
            genome.beads[keys[i]].material.needsUpdate = true;
        }
    },
    useExpressionGlobal : function () {
        var keys =Object.keys(genome.beads);
        for(var i =0; i < keys.length; i++){
            genome.beads[keys[i]].material.uniforms.u_UseExpressionGlobal.value = !genome.beads[keys[i]].material.uniforms.u_UseExpressionGlobal.value;
            genome.beads[keys[i]].material.needsUpdate = true;
            console.log("DIFF:");
            console.log(genome.beads[keys[i]].material.uniforms.u_minExpression.value);
            console.log(genome.beads[keys[i]].material.uniforms.u_maxExpression.value);

            console.log(genome.beads[keys[i]].material.uniforms.u_minExpressionGlobal.value);
            console.log(genome.beads[keys[i]].material.uniforms.u_maxExpressionGlobal.value);
        }
    }
};

function onChangeFileName(value, state){
    var data = getData(value);
    genome.allObjects = data;
    setTimeout(function () {
        // fillElements(data);
        genome.createGenMap(data);
    }, 0);
    setTimeout(function () {
        genome.createMesh(data, state);
    }, 0);
    setTimeout(function () {
        addNewCheckboxs(data, state);
    }, 0);
}

function initGUI() {

    gui = new dat.GUI();
    gui.add( effectController, 'popupSearcher').name("Search...");
    gui.add( effectController, 'popup').name("Select parts");
    gui.add( effectController, 'useExpression').name("useExpression");
    gui.add( effectController, 'useExpressionGlobal').name("Switch Global Expression");

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

    gui.add( effectController, 'fileNameList', effectController.fileNameList).name("Selected file").onChange(function (value) {
        // var data = getData(value);
        onChangeFileName(value);
    });
    // gui.add( effectController, 'template', effectController.template).name("Part name").onChange(onChangeList); // controller 1

    // updatePartsGenome(effectController.template, "parts");

    // addNewCheckboxs(effectController.template);
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
    $("#searcherGene").hide();
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
        genome.changeVisible(element, 0);
    });
    previousPartofGene = newOptions;
    $.each(previousPartofGene, function(index, element){
        genome.changeVisible(element, 1);
    });
}

function updateSelectedParts (data, value, state) {
    document.getElementById("parts").options.length = 0;
    document.getElementById("parts2").options.length = 0;
    effectController['fileName'] = value;

    // initAll(data);
    // animate();


    var keys = Object.keys(data);
    effectController['template'] = keys;
    if(state!=null && state.selected!=null){
        effectController['template'] = state.selected;
    }
    var invisibleObjKeys = keys.diff(effectController['template']);
    updatePartsGenome(effectController['template'], "parts");
    updatePartsGenome(invisibleObjKeys, "parts2");
    $.each(effectController['template'], function (index, element) {
        genome.changeVisible(element, 1);
    });
    $.each(invisibleObjKeys, function (index, element) {
        genome.changeVisible(element, 0);
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
var foundKeys;
function searchGene() {
    foundKeys = {};
    var input = document.getElementById("searcherValue");
    var filterText = input.value.toUpperCase();
    if(filterText.length === 0 ){
        $('#listid').hide();
        return;
    }
    if(filterText.length <2)
        return;
    else{
        $('#listid').show();
    }
    var children = $('#listid').children();
    $.each(children, function (i, child) {
        if(child.textContent.toUpperCase().indexOf(filterText) > -1) {
            child.classList.remove('hidden');
            foundKeys[child.getAttribute('keyBead')] = 0;
        }
        else{
            if(!child.classList.contains('hidden'))
                child.classList+=' hidden';
        }
    })
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
function clearPopupObject(element) {
    $(element).remove();
}
function createPopup(pointInfo, screenPosition, isLocked) {
    // all forms
    var parent =  isLocked ? $('#pointInfo') : $('body');
    var BeadInfoForm =  $('<div/>')
        .attr("id", pointInfo.beadName)
        .addClass("FormGenInfo")
        .css('top', screenPosition.y)
        .css('left', screenPosition.x)
        .appendTo(parent);
    // title
    var title = $('<div/>')
        .attr("id", pointInfo.beadName)
        .addClass("FormGenTitle")
        .text(pointInfo.beadName)
        .appendTo(BeadInfoForm)
         .click(function () {
             if(BeadInfoForm.hasClass("lock"))
                genome.selectLockElement(pointInfo.beadName);
         });
    title.append($('<button/>')
        .addClass("FormGenTitleButton")
        .text("->")
        .click(function () {
            redirectToBead(pointInfo.beadName.split('_')[0]+':'+pointInfo.beadName.split(':')[1]);
        }));

    title.append($('<button/>')
        .addClass("FormGenTitleButton")
        .text("X")
        .click(function () {

            genome.closeForm(pointInfo.beadName);
            BeadInfoForm.remove();
            BeadInfoForm=null;
        }));
    // list gene
    var ListGene = $('<div/>')
        .addClass("ListGen")
        .appendTo(BeadInfoForm);

    // genInfo
    var keySet = {};
    var dataForBar = [];
    var geneLinkInfo = {};
    for(var index = 0; index < pointInfo.geneInfos.length; index++){

        var gen = pointInfo.geneInfos[index];
        if(keySet[gen.genomeName] == null ) {
            keySet[gen.genomeName] = 0;
            dataForBar.push({name: gen.genomeName, value: gen.expression})
            geneLinkInfo[gen.genomeName] = pointInfo.beadName.split('_')[0]+':'+gen.startGene+'-' +gen.endGene;
        }
        else {
            keySet[gen.genomeName] = keySet[gen.genomeName] + 1 ;
            dataForBar.push({name: gen.genomeName +'_'+ keySet[gen.genomeName], value: gen.expression})
            geneLinkInfo[gen.genomeName +'_'+ keySet[gen.genomeName]] = pointInfo.beadName.split('_')[0]+':'+gen.startGene+'-' + gen.endGene;
        }
    }

    var svg = createBarChart(ListGene[0], dataForBar, geneLinkInfo);
    // ListGene.append(barChart);
    // $.each(pointInfo.geneInfos, function(i)
    // {
    //     var link = $('<a/>')
    //         .attr("href", "#")
    //         .text(pointInfo.geneInfos[i].genomeName);
    //     $('<p/>')
    //         .append(link)
    //         .appendTo(ListGene)
    //         .click(function() {redirectToBead(pointInfo.beadName.split('_')[0]+':'+pointInfo.geneInfos[i].startGene+'-' +pointInfo.geneInfos[i].endGene)});
    // });
    addListeners(BeadInfoForm[0]);
    var buttonLock = $('<button/>')
        .addClass(isLocked ? "ButtonLock hidden" : "ButtonLock")
        .text("Lock")
        .click(function () {
            buttonUnLock.removeClass('hidden');
            buttonLock.addClass('hidden');
            BeadInfoForm.addClass('lock');
            BeadInfoForm.detach();
            genome.OnLock();
            attachPopup(BeadInfoForm);
        })
        .appendTo(BeadInfoForm);

    var buttonUnLock = $('<button/>')
        .addClass(isLocked ? "ButtonLock" : "ButtonLock hidden")
        .text("Unlock")
        .click(function () {
            buttonLock.removeClass('hidden');
            buttonUnLock.addClass('hidden');
            BeadInfoForm.removeClass('lock');
            BeadInfoForm.detach();
            $('body').append(BeadInfoForm);
            genome.OnUnlock(pointInfo.beadName);
        })
        .appendTo(BeadInfoForm);



    BeadInfoForm.append($('<button/>')
        .addClass("ButtonLock")
        .text("Export")
        .click(function () {
            genome.exportBead(pointInfo.beadName);
        }));

    var LinearScaleButton = $('<button/>')
        .addClass("ButtonLock")
        .text("RescaleLinear")
        .click(function () {
            LinearScaleButton.addClass('hidden');
            LogScaleButton.removeClass('hidden');
            rescaleLinear(svg, dataForBar);
        })
        .appendTo(BeadInfoForm);

    var LogScaleButton = $('<button/>')
        .addClass("ButtonLock hidden")
        .text("RescaleLog")
        .click(function () {
            LogScaleButton.addClass('hidden');
            LinearScaleButton.removeClass('hidden');
            rescaleLog(svg, dataForBar);
        })
        .appendTo(BeadInfoForm);



    return BeadInfoForm;
}

function attachPopup(element) {
    $('#pointInfo').removeClass('empty');
    $('#pointInfo').append(element);
}

function showShortLink(link, position) {
    var currentUrl = window.location;
    // <a href="/point?state='+link +'">'+currentUrl.protocol + "//" + currentUrl.host +'/point?state='+link+'</a>
    var formLink = $('<div/>')
        .attr("id", link)
        .addClass("ShortLink")
        .appendTo($('body'));
    var link = $('<a/>')
        .attr("href", "/point?state="+link)
        .text(currentUrl.protocol + "//" + currentUrl.host +'/point?state='+link)
        .appendTo(formLink);

    var closeButton = $('<div/>')
        .text("Close")
        .addClass("btn btn col-sm-2 col-md-offset-5 text-center")
        .appendTo(formLink);
    closeButton.click(function () {
        formLink.remove();
    });

    if(position!=null)
        formLink.offset({top:position.Y, left:position.X});
    else
        formLink.offset({top:30, left:30});
    formLink.show();
}

function createCssObject(pointInfo, cameraPosition) {
    var element =createPopup(pointInfo);
    $('#container').append(element);
    var cssObject = new THREE.CSS3DObject(element);
    cssObject.scale.set(0.003,0.003,0.003);
    cssObject.position.x = pointInfo.x;
    cssObject.position.y = pointInfo.y;
    cssObject.position.z = pointInfo.z;
    cssObject.lookAt(cameraPosition);
    return cssObject;
}

function saveState(filename) {
    var options = $("#beads").children();
    var selectedOptions = [];
    for(var i = 0; i< options.length; i++){
        if(options[i].childNodes[0].classList.contains( "active" ))
            selectedOptions.push(options[i].childNodes[0].textContent);
    }
    var keySelected = null;
    if(genome.SelectedBeadInfo!=null && genome.SelectedBeadInfo.beadInfo!=null){
        keySelected = genome.SelectedBeadInfo.beadInfo.beadName;
    }
    sendPost(
        {
            filename: filename,
            selected: selectedOptions,
            selectedBeadKey: keySelected,
            camera: genome.renderSystem.camera.toJSON(),
            lockElements: Object.keys(genome.LockedBeadInfo),
        },
        '/saveState',
        showShortLink);
}


function addNewCheckboxs(data, state) {
    var keys = Object.keys(data);
    if(keys!=null && keys.length>1){
        keys.sort();
    }
    $('#beads').empty();
    $.each(keys, function (i, key) {
        var row = $('<div/>')
            .addClass("row")
            .appendTo($('#beads'));
        var checkboxLabel = $("<div/>")
            .addClass("btn btn-primary col-6")
            .append('<input type="checkbox" autocomplete="off">')
            .text(key)
            .appendTo(row)
            .click(function () {
                genome.changeVisibleNew(this.textContent);
            });
        if(state==null || state.selected.includes(key))
            checkboxLabel.addClass('active');
        var colorFrame = $('<div/>')
            .addClass("square col-6")
            .css("background-color", '\#'+ genome.beads[key].colorBead.getHexString())
            .appendTo(row);
    });
}

function SphericalToScreen(x, y, z, camera, width, height) {
    // console.log(camera);
    var p = new THREE.Vector3(x, y, z);
    // console.log(p);
    var vector = p.project(camera);
    // console.log(vector);

    vector.x = (vector.x + 1) / 2 * width;
    vector.y = (-vector.y + 1) / 2 * height;
    // console.log(vector);
    return vector;
}

function ObjectSphericalToScreen(element, camera, width, height ) {

    var screenVector = new THREE.Vector3();
    element.localToWorld( screenVector );

    screenVector.project( camera );

    var posx = Math.round(( screenVector.x + 1 ) * width / 2 );
    var posy = Math.round(( 1 - screenVector.y ) * height / 2 );
    console.log(new THREE.Vector2(posx, posy));
    return new THREE.Vector2(posx, posy);
}

function ScreenToSpherical(x, y, camera, width, height) {
    var vector = new THREE.Vector3();
    vector.set(
        ( x / width ) * 2 - 1,
        - ( y / height ) * 2 + 1,
        0 );
    vector.unproject( camera );
    return vector;
};

function addListeners(obj){
    var mouseFunction = function (e) {
        moveAction(obj, {x: e.clientX, y: e.clientY});
    };

    var touchFunction = function (e) {
        var touches = e.changedTouches;
        moveAction(obj, {x: touches[0].pageX, y: touches[0].pageY});
    };
    obj.addEventListener('mousedown', function (e) {
        if(obj.classList.contains("lock"))
            return;
        mouseDownDrag(obj, mouseFunction, touchFunction);
        firstPosition = e;
        controllerCamera.enableRotate = false;
    }, false);
    obj.addEventListener('mouseup', function (e) {
        if(obj.classList.contains("lock"))
            return;
        mouseUpDrag(obj, mouseFunction, touchFunction);
        firstPosition = null;
        controllerCamera.enableRotate = true;
    }, false);

    obj.addEventListener('touchstart', function (e) {
        if(obj.classList.contains("lock"))
            return;
        mouseDownDrag(obj, mouseFunction, touchFunction);
        firstPosition = e;
        controllerCamera.enableRotate = false;
    }, false);
    obj.addEventListener('touchend', function (e) {
        if(obj.classList.contains("lock"))
            return;
        mouseUpDrag(obj, mouseFunction, touchFunction);
        firstPosition = null;
        controllerCamera.enableRotate = true;
    }, false);
};

function mouseUpDrag(obj, mouseFunction, touchFunction)
{
    obj.parentElement.removeEventListener('mousemove', mouseFunction, true);
    obj.parentElement.removeEventListener('touchmove', touchFunction, true);
};

function mouseDownDrag(obj, mouseFunction, touchFunction){
    obj.parentElement.addEventListener('mousemove', mouseFunction, true);
    obj.parentElement.addEventListener('touchmove', touchFunction, true);
};
var firstPosition;
var moveAction = function moveElement(obj, pos) {
    if(firstPosition==null)
        return;

    var rect = obj.getBoundingClientRect();
    obj.position = "absolute";
    obj.style.top = (rect.top + pos.y - firstPosition.y)+'px';
    obj.style.left = (rect.left + pos.x - firstPosition.x) + 'px';
    firstPosition = pos;
    genome.moveHtmlBlock();
};


