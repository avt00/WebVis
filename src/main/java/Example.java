/**
 * Created by user on 28.09.2016.
 */
import DataReader.NetCDFReader;
import Model.PointArrayData;
import Model.PointData;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@EnableAutoConfiguration
public class Example {

    @RequestMapping("/getData/{name}")
    PointArrayData home(@PathVariable String name) {
        NetCDFReader reader = new NetCDFReader();
        if(name.equals("test")){
            reader.loadDataFromFile("test1.nc");
            return reader.getCoordinates();
        //            return reader.read();
        }
        else{
            return null;
        }
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(new Object[]{Example.class, MainController.class}, args);
    }

}
