/**
 * Created by user on 10.01.2017.
 */
var state = getParameterByName('state');
var jsonState = null;
if(state!=null) {
    var loader = new THREE.ObjectLoader()
    jsonState = getRequest('/getState/' + state);
    console.log(jsonState);
}
effectController.fileNameList =  getRequest('/getFiles');

effectController.fileName = effectController.fileNameList[0];
if(jsonState!=null && jsonState.filename!=null){
    effectController.fileName = jsonState.filename;
}


initGUI();
init(jsonState);
if(effectController.fileName)
    onChangeFileName(effectController.fileName, jsonState);