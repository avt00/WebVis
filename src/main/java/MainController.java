import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by user on 28.09.2016.
 */
@Controller
@EnableAutoConfiguration
public class MainController {

    @RequestMapping("/main")
    public String index() {
        return "Weather.html";
    }


    @RequestMapping("/maintest")
    public String Page() {
        return "test.html";
    }

    @RequestMapping("/mtest2")
    public String Page2() {
        return "test2.html";
    }

    @RequestMapping(value = "/point", method = RequestMethod.GET)
    public String medExample() {
        return "PointMed.html";
    }
}
