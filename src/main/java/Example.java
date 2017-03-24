/**
 * Created by user on 28.09.2016.
 */
import DataReader.CSVReader;
import DataReader.NetCDFReader;
import Model.PointArrayData;
import Model.State;
import MyService.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@EnableAutoConfiguration
@EntityScan(basePackages={"Model"})
@ComponentScan({"MyService"})
public class Example  {


    @Autowired
    StateService stateService;

    @RequestMapping("/getData/{name}")
    PointArrayData home(@PathVariable String name) {
        NetCDFReader reader = new NetCDFReader();
        if(name.equals("test")){
            reader.loadDataFromFile("test1.nc");
            return reader.getCoordinates();
        }
        else{
            reader.loadDataFromFile(name+".nc");
            return reader.getCoordinates();
        }
    }

    @RequestMapping("/getGenome/{name}")
    Map<String, CSVReader.ObjectMed> getGenome(@PathVariable String name) {
        CSVReader reader = new CSVReader();
        int positionLast = name.lastIndexOf("_");
        if(positionLast>0)
           name = name.substring(0, positionLast) + "." +  name.substring(positionLast+1, name.length());
        return reader.readPoints(name);
    }


    @RequestMapping("/getFiles")
    List<String> getFiles() {
        CSVReader reader = new CSVReader();
        return reader.getFilesName();
    }

    @Autowired
    private HttpServletRequest request;

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public
    @ResponseBody
    ResponseEntity handleFileUpload(@RequestParam("file") MultipartFile file) {
        if (!file.isEmpty()) {
            try {
                System.out.println(file.getOriginalFilename());
                String uploadsDir = "/uploads/";
                String realPathtoUploads = request.getServletContext().getRealPath(uploadsDir);
                System.out.println(realPathtoUploads);
                if (!new File(realPathtoUploads).exists()) {
                    new File(realPathtoUploads).mkdir();
                }

//                log.info("realPathtoUploads = {}", realPathtoUploads);


                String orgName = file.getOriginalFilename();
                String filePath = realPathtoUploads + orgName;
                if (!new File(CSVReader.FOLDER_UPLOAD).exists()) {
                    new File(CSVReader.FOLDER_UPLOAD).mkdir();
                }
                File dest = new File(CSVReader.FOLDER_UPLOAD+orgName); //filePath);
                file.transferTo(dest);
            }
            catch (Exception e){
                System.out.println(e);
            }
        }
        return null;
    }

    @RequestMapping(value = "/saveState", method = RequestMethod.POST)
    public long saveNewState(@RequestBody String json) throws Exception {
        System.out.println("New state: " + json);
        if (!new File(CSVReader.FOLDER_UPLOAD+"/states/").exists()) {
            new File(CSVReader.FOLDER_UPLOAD+"/states/").mkdir();
        }
        Files.write(Paths.get(CSVReader.FOLDER_UPLOAD + "/states/default"), json.getBytes());
        State st = new State(json);
        stateService.create(st);
        return st.getId();
    }

    @RequestMapping("/getState/{id}")
    public State getState(@PathVariable long id) throws Exception {

        return stateService.getById(id);
    }
}
