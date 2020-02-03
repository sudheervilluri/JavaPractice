package CodeChef;

public class Maskify {
	public static String maskify(String str) {

		String temp = "";
		for (int i = 0; i < str.length(); i++) {

			if (i > str.length() - 5) {
				temp += str.charAt(i);
			} else {
				temp += "#";
			}
		}

		return temp;

	}
}
