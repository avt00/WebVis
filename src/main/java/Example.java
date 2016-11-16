/**
 * Created by user on 28.09.2016.
 */
import DataReader.CSVReader;
import DataReader.NetCDFReader;
import Model.PointArrayData;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@EnableAutoConfiguration
public class Example {

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

}
