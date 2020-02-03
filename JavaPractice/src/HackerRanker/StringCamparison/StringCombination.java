package HackerRanker.StringCamparison;

public class StringCombination {
	public static void main(String[] args) {
		String s = "abcbaba";
		int count=0;
		for (int i = 0; i <= s.length()-1; i++) {
			for (int j = i+1; j <= s.length(); j++) {
				StringBuilder ansg   = new StringBuilder(s.substring(i,j));
				StringBuilder reverse = new StringBuilder(s.substring(i,j)).reverse();
				if(ansg.toString().equals(reverse.toString())) {
					//System.out.println(ansg);
					count++;
				}
			}
		}
		System.out.println(substrCount(7,s));
	}
	
	static long substrCount(int n, String s) {
	    long count = 0;
	    for (int i = 0; i < s.length(); i++) {
	        int innerCounter = 1;

	        int counterDown = 0;
	        int counterUp = 1;
	        while (i - innerCounter >= 0 && i + innerCounter < s.length()
	                && s.charAt(i - innerCounter) == s.charAt(i - 1) && s.charAt(i + innerCounter) == s.charAt(i - 1)) {
	            count++;
	            innerCounter++;
	        }

	        while (i - counterDown >= 0 && i + counterUp < s.length() && s.charAt(i - counterDown) == s.charAt(i)
	                && s.charAt(i + counterUp) == s.charAt(i)) {
	            count++;
	            counterDown++;
	            counterUp++;
	        }
	    }

	    return count + s.length();
	}
}
