package CodeChef;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class SongDecoderTest {
	 @Test
	    public void Test1() {
	      assertEquals("ABC", new SongDecoder().SongDecoder("WUBWUBABCWUB"));
	    }
	    @Test
	    public void Test2()
	    {
	       assertEquals("R L", new SongDecoder().SongDecoder("RWUBWUBWUBLWUB"));
	    }
}
