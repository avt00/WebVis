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


    private float[] lat;
    private float[] lon;
    private double[] time;

    public float[] getLat() {
        return lat;
    }

    public void setLat(float[] lat) {
        this.lat = lat;
    }

    public float[] getLon() {
        return lon;
    }

    public void setLon(float[] lon) {
        this.lon = lon;
    }

    public double[] getTime() {
        return time;
    }

    public void setTime(double[] time) {
        this.time = time;
    }

    public float[][][] getDataValue() {
        return dataValue;
    }

    public void setDataValue(float[][][] dataValue) {
        this.dataValue = dataValue;
    }

    private float[][][] dataValue;
}
