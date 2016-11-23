/**
 * Created by user on 28.09.2016.
 */
import DataReader.CSVReader;
import DataReader.NetCDFReader;
import Model.PointArrayData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.Map;

@RestController
@EnableAutoConfiguration
public class Example  {

    @RequestMapping("/getData/{name}")
    PointArrayData home(@PathVariable String name) {
        NetCDFReader reader = new NetCDFReader();
        if(name.equals("test")){
            reader.loadDataFromFile("test1.nc");
            return reader.getCoordinates();
        }
        else{
            return null;
        }
    }

    @RequestMapping("/getPoints/{name}")
    Map<String, CSVReader.ObjectMed> getPoints(@PathVariable String name) {
        CSVReader reader = new CSVReader();
        return reader.readPoints("lmna.csv");
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(new Object[]{Example.class, MainController.class}, args);
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
                File dest = new File("C:\\Users\\user\\Downloads\\DELETEME\\"+orgName); //filePath);
                file.transferTo(dest);
            }
            catch (Exception e){
                System.out.println(e);
            }
        }
        return null;
    }

}
