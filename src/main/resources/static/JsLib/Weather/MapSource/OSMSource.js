/**
 * Created by user on 21.04.2017.
 */
/**
 * Created by user on 21.04.2017.
 */
function OSMMapSource()
{
    this.baseUrl    = "b.tile.openstreetmap.org";
    this.UrlFormat  = "http://{0}/{1}/{2}/{3}.png";
    this.Name       = "OSM Map";
    this.ShortName  = "OSM";

    this.GenerateUrl = function(x, y, zoom)
    {
        return "http://"+this.baseUrl+"/"+zoom + "/" + x + "/" + y+".png";
        // return String.Format(UrlFormat, UrlFormatServer, GetServerNum(zoom,y,4), UrlFormatRequest, MapVersion, Language,  x, sec1, y, zoom, sec2, Server);
    }
}