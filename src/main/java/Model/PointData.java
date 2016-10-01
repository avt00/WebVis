package Model;

import java.io.Serializable;

/**
 * Created by user on 28.09.2016.
 */
public class PointData  implements Serializable {

    private static final long serialVersionUID = -5527566248002296042L;

    private double Latitude;
    private double Longitude;

    public PointData(double latitude, double longitude) {
        Latitude = latitude;
        Longitude = longitude;
    }

    public double getLongitude() {
        return Longitude;
    }

    public void setLongitude(double longitude) {
        Longitude = longitude;
    }

    public double getLatitude() {

        return Latitude;
    }

    public void setLatitude(double latitude) {
        Latitude = latitude;
    }
}
