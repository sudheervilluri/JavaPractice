package CodeChef;

public class SongDecoder {
	public static String SongDecoder (String song)
	  {
	     String s = song.replace("WUB"," ");
	     s=s.replace("  "," ");
	     s=s.replace("  "," ");
	     s=s.replace("  "," ");
	     return s.trim();
	   }
}
