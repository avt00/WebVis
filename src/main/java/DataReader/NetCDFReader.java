package DataReader;

import Model.PointArrayData;
import Model.PointData;
import ucar.nc2.NetcdfFile;
import ucar.nc2.Variable;
import ucar.ma2.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by user on 28.09.2016.
 */
public class NetCDFReader {

    private Map<String, Array> mapDataNcDF;

    public void loadDataFromFile(String filename){
        URL url = this.getClass().getClassLoader().getResource(filename);
        mapDataNcDF = new HashMap<String, Array>();
        NetcdfFile dataFile = null;
        try {
            System.out.println(url.toURI().getPath());
            dataFile = NetcdfFile.open(url.toURI().getPath(), null);
            // Retrieve the variable named "data"
            List<Variable> vi = dataFile.getVariables();
            for (Variable v : vi) {
                System.out.println();
                int[] sizeVariable;
                sizeVariable = v.getShape();
                int[] origin = new int[sizeVariable.length];
                Array dataArray = v.read(origin, sizeVariable);
                mapDataNcDF.put(v.getFullName(), dataArray);

            }
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InvalidRangeException e) {
            e.printStackTrace();
        }
    }

    public PointArrayData getCoordinates(){
        float[] arrayLatitude = (float[])mapDataNcDF.get("lat").copyToNDJavaArray();
        float[] arrayLongitude = (float[])mapDataNcDF.get("lon").copyToNDJavaArray();
        double[] arrayTime = (double[])mapDataNcDF.get("time").copyToNDJavaArray();
        float[][][] arrayAir = (float[][][])mapDataNcDF.get("air").copyToNDJavaArray();
        //        int[][][] arrayIce = (int[][][])mapDataNcDF.get("MultIce").copyToNDJavaArray();
        PointArrayData data = new PointArrayData();
        data.setLat(arrayLatitude);
        data.setLon(arrayLongitude);
        data.setDataValue(arrayAir);
        data.setTime(arrayTime);
//        data.setLatitudeArray(arrayLatitude);
//        data.setLongitudeArray(arrayLongitude);
//        data.setIceArray(arrayIce);
        return data;
    }
}
