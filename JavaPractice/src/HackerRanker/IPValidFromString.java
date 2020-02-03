package HackerRanker;

/**
 * we need to check all valid ip combinations from a string "2341234"
 * 
 * @author SV065115
 *
 */
public class IPValidFromString {
	public static void main(String[] args) {
		String s = "25525511135";
		String snew = s;
		for (int i = 1; i < s.length() - 2; i++) {
			for (int j = i + 1; j < s.length() - 1; j++) {
				for (int k = j + 1; k < s.length(); k++) {
					snew = snew.substring(0, k) + "." + snew.substring(k);
					snew = snew.substring(0, j) + "." + snew.substring(j);
					snew = snew.substring(0, i) + "." + snew.substring(i);
					if(isValid(snew)) {
					System.out.println(snew);
					}
					snew = s;
				}
			}
		}

	}

	static boolean isValid(String s) {
		String[] s2 = s.split("[.]"); 
		boolean check = true;
		for (String string : s2) {
			int num = Integer.parseInt(string);
			if (num > 255) {
				check = false;
				break;
			}
		}

		return check;
	}
}
