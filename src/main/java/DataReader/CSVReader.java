package DataReader;

import DataReader.Models.BeadInfo;
import DataReader.Models.GenInfo;
import DataReader.Models.ChainGenome;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;
import java.nio.file.Paths;

/**
 * Created by amois on 11/16/2016.
 */
public class CSVReader {

    public static String PATH = Paths.get(".").toAbsolutePath().normalize().toString();
    public static String FOLDER_UPLOAD = PATH + "/upload/";

    public Map<String, ChainGenome> readPoints(String filename) {
//        URL url = this.getClass().getClassLoader().getResource(filename);
        Map<String, ChainGenome> chains = new HashMap<>();
//        try {
//            System.out.println(Paths.get(url.toURI().getPath()));
//        } catch (URISyntaxException e) {
//            e.printStackTrace();
//        }
        try (Stream<String> stream = Files.lines(Paths.get(FOLDER_UPLOAD + filename))) {
            final int[] currentOrder = {0};
            stream.forEach(line -> {
                String[] parts = line.split("\t");
                if(parts.length == 10){
                    String id = parts[3].split(":")[0];
                    String[] position = parts[4].split(",");
                    if(chains.containsKey(id)){
                        ChainGenome obj = chains.get(id);

                        if(!obj.points.containsKey(parts[3])){
                            BeadInfo point = new BeadInfo(parts[3], Float.valueOf(position[0]), Float.valueOf(position[1]), Float.valueOf(position[2]), Float.valueOf(position[3]), currentOrder[0]);
                            point.addGeneInfo(new GenInfo(parts[8], Integer.parseInt(parts[1]), Integer.parseInt(parts[2]), Float.parseFloat(parts[9])));
                            obj.points.put(point.beadName, point);
                        }
                        else{
                            BeadInfo lastPoint = obj.points.get(parts[3]);
                            lastPoint.addGeneInfo(new GenInfo(parts[8], Integer.parseInt(parts[1]), Integer.parseInt(parts[2]), Float.parseFloat(parts[9])));
                        }
                    }
                    else{
                        currentOrder[0]=0;
                        ChainGenome obj = new ChainGenome();
                        BeadInfo point = new BeadInfo(parts[3], Float.valueOf(position[0]), Float.valueOf(position[1]), Float.valueOf(position[2]), Float.valueOf(position[3]), currentOrder[0]);
                        point.addGeneInfo(new GenInfo(id, Integer.parseInt(parts[1]), Integer.parseInt(parts[2]), Float.parseFloat(parts[9])));
                        obj.points.put(point.beadName, point);
                        chains.put(id, obj);
                    }
                }
                else {
                    String id = parts[3].split(":")[0];
                    if(chains.containsKey(id)){
                        ChainGenome obj = chains.get(id);
                        obj.points.put(parts[0], new BeadInfo(parts[0], Float.valueOf(parts[1]), Float.valueOf(parts[2]), Float.valueOf(parts[3]), Float.valueOf(parts[4]), currentOrder[0]));
                    }
                    else{
                        currentOrder[0]=0;
                        ChainGenome obj = new ChainGenome();
                        obj.points.put(parts[0], new BeadInfo(parts[0], Float.valueOf(parts[1]), Float.valueOf(parts[2]), Float.valueOf(parts[3]), Float.valueOf(parts[4]), currentOrder[0]));
                        chains.put(id, obj);
                    }
                }
                currentOrder[0]++;
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


//    class PointMed implements Serializable {
//
//        private static final long serialVersionUID = -5527566248002293042L;
//        public String beadName;
//        public float x;
//        public float y;
//        public float z;
//        public List<GeneInfo> geneInfos;
//
//        public float r;
//
//        public PointMed(String beadName, float x, float y, float z, float r) {
//            this.beadName = beadName;
//            this.x = x;
//            this.y = y;
//            this.z = z;
//            this.r = r;
//            geneInfos = new ArrayList<>();
//
//        }
//
//        public void addGeneInfo(String genomeName, int startGene, int endGene, float expression) {
//            geneInfos.add(new GeneInfo(genomeName, startGene, endGene, expression));
//        }
//
//        public void addGeneInfo(GeneInfo geneinfo) {
//            geneInfos.add(geneinfo);
//        }
//    }
//
//
//    public class GeneInfo  implements Serializable{
//
//            private static final long serialVersionUID = -5527566241002296042L;
//            public String genomeName;
//            public int startGene;
//            public int endGene;
//            public float expression;
//
//        public GeneInfo(String genomeName, int startGene, int endGene, float expression) {
//                this.genomeName = genomeName;
//                this.startGene = startGene;
//                this.endGene = endGene;
//                this.expression = expression;
//            }
//    }
//    public class ObjectMed  implements Serializable{
//
//        private static final long serialVersionUID = -5527566241002296042L;
//
//        public Map<String, PointMed> points;
//        public ObjectMed() {
//            points = new HashMap<> ();
//        }
//    }
}
