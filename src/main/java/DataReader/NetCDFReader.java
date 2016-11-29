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

    public List<List<PointData>> read(){
        URL url = this.getClass().getClassLoader().getResource("test1.nc");
        NetcdfFile dataFile = null;
        List<List<PointData>> listPoint = new ArrayList<List<PointData>>();
        ArrayDouble.D2 listLatitude = null;
        ArrayDouble.D2 listLongitude = null;
        ArrayDouble.D1 listTime = null;
        int[] sizeArray = new int[2];
        try {
            dataFile = NetcdfFile.open(url.toURI().getPath(), null);
            // Retrieve the variable named "data"
            List<Variable> vi = dataFile.getVariables();
            for (Variable v : vi.subList(0, 4)) {
                System.out.println(v.getFullName());
                if(v.getFullName().equals("latitude")) {
                    int[] shape = v.getShape();
                    sizeArray = v.getShape();
                    int[] origin = new int[2];
                    System.out.println(v.getFullName() + " "+ v.getDataType() + " " + shape.length);
                    ArrayDouble.D2 dataArray;
                    dataArray = (ArrayDouble.D2) v.read(origin, shape);
                    listLatitude = dataArray;
                }
                else if(v.getFullName().equals("longitude")){
                    int[] shape = v.getShape();
                    sizeArray = v.getShape();
                    int[] origin = new int[2];
                    System.out.println(v.getFullName() + " "+ v.getDataType() + " " + shape.length);
                    ArrayDouble.D2 dataArray;
                    dataArray = (ArrayDouble.D2) v.read(origin, shape);
                    listLongitude = dataArray;
                }
//                else if(v.getFullName().equals("time")){
//                    int[] shape = v.getShape();
//                    sizeArray = v.getShape();
//                    int[] origin = new int[1];
//                    System.out.println(v.getFullName() + " "+ v.getDataType() + " " + shape.length);
//                    ArrayDouble.D1 dataArray;
//                    dataArray = (ArrayDouble.D1) v.read(origin, shape);
//                    listTime  = dataArray;
//                }
            }
            // The file is closed no matter what by putting inside a try/catch block.
        } catch (java.io.IOException e) {
            e.printStackTrace();

        } catch (InvalidRangeException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } finally {
            if (dataFile != null)
                try {
                    dataFile.close();
                } catch (IOException ioe) {
                    ioe.printStackTrace();
                }
        }
        for(int i = 0; i < sizeArray[0]; i++){
            ArrayList<PointData> newList = new ArrayList<PointData>();
            for(int j = 0; j < sizeArray[1]; j++)
                newList.add(new PointData(listLatitude.get(i, j), listLongitude.get(i,j)));
            listPoint.add(newList);
        }
        System.out.println("*** SUCCESS reading example file simple_xy.nc!");
        return listPoint;
    }

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
        double[][] arrayLatitude = (double[][])mapDataNcDF.get("latitude").copyToNDJavaArray();
        double[][] arrayLongitude = (double[][])mapDataNcDF.get("longitude").copyToNDJavaArray();
        int[][][] arrayIce = (int[][][])mapDataNcDF.get("MultIce").copyToNDJavaArray();
        PointArrayData data = new PointArrayData();
        data.setLatitudeArray(arrayLatitude);
        data.setLongitudeArray(arrayLongitude);
        data.setIceArray(arrayIce);
        return data;
    }
}
