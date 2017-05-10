package DataReader.Models;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by user on 10.05.2017.
 */
public class ChainGenome implements Serializable {

    private static final long serialVersionUID = -5527566241002296042L;

    public Map<String, BeadInfo> points;
    public ChainGenome() {
        points = new HashMap<>();
    }
}
