/**
 * Created by user on 10.01.2017.
 */
effectController.fileNameList =  getFilesName();
var fileName = effectController.fileNameList[0];
initGUI();
init();
if(fileName)
    onChangeFileName(fileName);