import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by user on 28.09.2016.
 */
@Controller
@EnableAutoConfiguration
public class MainController {
    @RequestMapping("/main")
    public String index() {
        return "hello.html";
    }

    @RequestMapping("/point")
    public String medExample() {
        return "PointMed.html";
    }
}
