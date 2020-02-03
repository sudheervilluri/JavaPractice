package HackerRanker.sherlockAndAnagrams;

import java.io.IOException;
import java.util.Arrays;

public class Angram {

	// Complete the makeAnagram function below.
	static int makeAnagram(String a, String b) {
		int[] chars = new int[26];
	    for (char c1 : a.toCharArray()) { chars[c1-97]++; }
	    for (char c2 : b.toCharArray()) { chars[c2-97]--; }
	    int count = 0;
	    for(int i: chars) {count += Math.abs(i);}

		return count;
		
	}


	public static void main(String[] args) throws IOException {
		String a = "bugexikjevtubidpulaelsbcqlupwetzyzdvjphn";
		String b = "lajoipfecfinxjspxmevqxuqyalhrsxcvgsdxxkacspbchrbvvwnvsdtsrdk";

		int res = makeAnagram(a, b);

		System.out.println(res);
		
	}
}
