/**
 * Created by user on 21.04.2017.
 */
function GoogleMapSource()
{
    this.SecureWord			= "Galileo";
    this.Sec1				= "&s=";
    this.UrlFormat			= "http://{0}{1}.{10}/{2}/lyrs={3}&hl={4}&x={5}{6}&y={7}&z={8}&s={9}";
    this.UrlFormatServer	= "mt";
    this.UrlFormatRequest	= "vt";
    this.MapVersion			= "m@249000000";
    this.Language			= "en";
    this.Server				= "google.com";


    this.GetSecureWords = function(x, y, sec1, sec2)
    {
        sec1 = ""; // after &x=...
        sec2 = ""; // after &zoom=...

        var seclen	= ((x * 3) + y) % 8;
        sec2	= this.SecureWord.substring(0, seclen);
        if (y >= 10000 && y < 100000) {
            sec1 = Sec1;
        }

        return {x: sec1, y: sec2};
    };


    this.GetServerNum = function(x, y, max)
    {
        return (x + 2 * y) % max;
    };


    this.RefererUrl = "http://maps.google.com/";
    this.Name = "GoogleMap";
    this.ShortName = "GM";

    this.GenerateUrl = function(x, y, zoom)
    {
        var sec = this.GetSecureWords(x, y);
        var sec1 = sec.x; // after &x=...
        var sec2 = sec.y; // after &zoom=...
        // "http://{0}{1}.{10}/{2}/lyrs={3}&hl={4}&x={5}{6}&y={7}&z={8}&s={9}";
        return "http://" + this.UrlFormatServer + this.GetServerNum(zoom,y,4) + "." + this.Server + "/" + this.UrlFormatRequest + "/lyrs=" + this.MapVersion + "&hl=" + this.Language + "&x=" + x + sec1
            + "&y=" + y + "&z=" + zoom + "&s=" + sec2;
        // return this.UrlFormat.format(this.UrlFormatServer, this.GetServerNum(zoom,y,4), this.UrlFormatRequest, this.MapVersion, this.Language,  x, sec1, y, zoom, sec2, this.Server);
        // return String.Format(UrlFormat, UrlFormatServer, GetServerNum(zoom,y,4), UrlFormatRequest, MapVersion, Language,  x, sec1, y, zoom, sec2, Server);
    }
}