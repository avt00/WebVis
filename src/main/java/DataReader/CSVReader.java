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

    public static String FOLDER_UPLOAD = "C:\\Users\\user\\Downloads\\DELETEME\\";

    public Map<String, ObjectMed> readPoints(String filename) {
//        URL url = this.getClass().getClassLoader().getResource(filename);
        Map<String, ObjectMed> chains = new HashMap<>();
//        try {
//            System.out.println(Paths.get(url.toURI().getPath()));
//        } catch (URISyntaxException e) {
//            e.printStackTrace();
//        }
        try (Stream<String> stream = Files.lines(Paths.get(FOLDER_UPLOAD + filename))) {
            stream.forEach(line -> {
                String[] parts = line.split("\t");
                if(parts.length == 10){
                    String id = parts[0];
                    String[] position = parts[4].split(",");
                    if(chains.containsKey(id)){
                        ObjectMed obj = chains.get(id);
                        PointMed lastPoint = obj.points.get(obj.points.size()-1);
                        if(!lastPoint.beadName.equals(parts[3])){
                            PointMed point = new PointMed(parts[3], Float.valueOf(position[0]), Float.valueOf(position[1]), Float.valueOf(position[2]), Float.valueOf(position[3]));
                            point.addGeneInfo(new GeneInfo(parts[8], Integer.parseInt(parts[1]), Integer.parseInt(parts[2])));
                            obj.points.add(point);
                        }
                        else{
                            lastPoint.addGeneInfo(new GeneInfo(parts[8], Integer.parseInt(parts[1]), Integer.parseInt(parts[2])));
                        }
                    }
                    else{
                        ObjectMed obj = new ObjectMed();
                        PointMed point = new PointMed(parts[3], Float.valueOf(position[0]), Float.valueOf(position[1]), Float.valueOf(position[2]), Float.valueOf(position[3]));
                        point.addGeneInfo(new GeneInfo(parts[0], Integer.parseInt(parts[1]), Integer.parseInt(parts[2])));
                        obj.points.add(point);
                        chains.put(id, obj);
                    }
                }
                else {
                    String id = parts[0].split(":")[0];
                    if(chains.containsKey(id)){
                        ObjectMed obj = chains.get(id);
                        obj.points.add(new PointMed(parts[0], Float.valueOf(parts[1]), Float.valueOf(parts[2]), Float.valueOf(parts[3]), Float.valueOf(parts[4])));
                    }
                    else{
                        ObjectMed obj = new ObjectMed();
                        obj.points.add(new PointMed(parts[0], Float.valueOf(parts[1]), Float.valueOf(parts[2]), Float.valueOf(parts[3]), Float.valueOf(parts[4])));
                        chains.put(id, obj);
                    }
                }

            });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return chains;
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
        public String beadName;
        public float x;
        public float y;
        public float z;
        public List<GeneInfo> geneInfos;

        public float r;

        public PointMed(String beadName, float x, float y, float z, float r) {
            this.beadName = beadName;
            this.x = x;
            this.y = y;
            this.z = z;
            this.r = r;
            geneInfos = new ArrayList<>();

        }

        public void addGeneInfo(String genomeName, int startGene, int endGene) {
            geneInfos.add(new GeneInfo(genomeName, startGene, endGene));
        }

        public void addGeneInfo(GeneInfo geneinfo) {
            geneInfos.add(geneinfo);
        }
    }


    public class GeneInfo  implements Serializable{

        private static final long serialVersionUID = -5527566241002296042L;
        public String genomeName;
        public int startGene;
        public int endGene;

        public GeneInfo(String genomeName, int startGene, int endGene) {
            this.genomeName = genomeName;
            this.startGene = startGene;
            this.endGene = endGene;
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
