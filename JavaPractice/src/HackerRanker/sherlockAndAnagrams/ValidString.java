package HackerRanker.sherlockAndAnagrams;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class ValidString {

	// Complete the isValid function below.
	static String isValid(String s) {

		Integer max = 0, min = 1;
		Map<String, Integer> lis = new HashMap<String, Integer>();
		for (int i = 97; i < 123; i++) {
			char c = (char) i;
			String temp = s.replace(c + "", "");
			if (s.length() != temp.length()) {
				lis.put(c + "", s.length() - temp.length());
			}
			if (max < s.length() - temp.length()) {
				min = max;
				max = s.length() - temp.length();
			}
		}
		boolean min_freq=lis.containsValue(min);
		if (min == max) {
			return "YES";
		}
		if (((max - min == 1)) || (min == 0)|| (min == 1)) {
			return "YES";
		} else {
			return "NO";
		}

	}

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		String s = scanner.nextLine();

		String result = isValid(s);

		bufferedWriter.write(result);
		bufferedWriter.newLine();

		bufferedWriter.close();

		scanner.close();
	}
}
