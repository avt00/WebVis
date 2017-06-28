package DataReader;

import DataReader.Models.BeadInfo;
import DataReader.Models.ChainGenome;
import DataReader.Models.GenInfo;
import org.w3c.dom.Document;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Created by user on 10.05.2017.
 */
public class XmlReader extends DefaultHandler {
    public static String FOLDER_UPLOAD = "C:\\Users\\user\\Downloads\\DELETEME\\";

    private Map<String, ChainGenome> chains = new HashMap<>();


    private String currentChrId;
    private int currentOrder;

    public Map<String, ChainGenome> readPoints(String filename) {
        currentOrder = 0;
        SAXParserFactory factory = SAXParserFactory.newInstance();
        try {
            SAXParser parser = factory.newSAXParser();
            parser.parse(FOLDER_UPLOAD + filename, this);
        } catch (ParserConfigurationException e) {
            System.out.println("ParserConfig error");
        } catch (SAXException e) {
            System.out.println("SAXException : xml not well formed");
        } catch (IOException e) {
            System.out.println("IO error");
        }

        return chains;
    }

    @Override
    public void startElement(String s, String s1, String elementName, Attributes attributes) throws SAXException {
        if (elementName.equalsIgnoreCase("marker")) {
            currentChrId = attributes.getValue("chrID");
            BeadInfo beadInfo = new BeadInfo(attributes.getValue("beadID"), Float.parseFloat(attributes.getValue("x")), Float.parseFloat(attributes.getValue("y")), Float.parseFloat(attributes.getValue("z")), Float.parseFloat(attributes.getValue("r")), currentOrder);
            if(chains.containsKey(currentChrId)){
                chains.get(currentChrId).points.put(attributes.getValue("beadID"), beadInfo);
            }
            else{
                ChainGenome obj = new ChainGenome();
                obj.points.put(beadInfo.beadName, beadInfo);
                chains.put(currentChrId, obj);
                currentOrder = 0;
            }
        }
        currentOrder++;
        if (elementName.equalsIgnoreCase("link")) {
//            System.out.println("Link");
        }
    }
    @Override
    public void endElement(String s, String s1, String element) throws SAXException {

    }
}
