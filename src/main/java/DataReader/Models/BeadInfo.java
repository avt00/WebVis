package DataReader.Models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by user on 10.05.2017.
 */
public class BeadInfo implements Serializable{

    private static final long serialVersionUID = -5527566248002293042L;
    public String beadName;
    public float x;
    public float y;
    public float z;
    public int order;
    public List<GenInfo> geneInfos;

    public float r;

    public BeadInfo(String beadName, float x, float y, float z, float r, int order) {
        this.beadName = beadName;
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.order = order;
        geneInfos = new ArrayList<>();
    }

    public void addGeneInfo(String genomeName, int startGene, int endGene, float expression) {
        geneInfos.add(new GenInfo(genomeName, startGene, endGene, expression));
    }

    public void addGeneInfo(GenInfo geneinfo) {
        geneInfos.add(geneinfo);
    }
}
