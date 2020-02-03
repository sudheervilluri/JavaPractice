package HackerRanker.sherlockAndAnagrams;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Solution {

	// Complete the sherlockAndAnagrams function below.
	static int sherlockAndAnagrams(String s) {

		List<String> sl =  new ArrayList<String>();
		int length2 = s.length();
		for (int i = 0; i < length2; i++) {
			for (int j = 1; j < length2; j++) {
				if(i!=j && i<j)
				sl.add(s.substring(i, j));
			}
		}
		return 0;
	}

	public static void main(String[] args) throws IOException {
		File file = new File(
				"C:\\Users\\SV065115\\OneDrive - Cerner Corporation\\Desktop\\Drive\\Work\\HIUI\\Workspace\\temp\\JavaPractice\\JavaPractice\\src\\HackerRanker\\sherlockAndAnagrams\\input00.txt");
		Scanner scanner = new Scanner(file);
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		int q = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int qItr = 0; qItr < q; qItr++) {
			String s = scanner.nextLine();

			int result = sherlockAndAnagrams(s);

			bufferedWriter.write(String.valueOf(result));
			bufferedWriter.newLine();
		}

		bufferedWriter.close();

		scanner.close();
	}
}
