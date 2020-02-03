package CodeChef;

public class LongestPalindrom {
	public static String longestPalindrome(String s) {
		if (s == null || s.length() < 1)
			return "";
		int start = 0, end = 0;
		for (int i = 0; i < s.length(); i++) {
			int len1 = expandAroundCenter(s, i, i);
			int len2 = expandAroundCenter(s, i, i + 1);
			int len = Math.max(len1, len2);
			if (len > end - start) {
				start = i - (len - 1) / 2;
				end = i + len / 2;
			}
		}
		return s.substring(start, end + 1);
	}

	private static int expandAroundCenter(String s, int left, int right) {
		int L = left, R = right;
		while (L >= 0 && R < s.length() && s.charAt(L) == s.charAt(R)) {
			L--;
			R++;
		}
		return R - L - 1;
	}

	// A utility function to get max of two integers
	static String max(String string, String string2) {
		return (string.length() > string2.length()) ? string : string2;
	}

	public static String approachTwo(String s) {
		while (s != "") {

			if (check(s)) {
				return s;
			}
			if (check(s.substring(0, s.length() - 1))) {
				return s.substring(0, s.length() - 1);
			}
			if (check(s.substring(1, s.length()))) {
				return s.substring(1, s.length());
			}

			s = s.substring(1, s.length() - 1);
		}
		return "";
	}

	static boolean check(String s) {
		StringBuilder temp = new StringBuilder(s);

		if (s.equals(temp.reverse().toString()) && s.trim() != "") {
			return true;
		}
		return false;
	}

	public static void main(String[] args) {
		System.out.println(longestPalindrome("babad"));
	}
}
