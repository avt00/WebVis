package DataReader;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Created by amois on 11/16/2016.
 */
public class CSVReader {

    public static String FOLDER_UPLOAD = "C:\\Users\\amois\\Downloads\\DELETEME\\";

    public Map<String, ObjectMed> readPoints(String filename) {
//        URL url = this.getClass().getClassLoader().getResource(filename);
        Map<String, ObjectMed> points = new HashMap<>();
//        try {
//            System.out.println(Paths.get(url.toURI().getPath()));
//        } catch (URISyntaxException e) {
//            e.printStackTrace();
//        }
        try (Stream<String> stream = Files.lines(Paths.get(FOLDER_UPLOAD + filename))) {
            stream.forEach(line -> {
                String[] parts = line.split("\t");
                String id = parts[0].split(":")[0];
                if(points.containsKey(id)){
                    ObjectMed obj = points.get(id);
                    obj.points.add(new PointMed(Float.valueOf(parts[1]), Float.valueOf(parts[2]), Float.valueOf(parts[3]), Float.valueOf(parts[4])));
                }
                else{
                    ObjectMed obj = new ObjectMed();
                    obj.points.add(new PointMed(Float.valueOf(parts[1]), Float.valueOf(parts[2]), Float.valueOf(parts[3]), Float.valueOf(parts[4])));
                    points.put(id, obj);
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return points;
    }

    public List<String> getFilesName() {
        List<String> results = new ArrayList<String>();


        File[] files = new File(FOLDER_UPLOAD).listFiles();

        if(files==null)
            return new ArrayList<>();

        for (File file : files) {
            if (file.isFile()) {
                results.add(file.getName());
            }
        }

        return results;
    }


    class PointMed implements Serializable {

        private static final long serialVersionUID = -5527566248002293042L;
        public float x;
        public float y;
        public float z;

        public float r;

        public PointMed(float x, float y, float z, float r) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.r = r;
        }
    }

    public class ObjectMed  implements Serializable{

        private static final long serialVersionUID = -5527566241002296042L;

        public List<PointMed> points;
        public ObjectMed() {
            points = new ArrayList<PointMed>();
        }
    }
}
