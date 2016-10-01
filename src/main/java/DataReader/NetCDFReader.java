package DataReader;

import Model.PointData;
import ucar.nc2.NetcdfFile;
import ucar.nc2.Variable;
import ucar.ma2.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by user on 28.09.2016.
 */
public class NetCDFReader {
    public static List<List<PointData>> read(){
        NetcdfFile dataFile = null;
        String filename = "D:\\Coding\\Java\\WeatherServer\\src\\main\\resources\\test1.nc";
        String listVariable = "";
        List<List<PointData>> listPoint = new ArrayList<List<PointData>>();
        ArrayDouble.D2 listLatitude = null;
        ArrayDouble.D2 listLongitude = null;
        int[] sizeArray = new int[2];
        try {

            dataFile = NetcdfFile.open(filename, null);

            // Retrieve the variable named "data"
            List<Variable> vi = dataFile.getVariables();

            for (Variable v : vi.subList(0, 2)) {

                listVariable+=v.getFullName()+" ";
                int[] shape = v.getShape();
                sizeArray = v.getShape();
                int[] origin = new int[2];
                System.out.println(v.getFullName() + " "+ v.getDataType() + " " + shape.length);
                ArrayDouble.D2 dataArray;
                dataArray = (ArrayDouble.D2) v.read(origin, shape);
                if(v.getFullName().equals("latitude"))
                    listLatitude = dataArray;
                if(v.getFullName().equals("longitude"))
                    listLongitude = dataArray;
            }

            // The file is closed no matter what by putting inside a try/catch block.
        } catch (java.io.IOException e) {
            e.printStackTrace();

        } catch (InvalidRangeException e) {
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
}
