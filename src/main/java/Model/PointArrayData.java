package Model;

import java.io.Serializable;

/**
 * Created by user on 26.10.2016.
 */
public class PointArrayData implements Serializable {

    private static final long serialVersionUID = -5527566248002296042L;

    private double[][] latitudeArray;
    private double[][] longitudeArray;
    private int[][][] iceArray;

    public double[][] getLatitudeArray() {
        return latitudeArray;
    }

    public void setLatitudeArray(double[][] latitudeArray) {
        this.latitudeArray = latitudeArray;
    }

    public double[][] getLongitudeArray() {
        return longitudeArray;
    }

    public void setLongitudeArray(double[][] longitudeArray) {
        this.longitudeArray = longitudeArray;
    }

    public void setIceArray(int[][][] iceArray) {
        this.iceArray = iceArray;
    }

    public int[][][] getIceArray() {
        return iceArray;
    }
}
