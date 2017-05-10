package DataReader.Models;

import java.io.Serializable;

/**
 * Created by user on 10.05.2017.
 */
public class GenInfo implements Serializable {

    private static final long serialVersionUID = -5527566241002296042L;
    public String genomeName;
    public int startGene;
    public int endGene;
    public float expression;

    public GenInfo(String genomeName, int startGene, int endGene, float expression) {
        this.genomeName = genomeName;
        this.startGene = startGene;
        this.endGene = endGene;
        this.expression = expression;
    }
}
